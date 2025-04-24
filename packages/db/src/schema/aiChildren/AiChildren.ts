import { boolean, date, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"

const aiChildren = pgTable("ai_children", {
  id: id(),
  userId: uuid("user_id").notNull(),

  name: text("name").notNull(),
  age: integer("age").default(0),
  isArchived: boolean("is_archived").default(false),
  retiredAt: timestamp("retired_at"),
  slug: text("slug").notNull().unique(),

  personality: jsonb("personality").notNull(),
  emotion: jsonb("emotion").notNull(),
  status: jsonb("status").notNull(),
  currentActionCount: integer("current_action_count").default(0),
  lastActionDate: date("last_action_date"),

  skillPoints: integer("skill_points").default(0),

  skillTreeId: varchar("skill_tree_id"),

  ...timestamps
})

export default aiChildren
