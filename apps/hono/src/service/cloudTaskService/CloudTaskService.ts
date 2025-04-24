import { Context, type Effect } from "effect"

export interface CloudTaskService {
  createTask: (params: {
    url: string
    method?: "POST" | "GET" | "PUT" | "DELETE"
    body?: Record<string, unknown>
    headers?: Record<string, string>
    serviceAccountEmail: string
    project: string
    region: string
    queue: string
  }) => Effect.Effect<string | undefined | null, Error>
}

export const CloudTaskServiceTag = Context.GenericTag<CloudTaskService>("CloudTaskService")
