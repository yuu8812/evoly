import { type Connection, type Document, Schema } from "mongoose"

export interface TraitDoc extends Document {
  agentId: string
  traitName: string
  description: string
  effects: Record<string, number | string>
  acquiredAt: Date
  weekNumber: number
}

export const TraitSchema = new Schema<TraitDoc>({
  agentId: { type: String, required: true, index: true },
  traitName: { type: String, required: true },
  description: { type: String, required: true },
  effects: { type: Schema.Types.Mixed, default: {} },
  acquiredAt: { type: Date, default: Date.now },
  weekNumber: { type: Number, required: true }
})

export const createTraitModel = (connection: Connection) => {
  return connection.model<TraitDoc>("Trait", TraitSchema, "agent_traits")
}
