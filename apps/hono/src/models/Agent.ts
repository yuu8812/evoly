import { type Connection, Schema } from "mongoose"

export type Personality = {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export type Stats = {
  intelligence: number
  creativity: number
  empathy: number
  energy: number
  courage: number
}

export interface AgentDoc {
  userId: string
  name: string
  age: { weeks: number }
  lastWeeklyEventDate: Date
  personality: Personality
  stats: Stats
  appearance: {
    currentStage: string
  }
  createdAt: Date
}

export const AgentSchema = new Schema<AgentDoc>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  age: {
    weeks: { type: Number, default: 0 }
  },
  lastWeeklyEventDate: { type: Date, default: Date.now },
  personality: {
    openness: { type: Number, default: 5 },
    conscientiousness: { type: Number, default: 5 },
    extraversion: { type: Number, default: 5 },
    agreeableness: { type: Number, default: 5 },
    neuroticism: { type: Number, default: 5 }
  },
  stats: {
    intelligence: { type: Number, default: 1 },
    creativity: { type: Number, default: 1 },
    empathy: { type: Number, default: 1 },
    energy: { type: Number, default: 1 },
    courage: { type: Number, default: 1 }
  },
  appearance: {
    currentStage: { type: String, default: "baby" }
  }
})

export const createAgentModel = (connection: Connection) => {
  return connection.model<AgentDoc>("Agent", AgentSchema, "agents")
}
