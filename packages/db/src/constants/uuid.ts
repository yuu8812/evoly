import { sql } from "drizzle-orm"
import { varchar } from "drizzle-orm/pg-core"

export const id = () => varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`)
