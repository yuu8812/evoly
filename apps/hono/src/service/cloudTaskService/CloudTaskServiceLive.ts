import { CloudTasksClient } from "@google-cloud/tasks"
import { Effect, Layer } from "effect"
import { type CloudTaskService, CloudTaskServiceTag } from "./CloudTaskService"

const client = new CloudTasksClient()

const createTask = (params: Parameters<CloudTaskService["createTask"]>[0]) =>
  Effect.tryPromise({
    try: async () => {
      const parent = client.queuePath(params.project, params.region, params.queue)
      const task = {
        httpRequest: {
          httpMethod: params.method ?? "POST",
          url: params.url,
          headers: {
            "Content-Type": "application/json",
            ...(params.headers ?? {})
          },
          body: Buffer.from(JSON.stringify(params.body ?? {})),
          oidcToken: {
            serviceAccountEmail: params.serviceAccountEmail
          }
        }
      }
      const [response] = await client.createTask({ parent, task })
      return response.name
    },
    catch: (err) => new Error(`Cloud Task 作成失敗: ${err}`)
  })

const CloudTaskServiceLive: CloudTaskService = {
  createTask
}

export const CloudTaskServiceLiveLayer = Layer.succeed(CloudTaskServiceTag, CloudTaskServiceLive)
