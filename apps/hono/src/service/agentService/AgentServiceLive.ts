import { Effect, Layer } from "effect"
import { PARENT_INFO } from "../../example/parentInfo"
import { type AgentDoc, type Personality, type Stats, createAgentModel } from "../../models/Agent"
import { createAgentModelModel } from "../../models/AgentModel"
import { CloudStorageServiceTag } from "../cloudStorageService/CloudStorageService"
import { MongooseServiceTag } from "../mongooseService/MongooseService"
import { type AgentService, AgentServiceTag } from "./AgentService"
import { genImageAgent } from "./agents/genImage"
import { initialAgent } from "./agents/initialAgent"
import { placeMentAgent } from "./agents/placementAgent"
import { justifyJson } from "./utils/justifyJson"

const agentCreateEffect = () =>
  Effect.Do.pipe(
    Effect.bind("storage", () => CloudStorageServiceTag),
    Effect.bind("res", () =>
      Effect.tryPromise({
        try: async () => {
          const r = await initialAgent.generate(`親の情報です${JSON.stringify(PARENT_INFO)}`, {})
          const parsed: {
            stats: Stats
            personality: Personality
            name: string
          } = JSON.parse(justifyJson(r.text))
          return parsed
        },
        catch: (e) => {
          console.log(e)
          throw new Error()
        }
      })
    ),
    Effect.bind("imagesRes", () =>
      Effect.all(
        [
          Effect.tryPromise({
            try: () => genImageAgent.generateEyesOpen("コードギアスのルルーシュっぽくしてね"),
            catch: (e) => {
              console.log(e)
              throw new Error("目を開けた画像の生成に失敗しました")
            }
          }),
          Effect.tryPromise({
            try: () => genImageAgent.generateEyesClosed("コードギアスのルルーシュっぽくしてね"),
            catch: (e) => {
              console.log(e)
              throw new Error("目を閉じた画像の生成に失敗しました")
            }
          }),
          Effect.tryPromise({
            try: () => genImageAgent.generateFaceNormal("コードギアスのルルーシュっぽくしてね"),
            catch: (e) => {
              console.log(e)
              throw new Error("通常の顔画像の生成に失敗しました")
            }
          }),
          Effect.tryPromise({
            try: () => genImageAgent.generateMouthOpened("コードギアスのルルーシュっぽくしてね"),
            catch: (e) => {
              console.log(e)
              throw new Error("口を開けた画像の生成に失敗しました")
            }
          }),
          Effect.tryPromise({
            try: () => genImageAgent.generateMouthClosed("コードギアスのルルーシュっぽくしてね"),
            catch: (e) => {
              console.log(e)
              throw new Error("口を閉じた画像の生成に失敗しました")
            }
          })
        ],
        { concurrency: "unbounded" }
      ).pipe(
        Effect.map(([eyeOpenR, eyeClosedR, normalFaceR, mouthOpenR, mouthClosedR]) => {
          if (!eyeOpenR || !eyeClosedR || !normalFaceR || !mouthOpenR || !mouthClosedR) {
            throw new Error("画像生成に失敗しました")
          }
          return [...eyeOpenR, ...eyeClosedR, ...normalFaceR, ...mouthOpenR, ...mouthClosedR]
        })
      )
    ),
    Effect.bind("placementRes", ({ imagesRes }) =>
      Effect.tryPromise({
        try: async () => {
          const r = await placeMentAgent.generate(Uint8Array.from(Buffer.from(imagesRes[2].b64_json ?? "", "base64")))
          console.log(r.text)
          const parsed: {
            percent: {
              eye: {
                x: number
                y: number
              }
              mouth: {
                x: number
                y: number
              }
              nose: {
                x: number
                y: number
              }
            }
          } = JSON.parse(justifyJson(r.text ?? ""))
          console.log(parsed)
          return parsed
        },
        catch: (e) => {
          console.log(e)
          throw new Error()
        }
      })
    ),
    Effect.bind("uploadRes", ({ storage, imagesRes }) =>
      storage.upload(
        imagesRes.map((image) => ({
          base64: image.b64_json ?? "",
          metadata: { contentType: "image/png" }
        }))
      )
    ),
    Effect.bind("db", () => MongooseServiceTag),
    Effect.bind("connection", ({ db }) => db.connection),
    Effect.bind("agentCreateRes", ({ connection, res }) =>
      Effect.tryPromise({
        try: async () => {
          const agent = createAgentModel(connection)
          return await agent.create({
            userId: "userid",
            stats: res.stats,
            personality: res.personality,
            name: res.name
          })
        },
        catch: (err) => new Error(`DB保存エラー: ${err}`)
      })
    ),
    Effect.bind("agentModelCreateRes", ({ connection, agentCreateRes, uploadRes, placementRes }) =>
      Effect.tryPromise({
        try: async () => {
          const agentModel = createAgentModelModel(connection)
          return await agentModel.create({
            agent: agentCreateRes.id,
            parts: {
              eyes: {
                opened: { path: uploadRes[0].storagePath, percent: 0 },
                closed: { path: uploadRes[1].storagePath, percent: 0 }
              },
              face: {
                normal: {
                  path: uploadRes[2].storagePath
                }
              },
              mouth: {
                opened: { path: uploadRes[3].storagePath, percent: 0 },
                closed: { path: uploadRes[4].storagePath, percent: 0 }
              },
              percent: placementRes.percent
            }
          })
        },
        catch: (err) => new Error(`DB保存エラー: ${err}`)
      })
    ),
    Effect.map(({ agentCreateRes }) => agentCreateRes.id)
  )

const agentFindEffect = ({ agentId }: { agentId: string }) =>
  Effect.Do.pipe(
    Effect.bind("storage", () => CloudStorageServiceTag),
    Effect.bind("db", () => MongooseServiceTag),
    Effect.bind("connection", ({ db }) => db.connection),
    Effect.bind("agentModel", ({ connection }) =>
      Effect.tryPromise({
        try: async () => {
          const agentModel = createAgentModelModel(connection)
          const res = await agentModel.findOne({ agent: agentId }).sort({ createdAt: -1 }).populate<AgentDoc>("agent")
          if (!res) {
            throw new Error("エージェントが見つかりません")
          }
          return res
        },
        catch: (err) => new Error(`エージェント取得エラー: ${err}`)
      })
    ),
    Effect.bind("updatedParts", ({ agentModel, storage }) =>
      Effect.all(
        [
          storage.getSignedUrl(agentModel.parts.eyes.opened.path),
          storage.getSignedUrl(agentModel.parts.eyes.closed.path),
          storage.getSignedUrl(agentModel.parts.face.normal.path),
          storage.getSignedUrl(agentModel.parts.mouth.opened.path),
          storage.getSignedUrl(agentModel.parts.mouth.closed.path)
        ],
        { concurrency: "unbounded" }
      ).pipe(
        Effect.map(([eyesOpened, eyesClosed, faceNormal, mouthOpened, mouthClosed]) => ({
          parts: {
            ...agentModel.parts,
            eyes: { opened: { ...agentModel.parts.eyes.opened, path: eyesOpened.url }, closed: { ...agentModel.parts.eyes.closed, path: eyesClosed.url } },
            face: { normal: { ...agentModel.parts.face.normal, path: faceNormal.url } },
            mouth: {
              opened: { ...agentModel.parts.mouth.opened, path: mouthOpened.url },
              closed: { ...agentModel.parts.mouth.closed, path: mouthClosed.url }
            }
          }
        }))
      )
    ),
    Effect.map(({ agentModel, updatedParts }) => ({ ...agentModel.toJSON(), ...updatedParts }))
  )

const AgentServiceLive: AgentService = {
  create: agentCreateEffect,
  findOne: agentFindEffect
}

export const AgentServiceLiveLayer = Layer.succeed(AgentServiceTag, AgentServiceLive)
