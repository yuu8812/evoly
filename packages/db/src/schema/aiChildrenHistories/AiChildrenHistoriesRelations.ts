import { relations } from "drizzle-orm"
import aiChildren from "../aiChildren/AiChildren"
import { aiChildrenHistory } from "./AiChildrenHistories"

const aiChildrenHistoryRelations = relations(aiChildrenHistory, ({ one }) => ({
  child: one(aiChildren, {
    fields: [aiChildrenHistory.childId],
    references: [aiChildren.id]
  })
}))

export default aiChildrenHistoryRelations
