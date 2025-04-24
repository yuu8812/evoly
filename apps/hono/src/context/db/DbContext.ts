// DbContext.ts
import type { CreateDbClient } from "@evoly/db"
import type {} from "@evoly/domain"
import { Context } from "effect"

export type DbContext = ReturnType<CreateDbClient>

export const DbContextTag = Context.GenericTag<DbContext>("DbContextTag")
