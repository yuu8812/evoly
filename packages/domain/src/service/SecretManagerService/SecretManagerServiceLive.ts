import { SecretManagerClientError, type SecretManagerService, SecretManagerServiceTag, SecretNotFoundError } from "@evoly/core"
import { SecretManagerServiceClient } from "@google-cloud/secret-manager"
import { Effect, Layer, pipe } from "effect"

const secretManagerServiceClient = new SecretManagerServiceClient()

const SecretManagerServiceLive: SecretManagerService = {
  getSecret: (secretName: string) =>
    pipe(
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
    )
}

export const SecretManagerServiceLiveLayer = Layer.succeed(SecretManagerServiceTag, SecretManagerServiceLive)
