import { Context, type Effect } from "effect"
import type { MergeType } from "mongoose"
import type { AgentDoc } from "../../models/Agent"
import type { AgentModelDoc } from "../../models/AgentModel"
import type { CloudStorageService } from "../cloudStorageService/CloudStorageService"
import type { MongooseService } from "../mongooseService/MongooseService"

export type AgentService = {
  create({ userId }: { userId: string }): Effect.Effect<string, Error, CloudStorageService | MongooseService>
  findOne({ agentId }: { agentId: string }): Effect.Effect<MergeType<AgentDoc, AgentModelDoc>, Error, CloudStorageService | MongooseService>
}

export const AgentServiceTag = Context.GenericTag<AgentService>("AgentService")
