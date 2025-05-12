import { type Connection, type Document, Schema } from "mongoose"

export interface MemoryDoc extends Document {
  agentId: string
  text: string
  embedding: number[]
  importance: number
  source: string
  sourceId?: string
  createdAt: Date
}

export const MemorySchema = new Schema<MemoryDoc>({
  agentId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  importance: { type: Number, default: 5, min: 1, max: 10 },
  source: { type: String, default: "general" },
  sourceId: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export const createMemoryModel = (connection: Connection) => {
  return connection.model<MemoryDoc>("Memory", MemorySchema, "agent_memories")
}
