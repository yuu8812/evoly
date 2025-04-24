import { AiChildren, AiParents, SkillTrees, Users } from "@evoly/db/schema"
// import { reset } from "drizzle-seed"
import { Effect, pipe } from "effect"
import { DbContextTag } from "../context/db/DbContext"
import { runtime } from "../runtime"

const seed = () =>
  runtime.runPromise(
    pipe(
      Effect.Do,
      Effect.bind("db", () => DbContextTag),

      // 削除処理を bind か tap でまとめる
      //   Effect.tap(({ db }) =>
      //     Effect.all([Effect.promise(() => reset(db, [AiChildren, AiParents, SkillTrees, Users, Skills]))], { concurrency: "unbounded" }).pipe(
      //       Effect.catchAll((e) => Effect.fail(new Error(`削除失敗: ${e}`)))
      //     )
      //   ),
      //   Effect.tap(Effect.log("✅ Successfully reseted all tables")),

      // ユーザー insert
      Effect.bind("insertedUsers", ({ db }) => Effect.promise(() => db.insert(Users).values({ email: "user1@example.com" }).returning().execute())),
      Effect.tap(() => Effect.log("✅ Successfully seeded User Info")),

      // SkillTree insert
      Effect.bind("insertedSkillTrees", ({ db }) => Effect.promise(() => db.insert(SkillTrees).values({}).returning().execute())),

      // AiChild insert
      Effect.bind("insertedAiChildren", ({ db, insertedUsers, insertedSkillTrees }) =>
        Effect.promise(() =>
          db
            .insert(AiChildren)
            .values({
              emotion: {},
              personality: {},
              status: {},
              name: "hahaha",
              userId: insertedUsers[0].id,
              slug: `ai-${crypto.randomUUID().slice(0, 8)}`,
              skillTreeId: insertedSkillTrees[0].id
            })
            .returning()
            .execute()
        )
      ),
      Effect.tap(() => Effect.log("✅ Successfully seeded AiChildren Info")),

      // AiParent insert
      Effect.bind("insertedAiParents", ({ db, insertedAiChildren }) =>
        Effect.promise(() =>
          db
            .insert(AiParents)
            .values([
              {
                sourceChildId: insertedAiChildren[0].id,
                parentCharacterId: insertedAiChildren[0].id
              },
              {
                sourceChildId: insertedAiChildren[0].id,
                parentCharacterId: insertedAiChildren[0].id
              }
            ])
            .returning()
            .execute()
        )
      ),
      Effect.tap(() => Effect.log("✅ Successfully seeded AiParents Info"))
    )
  )

export { seed }
