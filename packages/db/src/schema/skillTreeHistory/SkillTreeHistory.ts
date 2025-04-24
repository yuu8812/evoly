import { jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"
import skillTrees from "../skillTrees/SkillTrees"
import skills from "../skills/Skills"

const skillTreeHistory = pgTable("skill_tree_history", {
  id: id(),

  // 対象となるスキルツリー
  treeId: varchar("tree_id")
    .notNull()
    .references(() => skillTrees.id, { onDelete: "cascade" }),

  // 解放されたスキルID
  skillId: varchar("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),

  // 解放時の感情・ステータスなどのスナップショット
  conditionSnapshot: jsonb("condition_snapshot").notNull(),

  // 解放時のセリフなど
  utterance: text("utterance"),

  ...timestamps
})

export default skillTreeHistory
