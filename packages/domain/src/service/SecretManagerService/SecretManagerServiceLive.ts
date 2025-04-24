import { SecretManagerServiceClient } from "@google-cloud/secret-manager"
import { Effect, Layer } from "effect"
import { SecretManagerClientError, SecretNotFoundError } from "./SecretManagerError"
import { type SecretManagerService, SecretManagerServiceTag } from "./SecretMangerService"

const secretManagerServiceClient = new SecretManagerServiceClient()
/**
 * secretName を受け取り、Secret Manager から取得（キャッシュを利用）するエフェクト
 */

const getSecretEffect = (secretName: string) =>
  Effect.tryPromise({
    try: () => secretManagerServiceClient.accessSecretVersion({ name: secretName }),
    catch: (error) => new SecretManagerClientError(error)
  }).pipe(
    Effect.map((result) => result[0]),
    Effect.flatMap((version) => {
      const secret = version.payload?.data?.toString() ?? ""
      return secret ? Effect.succeed(secret) : Effect.fail(new SecretNotFoundError(secretName))
    })
  )

/** SecretManager サービスの Live 実装 */
const SecretManagerServiceLive: SecretManagerService = {
  getSecret: (secretName: string) => getSecretEffect(secretName)
}

export const SecretManagerServiceLiveLayer = Layer.succeed(SecretManagerServiceTag, SecretManagerServiceLive)
