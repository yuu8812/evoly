import { integer, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"

const skills = pgTable("skills", {
  id: id(),
  treeId: varchar("tree_id").notNull(),

  name: text("name").notNull(),
  description: text("description").notNull(),
  requiredPoints: integer("required_points").notNull(),

  unlockConditions: jsonb("unlock_conditions").notNull().default("{}"),

  source: text("source").notNull(),

  alignment: text("alignment").notNull().$type<"good" | "neutral" | "evil">().default("neutral"),

  category: text("category").notNull().$type<"cognitive" | "physical" | "social" | "special">().default("cognitive"),

  ...timestamps
})

export default skills
