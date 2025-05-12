import { Context, type Effect } from "effect"
import type { DatabaseConnectionError } from "../errors/service-errors"

/**
 * データベース接続サービスの抽象インターフェース
 * 具体的な実装（MongoDB, PostgreSQLなど）はこのインターフェースを実装する
 */
export interface DatabaseService {
  /**
   * データベース接続を取得する
   */
  getConnection<T>(): Effect.Effect<T, DatabaseConnectionError, never>
}

/** DI 用のタグ */
export const DatabaseServiceTag = Context.GenericTag<DatabaseService>("DatabaseServiceTag")
