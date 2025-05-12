import { Context, type Effect } from "effect"
import type { Connection } from "mongoose"

export interface MongooseService {
  connection: Effect.Effect<Connection>
}

export const MongooseServiceTag = Context.GenericTag<MongooseService>("MongooseService")
