import { pgTable, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"
import skills from "../skills/Skills"

export const skillDependencies = pgTable("skill_dependencies", {
  id: id(),
  // 対象スキル
  skillId: varchar("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),

  // 必須スキル（依存先）
  dependsOnSkillId: varchar("depends_on_skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),

  ...timestamps
})
