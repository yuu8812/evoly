import { Skills } from "@evoly/db/schema"
import { Agent } from "@mastra/core"
import { createInsertSchema } from "drizzle-zod"
import { Effect, Layer, pipe } from "effect"
import { z } from "zod"
import { DbContextTag } from "../../context/db/DbContext"
import { geminiModel } from "../../utils/models"
import { type AgentService, AgentServiceTag } from "./AgentService"

const skillInsertSchema = createInsertSchema(Skills).omit({ id: true, createdAt: true, updatedAt: true })

const instructions = `
あなたはスキルツリー設計AIです。

与えられたAIキャラクターの性格と感情に基づいて、30~40個のスキルを設計してください。

各スキルは以下の構造にしてください：

- id（ユニークな英語ID,db挿入前にuuidに置き換えます）
- name（日本語名）
- description（説明）
- requiredPoints（1〜5）
- alignment（"good", "neutral", "evil" のいずれか）
- category（"cognitive", "physical", "social", "special" のいずれか）
- unlockConditions（emotionやpersonalityに基づくJSON条件）
- dependencies（idの配列。アンロックに必要なスキルのid）
- source（"original" または "inherited"）

すべてのスキルはJSON配列として返してください。
`

const genSkillsAgent = ({ skillTreeId, aiChildId }: { skillTreeId: string; aiChildId: string }) =>
  pipe(
    Effect.Do,
    Effect.bind("db", () => DbContextTag),
    Effect.bind("agent", () => Effect.sync(() => new Agent({ name: "skillsGenerateAgent" as const, model: geminiModel, instructions }))),
    Effect.map(({ agent }) => Effect.promise(() => agent.generate([{ content: "", role: "system" }], { output: z.object({ skills: z.array(skillInsertSchema) }) }))),
    Effect.flatMap((res) => Effect.succeed(res))
  )

export const AgentServiceLive: AgentService = {
  genSkillsAgent
}

export const AgentServiceLiveLayer = Layer.succeed(AgentServiceTag, AgentServiceLive)
