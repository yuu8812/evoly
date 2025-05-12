// src/context/MongooseServiceLive.ts
import { EnvServiceTag } from "@evoly/core"
import { EnvServiceLiveLayer } from "@evoly/domain"
import { Effect, Layer, pipe } from "effect"
import mongoose from "mongoose"
import { createAgentModel } from "../../models/Agent"
import { createAgentModelModel } from "../../models/AgentModel"
import { MongooseServiceTag } from "./MongooseService"

// MongoDBへの接続を1回だけ確立する Effect<Resource>
const MongooseConnectEffect = pipe(
  EnvServiceTag,
  Effect.flatMap((envService) => envService.getEnv),
  Effect.flatMap((env) =>
    Effect.acquireRelease(
      pipe(
        Effect.tryPromise({
          try: async () => {
            if (mongoose.connection.readyState === 1) {
              return mongoose.connection
            }

            await mongoose.connect(env.MONGODB_ENDPOINT, {
              dbName: "evoly",
              maxPoolSize: 10,
              serverSelectionTimeoutMS: 5000
            })

            // モデル登録
            createAgentModel(mongoose.connection)
            createAgentModelModel(mongoose.connection)

            return mongoose.connection
          },
          catch: (error) => new Error(`MongoDB接続エラー: ${String(error)}`)
        }),
        Effect.tap(() => Effect.logInfo("✅ Connected to MongoDB"))
      ),
      (conn) =>
        pipe(
          Effect.tryPromise({
            try: async () => {
              if (conn.readyState === 1) {
                await conn.close()
              }
            },
            catch: () => new Error("MongoDB切断エラー")
          }),
          Effect.tap(() => Effect.logInfo("🛑 Disconnected from MongoDB")),
          Effect.catchAll((error) => {
            // Log the error but don't fail the release operation
            return pipe(
              Effect.logError(`Error disconnecting from MongoDB: ${error.message}`),
              Effect.map(() => undefined)
            )
          })
        )
    )
  ),
  Effect.provide(EnvServiceLiveLayer)
)

// MongooseService の Layer 化
export const MongooseServiceLiveLayer = Layer.scoped(
  MongooseServiceTag,
  pipe(
    MongooseConnectEffect,
    Effect.map((connection) => ({
      connection: Effect.succeed(connection) // ← 必ず再利用されるEffect
    }))
  )
)
