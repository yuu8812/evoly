// EnvContextLive.ts
import { SecretManagerServiceLiveLayer, SecretManagerServiceTag } from "@evoly/domain"
import { Context, Effect, Layer, pipe } from "effect"
import { type ApplicationEnv, ENV_LIST } from "../../constants/envs"
import { EnvContextTag } from "./EnvContext"

const genSecretPath = (name: string) => `projects/${Bun.env.GOOGLE_PROJECT_ID}/secrets/${name}/versions/latest`

const makeEnvContext = pipe(
  Effect.Do,
  Effect.bind("secretSvc", () => SecretManagerServiceTag),
  Effect.bind("secrets", ({ secretSvc }) =>
    Effect.forEach(
      ENV_LIST,
      (key) =>
        pipe(
          secretSvc.getSecret(genSecretPath(key)),
          Effect.map((value) => [key, value] as const)
        ),
      { concurrency: "unbounded" }
    ).pipe(Effect.tap(() => Effect.log("✅ Successfully fetched secret keys")))
  ),
  Effect.map(({ secrets }) => Object.fromEntries(secrets) as ApplicationEnv),
  Effect.map((env) => Layer.succeedContext(Context.make(EnvContextTag, env))),
  Effect.provide(SecretManagerServiceLiveLayer)
)

export const EnvContextLiveLayer = Layer.unwrapEffect(makeEnvContext)
