import { type Connection, type Document, Schema } from "mongoose"

export interface GrowthDoc extends Document {
  agentId: string
  weekNumber: number
  statsBefore: Record<string, number>
  statsAfter: Record<string, number>
  personalityBefore?: Record<string, number>
  personalityAfter?: Record<string, number>
  notes: string
  createdAt: Date
}

export const GrowthSchema = new Schema<GrowthDoc>({
  agentId: { type: String, required: true, index: true },
  weekNumber: { type: Number, required: true },
  statsBefore: { type: Schema.Types.Mixed, required: true },
  statsAfter: { type: Schema.Types.Mixed, required: true },
  personalityBefore: { type: Schema.Types.Mixed },
  personalityAfter: { type: Schema.Types.Mixed },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export const createGrowthModel = (connection: Connection) => {
  return connection.model<GrowthDoc>("Growth", GrowthSchema, "agent_growth")
}
