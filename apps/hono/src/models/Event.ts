import { type Connection, type Document, Schema } from "mongoose"

export interface EventDoc extends Document {
  agentId: string
  eventType: string
  eventName: string
  description: string
  story: string
  statChanges: Record<string, number>
  personalityChanges?: Record<string, number>
  createdAt: Date
}

export const EventSchema = new Schema<EventDoc>({
  agentId: { type: String, required: true, index: true },
  eventType: { type: String, required: true },
  eventName: { type: String, required: true },
  description: { type: String, required: true },
  story: { type: String, required: true },
  statChanges: { type: Schema.Types.Mixed, default: {} },
  personalityChanges: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
})

export const createEventModel = (connection: Connection) => {
  return connection.model<EventDoc>("Event", EventSchema, "agent_events")
}
