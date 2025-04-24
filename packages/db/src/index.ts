import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"
import {} from "./schema"

const createDbClient = (connectionString: string) => drizzle(connectionString, { schema })

type CreateDbClient = typeof createDbClient

export default createDbClient
export type { CreateDbClient }
