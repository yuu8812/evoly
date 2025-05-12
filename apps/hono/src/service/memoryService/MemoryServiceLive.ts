import { vertex } from "@ai-sdk/google-vertex"
import { Effect, Layer, pipe } from "effect"
import type { PipelineStage } from "mongoose"
import { createMemoryModel } from "../../models/Memory"
import { MongooseServiceTag } from "../mongooseService/MongooseService"
import { type MemoryService, MemoryServiceTag } from "./MemoryService"

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const pipeline = ({ v, agentId, k }: { v: number[]; agentId?: string; k?: number }): PipelineStage[] => [
  {
    $vectorSearch: {
      index: "vector_search_index",
      path: "embedding",
      queryVector: v,
      numCandidates: 100,
      limit: k ?? 20
    }
  },
  {
    $project: {
      _id: 1, // _idフィールドを除外
      text: 1 // textフィールドのみを含める
    }
  }
]
const embedder = vertex.textEmbeddingModel("text-multilingual-embedding-002")

const getVectorFromText = (str: string) =>
  pipe(
    Effect.Do,
    Effect.bind("embedResp", () =>
      Effect.tryPromise({
        try: async () => await embedder.doEmbed({ values: [str, new Date().toISOString().toString()] }),
        catch: (err) => new Error(`Embedding 作成失敗: ${err}`)
      })
    ),
    Effect.bind("vector", ({ embedResp }) => Effect.succeed(Array.from(embedResp.embeddings[0]))),
    Effect.map(({ vector }) => vector)
  )

export const MemoryServiceLive: MemoryService = {
  add: ({ agentId, text }) =>
    pipe(
      Effect.Do,
      Effect.bind("vector", () => getVectorFromText(text)),
      Effect.bind("db", () => MongooseServiceTag),
      Effect.bind("connection", ({ db }) => db.connection),
      Effect.flatMap(({ vector, connection }) =>
        Effect.tryPromise({
          try: async () => {
            const m = createMemoryModel(connection)
            await m.create({ agentId, text, embedding: vector })
          },
          catch: (err) => new Error(`Memory 保存失敗: ${err}`)
        })
      ),
      Effect.map(() => undefined)
    ),
  retrieve: ({ agentId = undefined, query, k }) =>
    pipe(
      Effect.Do,
      Effect.bind("vector", () => getVectorFromText(query)),
      Effect.bind("db", () => MongooseServiceTag),
      Effect.bind("connection", ({ db }) => db.connection),
      Effect.flatMap(({ connection, vector }) =>
        Effect.tryPromise({
          try: async () => {
            const m = createMemoryModel(connection)
            return (await m.aggregate(pipeline({ v: vector, agentId, k }))) as { text: string }[]
          },
          catch: (err) => new Error(`Memory 取得失敗: ${err}`)
        })
      ),
      Effect.tap((r) => Effect.log(JSON.stringify(r))),
      Effect.map((res) => res)
    )
}

export const MemoryServiceLiveLayer = Layer.succeed(MemoryServiceTag, MemoryServiceLive)
