import { Context, type Effect } from "effect"
import type { ApplicationEnv } from "../env/constants"
import type { SecretManagerClientError, SecretNotFoundError } from "../errors/service-errors"

/**
 * 環境変数サービスのインターフェース
 */
export type EnvService = {
  /**
   * 環境変数を取得する
   */
  getEnv: Effect.Effect<ApplicationEnv, SecretManagerClientError | SecretNotFoundError, never>
}

/**
 * DI用のタグ
 */
export const EnvServiceTag = Context.GenericTag<EnvService>("EnvServiceTag")
