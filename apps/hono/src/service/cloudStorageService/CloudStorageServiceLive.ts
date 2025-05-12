import { Storage } from "@google-cloud/storage"
import { Effect, Layer } from "effect"
import { type CloudStorageService, CloudStorageServiceTag } from "./CloudStorageService"

export const cloudStorageServiceLive: CloudStorageService = {
  upload: (images) =>
    Effect.gen(function* (_) {
      // Storage インスタンスの作成
      const storage = new Storage()

      // バケットの取得
      const bucket = storage.bucket("evoly_bucket") // 実際のプロジェクトでは設定から取得することを推奨

      // すべての画像を処理
      const results = yield* _(
        Effect.all(
          images.map((image, _index) => {
            return Effect.gen(function* (_) {
              const filename = crypto.randomUUID()

              // 拡張子の取得（もしあれば）
              const contentType = image.metadata?.contentType || "image/png"
              const extension = contentType.split("/")[1] || "png"

              // 拡張子を含むストレージパスを生成
              const storagePath = `agent_images/${filename}.${extension}`

              // ファイルオブジェクトの作成
              const file = bucket.file(storagePath)

              const buffer = Buffer.from(image.base64, "base64")

              // ファイルのアップロード
              yield* _(
                Effect.tryPromise({
                  try: async () => {
                    await file.save(buffer, {
                      contentType: image.metadata?.contentType || "image/png"
                    })
                  },
                  catch: (error) => new Error(JSON.stringify(error))
                })
              )

              return { storagePath }
            })
          })
        )
      )

      return results
    }),

  getSignedUrl: (storagePath, expiresInSeconds = 3600) =>
    Effect.gen(function* (_) {
      // Storage インスタンスの作成
      const storage = new Storage()

      // バケットの取得
      const bucket = storage.bucket("evoly_bucket") // 実際のプロジェクトでは設定から取得することを推奨

      // ファイルオブジェクトの取得
      const file = bucket.file(storagePath)

      // 署名付きURLの取得
      const signedUrlResponse = yield* _(
        Effect.tryPromise({
          try: async () => {
            const [url] = await file.getSignedUrl({
              version: "v4",
              action: "read",
              expires: Date.now() + expiresInSeconds * 1000
            })

            return {
              url,
              expiresAt: new Date(Date.now() + expiresInSeconds * 1000)
            }
          },
          catch: (error) => new Error(JSON.stringify(error))
        })
      )

      return signedUrlResponse
    })
}

export const CloudStorageServiceLiveLayer = Layer.succeed(CloudStorageServiceTag, cloudStorageServiceLive)
