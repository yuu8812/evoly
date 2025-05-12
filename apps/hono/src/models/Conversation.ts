import { type Connection, type Document, Schema } from "mongoose"

interface Message {
  role: string
  content: string
  timestamp: Date
}

export interface ConversationDoc extends Document {
  agentId: string
  userId: string
  messages: Message[]
  startedAt: Date
  lastMessageAt: Date
}

const MessageSchema = new Schema<Message>({
  role: { type: String, enum: ["user", "agent"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

export const ConversationSchema = new Schema<ConversationDoc>({
  agentId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  messages: [MessageSchema],
  startedAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now }
})

export const createConversationModel = (connection: Connection) => {
  return connection.model<ConversationDoc>("Conversation", ConversationSchema, "conversations")
}
