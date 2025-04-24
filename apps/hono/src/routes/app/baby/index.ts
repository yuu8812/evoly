import { AiChildren, AiParents, SkillTrees } from "@evoly/db/schema"
import { sql } from "drizzle-orm"
import { Effect, pipe } from "effect"
import { DbContextTag } from "../../../context/db/DbContext"
import honoApp from "../../../factory/appFactory"

export const babyRoute = pipe(
  Effect.sync(() => honoApp),
  Effect.map((app) =>
    app.post("/start", (c) =>
      c.var.runtime.runPromise(
        pipe(
          Effect.Do,
          // ── DB 依存注入 ─────────────────────
          Effect.bind("db", () => DbContextTag),

          // ── ユーザー取得 ─────────────────────
          Effect.bind("user", ({ db }) =>
            Effect.tryPromise({
              try: () => db.query.Users.findFirst({ with: {} }).execute(),
              catch: (e) => new Error(`ユーザー取得失敗: ${e}`)
            }).pipe(Effect.flatMap((user) => (user ? Effect.succeed(user) : Effect.fail(new Error("User not found")))))
          ),

          Effect.tap(({ user }) => Effect.log({ user })),

          // ── 親AIの件数取得 & ランダム選出 ─────────────
          Effect.bind("randomParentInfo", ({ db }) =>
            Effect.tryPromise({
              try: async () => {
                const [{ count }] = await db.select({ count: sql<number>`COUNT(*)` }).from(AiParents).execute()
                const offset = Math.floor(Math.random() * count)
                const [parent] = await db.select().from(AiParents).offset(offset).limit(1).execute()
                return { parent, count }
              },
              catch: (e) => new Error(`親ガチャ失敗: ${e}`)
            })
          ),

          // デバッグ
          Effect.tap(({ randomParentInfo }) => Effect.log(`✅ランダムな親の件数: ${randomParentInfo.count}`)),

          // ── skill_trees に 1件挿入 ─────────────
          Effect.bind("skillTree", ({ db }) =>
            Effect.tryPromise({
              try: () =>
                db
                  .insert(SkillTrees)
                  .values({})
                  .returning()
                  .execute()
                  .then(([r]) => r),
              catch: (e) => new Error(`SkillTree作成失敗: ${e}`)
            })
          ),

          // ── 赤ちゃんAI の挿入 ─────────────
          Effect.bind("insertedChild", ({ db, user, randomParentInfo, skillTree }) =>
            Effect.tryPromise({
              try: () =>
                db
                  .insert(AiChildren)
                  .values({
                    userId: user.id,
                    name: "赤ちゃんAI",
                    age: 0,
                    slug: `ai-${crypto.randomUUID().slice(0, 8)}`,
                    personality: "{}",
                    emotion: "{}",
                    status: "{}",
                    currentActionCount: 0,
                    lastActionDate: new Date().toISOString(),
                    skillPoints: 0,
                    skillTreeId: skillTree.id
                  })
                  .returning()
                  .execute()
                  .then(([r]) => r),
              catch: (e) => new Error(`AI作成失敗: ${e}`)
            })
          ),

          // ここでworkerを呼び出してスキルツリーと画像を生成する
          // Effect.bind("taskSvc", () => CloudTaskServiceTag),
          // Effect.bind("task", ({ taskSvc }) =>
          //   taskSvc.createTask({
          //     url: "",
          //     method: "POST",
          //     body: {},
          //     serviceAccountEmail: "evoly-worker@evoly-381111.iam.gserviceaccount.com",
          //     project: "evoly-381111",
          //     region: "us-central1",
          //     queue: "worker-queue"
          //   })
          // ),

          // ── 結果返却 ─────────────
          Effect.map(({ insertedChild }) => c.json({ aiChild: insertedChild })),

          Effect.catchAll((error) => Effect.succeed(c.json({ error: error.message }, 500)))
        )
      )
    )
  )
)
