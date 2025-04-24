import { relations } from "drizzle-orm"
import { aiChildrenHistory } from "../aiChildrenHistories/AiChildrenHistories"
import aiParents from "../aiParents/AiParents"
import skillTrees from "../skillTrees/SkillTrees"
import aiChildren from "./AiChildren"

const aiChildrenRelations = relations(aiChildren, ({ one, many }) => ({
  parentRecord: many(aiParents),
  skillTree: one(skillTrees, {
    fields: [aiChildren.skillTreeId],
    references: [skillTrees.id]
  }),
  history: many(aiChildrenHistory) // 👈 これを追加！
}))

export default aiChildrenRelations
