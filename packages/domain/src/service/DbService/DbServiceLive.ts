import createDbClient from "@evoly/db"
import { Effect, Layer } from "effect"
import { type DbService, DbServiceTag } from "./DbService"
import { DbServiceClientError } from "./DbServiceError"

export const DbServiceLive: DbService = {
  createDbClient: (connectionStr: string) =>
    Effect.try({
      try: () => createDbClient(connectionStr),
      catch: (e) => new DbServiceClientError(e)
    }).pipe(Effect.tap(() => Effect.log("✅ Successfully created connection to DB")))
}

export const DbServiceLiveLayer = Layer.succeed(DbServiceTag, DbServiceLive)
