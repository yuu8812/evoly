// skillTrees.ts
import { pgTable } from "drizzle-orm/pg-core"
import { timestamps } from "../../constants/timestamp"
import { id } from "../../constants/uuid"

const skillTrees = pgTable("skill_trees", {
  id: id(),
  ...timestamps
})

export default skillTrees
