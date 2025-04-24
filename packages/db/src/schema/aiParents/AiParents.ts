import { pgTable, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"

const aiParents = pgTable("ai_parents", {
  id: id(),
  sourceChildId: varchar("source_child_id").notNull(),

  parentCharacterId: varchar("parent_character_id").notNull(),

  ...timestamps
})

export default aiParents
