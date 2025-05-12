import { Effect, pipe } from "effect"
import honoApp from "./factory/appFactory"
import { babyRoute } from "./routes/app/baby"
import { runtime } from "./runtime"

const createAppEffect = pipe(
  Effect.Do,
  // honoApp生成
  Effect.flatMap(() => Effect.sync(() => honoApp)),

  // babyRoute
  Effect.map((app) => app.route("/baby", Effect.runSync(babyRoute))),
  Effect.tap(Effect.log("✅ Successfully mapped baby route")),

  Effect.tap(Effect.log("✅✅✅ Successfully mapped every routes ✅✅✅"))
)

export const app = await runtime.runPromise(createAppEffect)

// 型エクスポート
export type AppType = typeof app
