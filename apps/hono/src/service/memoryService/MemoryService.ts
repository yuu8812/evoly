import { Context, type Effect } from "effect"
import type { MongooseService } from "../mongooseService/MongooseService"

export type MemoryService = {
  add({ agentId, text }: { agentId: string; text: string }): Effect.Effect<undefined, Error, MongooseService>
  retrieve({ agentId, query, k }: { agentId: string; query: string; k?: number }): Effect.Effect<{ text: string }[], Error, MongooseService>
}

export const MemoryServiceTag = Context.GenericTag<MemoryService>("MemoryService")
