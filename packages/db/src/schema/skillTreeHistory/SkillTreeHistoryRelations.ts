import { relations } from "drizzle-orm"
import skillTrees from "../skillTrees/SkillTrees"
import skillTreeHistory from "./SkillTreeHistory"

const skillTreeHistoryRelations = relations(skillTreeHistory, ({ one }) => ({
  tree: one(skillTrees, {
    fields: [skillTreeHistory.treeId],
    references: [skillTrees.id]
  })
}))

export default skillTreeHistoryRelations
