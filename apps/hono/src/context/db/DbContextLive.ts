// DbContextLive.ts
import { DbServiceLiveLayer, DbServiceTag } from "@evoly/domain"
import { Context, Effect, Layer, pipe } from "effect"
import { EnvContextTag } from "../env/EnvContext"
import { EnvContextLiveLayer } from "../env/EnvContextLive"
import { DbContextTag } from "./DbContext"

const makeDbContext = pipe(
  Effect.all({
    dbSvc: DbServiceTag,
    env: EnvContextTag
  }),
  Effect.flatMap(({ dbSvc, env }) => dbSvc.createDbClient(env.POSTGRES_ENDPOINT)),
  Effect.map((dbClient) => Layer.succeedContext(Context.make(DbContextTag, dbClient))),
  Effect.provide(EnvContextLiveLayer),
  Effect.provide(DbServiceLiveLayer)
)

export const DbContextLiveLayer = Layer.unwrapEffect(makeDbContext)
