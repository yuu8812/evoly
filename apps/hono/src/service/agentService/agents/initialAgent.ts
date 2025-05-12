import type { Metric } from "@mastra/core"
import { Agent, type ToolsInput } from "@mastra/core/agent"
import { vertexModel } from "../../../utils/models"

const INITIAL_AGENT_PROMPT = `あなたはAIエージェント育成システム「Evoly」の初期化モジュールです。
以下の名前を持つAIエージェントの性格と初期ステータスを生成してください。

親の情報がinputとして渡されます。
これらの情報をもとに、生まれてくる赤ちゃんのステータスを決定して、名前も出力してください。
ステータスにはランダム性があり、成人男性の平均ステータスは
personality、statsともに100付近であることが想定されています

以下の形式で出力してください

{
  "name": string,
  "personality": {
    "openness": 数値1-10,
    "conscientiousness": 数値1-10,
    "extraversion": 数値1-10,
    "agreeableness": 数値1-10,
    "neuroticism": 数値1-10
  },
  "stats": {
    "intelligence": 数値1-10,
    "creativity": 数値1-10,
    "empathy": 数値1-10,
    "energy": 数値1-10,
    "courage": 数値1-10
  }
}

誕生したばかりのエージェントにふさわしい値を設定してください。`

export const initialAgent: Agent<"initAgent", ToolsInput, Record<string, Metric>> = new Agent({
  name: "initAgent",
  instructions: INITIAL_AGENT_PROMPT,
  model: vertexModel
})
