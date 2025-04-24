import type { CreateDbClient } from "@evoly/db"
import { Context, type Effect } from "effect"
import type { DbServiceClientError } from "./DbServiceError"

export type DbService = {
  createDbClient(connectionStr: string): Effect.Effect<ReturnType<CreateDbClient>, DbServiceClientError, never>
}

export const DbServiceTag = Context.GenericTag<DbService>("DbService")
