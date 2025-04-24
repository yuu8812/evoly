import { jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"
import aiChildren from "../aiChildren/AiChildren"

export const aiChildrenHistory = pgTable("ai_children_history", {
  id: id(),

  // 紐づくAIキャラクター
  childId: varchar("child_id")
    .notNull()
    .references(() => aiChildren.id, { onDelete: "cascade" }),

  // ログタイプ（感情変化・表情切り替え・発言など）
  type: text("type").notNull(), // e.g., "emotion", "expression", "speech", "system"

  // 変化した値の詳細（感情/表情など）
  payload: jsonb("payload").notNull(),

  // 任意の発言ログ
  utterance: text("utterance"),

  ...timestamps
})
