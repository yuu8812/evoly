import { type Connection, Schema, type StringSchemaDefinition } from "mongoose"

export interface AgentModelDoc {
  agent: StringSchemaDefinition
  parts: {
    face: {
      normal: {
        path: string
      }
    }
    eyes: {
      opened: {
        path: string
        percent: number
      }
      closed: {
        path: string
        percent: number
      }
    }
    mouth: {
      opened: {
        path: string
        percent: number
      }
      closed: {
        path: string
        percent: number
      }
    }
    percent: {
      eye: {
        x: number
        y: number
      }
      mouth: {
        x: number
        y: number
      }
      nose: {
        x: number
        y: number
      }
    }
  }
  createdAt: Date
}

export const AgentModelSchema = new Schema<AgentModelDoc>({
  agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
  parts: {
    face: {
      normal: { path: { type: String } }
    },
    eyes: {
      opened: {
        path: { type: String },
        percent: { type: Number }
      },
      closed: {
        path: { type: String },
        percent: { type: Number }
      }
    },
    mouth: {
      opened: {
        path: { type: String },
        percent: { type: Number }
      },
      closed: {
        path: { type: String },
        percent: { type: Number }
      }
    },
    percent: {
      eye: {
        x: { type: Number },
        y: { type: Number }
      },
      mouth: {
        x: { type: Number },
        y: { type: Number }
      },
      nose: {
        x: { type: Number },
        y: { type: Number }
      }
    }
  },
  createdAt: { type: Date, default: Date.now }
})

export const createAgentModelModel = (connection: Connection) => {
  return connection.model<AgentModelDoc>("AgentModel", AgentModelSchema, "agent_models")
}
