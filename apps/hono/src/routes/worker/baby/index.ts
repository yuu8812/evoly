import { Effect, pipe } from "effect"
import honoApp from "../../../factory/appFactory"

export const babyRoute = pipe(Effect.sync(() => honoApp))
