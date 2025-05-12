import { type AppType, app } from "./app"

export default {
  fetch: app.fetch,
  port: 4000,
  idleTimeout: 255
}

export type { AppType }
