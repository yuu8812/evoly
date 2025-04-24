import { relations } from "drizzle-orm"
import aiChildren from "../aiChildren/AiChildren"
import users from "./Users"

const usersRelations = relations(users, ({ many }) => ({
  aiChildren: many(aiChildren)
}))

export default usersRelations
