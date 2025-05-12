import { type ApplicationEnv, ENV_LIST, type EnvService, EnvServiceTag, SecretManagerServiceTag } from "@evoly/core"
import { Effect, Layer, pipe } from "effect"
import { SecretManagerServiceLiveLayer } from "../../index"

const isDevelopment = Bun.env.ENV === "development"

const genSecretPath = ({ name, projectId }: { name: string; projectId?: string }) => `projects/${projectId}/secrets/${name}/versions/latest`

// 環境変数を取得するEffectを定義
const getEnvEffect = pipe(
  Effect.Do,
  Effect.bind("secretSvc", () => SecretManagerServiceTag),
  Effect.bind("secrets", ({ secretSvc }) =>
    Effect.forEach(
      ENV_LIST,
      (key) =>
        pipe(
          secretSvc.getSecret(genSecretPath({ name: key, projectId: Bun.env.GOOGLE_PROJECT_ID })),
          Effect.map((value) => [key, value] as const)
        ),
      { concurrency: "unbounded" }
    ).pipe(Effect.tap(() => Effect.log("✅ Successfully fetched secret keys")))
  ),
  Effect.map(({ secrets }) => Object.fromEntries(secrets) as ApplicationEnv),
  Effect.provide(SecretManagerServiceLiveLayer)
)

const makeFileEnvContext = pipe(
  Effect.Do,
  Effect.bind("env", () => Effect.sync(() => Bun.env as ApplicationEnv)),
  Effect.map(({ env }) => env)
)

console.log(process.env.DEV)

// EnvServiceの実装
const EnvServiceLive: EnvService = {
  getEnv: isDevelopment ? makeFileEnvContext : getEnvEffect
}

// EnvServiceLayerを作成
export const EnvServiceLiveLayer = Layer.succeed(EnvServiceTag, EnvServiceLive)
