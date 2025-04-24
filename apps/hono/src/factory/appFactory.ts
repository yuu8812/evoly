import type {} from "@evoly/domain"
import type { Hono } from "hono"
import { cors } from "hono/cors"
import { createFactory } from "hono/factory"
import { runtime } from "../runtime"

type Env = {
  Variables: {
    runtime: typeof runtime
  }
  Bindings: undefined
}

const initApp = (app: Hono<Env>) => {
  // 1) シークレット取得・DB生成
  app.use(async (c, next) => {
    c.set("runtime", runtime)
    await next()
  })

  // 2) CORS
  app.use("*", cors({ origin: "http://localhost:3000", credentials: true }))
}

const factory = createFactory<Env>({ initApp })
const honoApp = factory.createApp()

export default honoApp
