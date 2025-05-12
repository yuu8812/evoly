import { Context, type Effect } from "effect"
import type { SecretManagerClientError, SecretNotFoundError } from "../errors/service-errors"

/** SecretManager サービスのインターフェース */
export type SecretManagerService = {
  /**
   * 指定された secretName を元にシークレットを取得する
   * @param secretName Secret Manager のシークレットのパス
   * @returns Effect<string, SecretManagerError, never> シークレットの値
   */
  getSecret(secretName: string): Effect.Effect<string, SecretManagerClientError | SecretNotFoundError, never>
}

/** DI 用のタグ */
export const SecretManagerServiceTag = Context.GenericTag<SecretManagerService>("SecretManagerServiceTag")
