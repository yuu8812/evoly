import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core"
import {} from "drizzle-zod"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"

const users = pgTable("users", {
  id: id(),
  email: text("email").notNull(),
  actionLimit: integer("action_limit").default(5),
  isPremium: boolean("is_premium").default(false),
  ...timestamps
})

export default users
