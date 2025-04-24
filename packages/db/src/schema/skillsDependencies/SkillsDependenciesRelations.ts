import { relations } from "drizzle-orm"
import skills from "../skills/Skills"
import { skillDependencies } from "./SkillsDependencies"

export const skillDependenciesRelations = relations(skillDependencies, ({ one }) => ({
  skill: one(skills, {
    fields: [skillDependencies.skillId],
    references: [skills.id]
  }),
  dependsOn: one(skills, {
    fields: [skillDependencies.dependsOnSkillId],
    references: [skills.id]
  })
}))
