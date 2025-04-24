import { relations } from "drizzle-orm"
import skillTrees from "../skillTrees/SkillTrees"
import { skillDependencies } from "../skillsDependencies/SkillsDependencies"
import skills from "./Skills"

const skillsRelations = relations(skills, ({ one, many }) => ({
  // 所属ツリーとのリレーション（正）
  tree: one(skillTrees, {
    fields: [skills.treeId],
    references: [skillTrees.id]
  }),

  dependencies: many(skillDependencies, {
    relationName: "skill_dependencies"
  }),

  requiredBy: many(skillDependencies, {
    relationName: "skill_required_by"
  })
}))

export default skillsRelations
