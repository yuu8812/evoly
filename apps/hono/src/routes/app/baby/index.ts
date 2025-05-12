import { Effect, pipe } from "effect"
import honoApp from "../../../factory/appFactory"
import { AgentServiceTag } from "../../../service/agentService/AgentService"

export const babyRoute = pipe(
  Effect.sync(() => honoApp),
  Effect.map((app) =>
    app.get("/:id", (c) =>
      c.var.runtime.runPromise(
        pipe(
          Effect.Do,
          Effect.bind("agentSvc", () => AgentServiceTag),
          Effect.bind("agentModel", ({ agentSvc }) => agentSvc.findOne({ agentId: c.req.param("id") })),
          Effect.map(({ agentModel }) =>
            c.json(
              {
                agentModel
              },
              200
            )
          )
        )
      )
    )
  ),
  Effect.map((app) =>
    app.post("/start", (c) =>
      c.var.runtime.runPromise(
        pipe(
          Effect.Do,
          Effect.bind("userId", () => Effect.succeed("1")),
          Effect.bind("agentSvc", () => AgentServiceTag),
          Effect.bind("agentRes", ({ agentSvc, userId }) => agentSvc.create({ userId })),
          Effect.map(({ agentRes }) =>
            c.json({
              message: "エージェント作成成功",
              agent: agentRes
            })
          )
        )
      )
    )
  )
)
