import { relations } from "drizzle-orm"
import skillTreeHistory from "../skillTreeHistory/SkillTreeHistory"
import skills from "../skills/Skills"
import skillTrees from "./SkillTrees"

const skillTreesRelations = relations(skillTrees, ({ many }) => ({
  skills: many(skills),
  children: many(skillTreeHistory)
}))

export default skillTreesRelations
