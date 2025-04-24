import { Context, type Effect } from "effect"

export type AgentService = {
  genSkillsAgent({ skillTreeId, aiChildId }: { skillTreeId: string; aiChildId: string }): Effect.Effect<string, never, never>
}

export const AgentServiceTag = Context.GenericTag<AgentService>("AgentService")
