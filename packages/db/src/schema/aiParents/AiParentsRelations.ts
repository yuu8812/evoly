import { relations } from "drizzle-orm"
import aiChildren from "../aiChildren/AiChildren"
import aiParents from "./AiParents"

export const aiParentsRelations = relations(aiParents, ({ one }) => ({
  sourceChild: one(aiChildren, {
    fields: [aiParents.sourceChildId],
    references: [aiChildren.id]
  }),
  parentCharacter: one(aiChildren, {
    fields: [aiParents.parentCharacterId],
    references: [aiChildren.id]
  })
}))

export default aiParentsRelations
