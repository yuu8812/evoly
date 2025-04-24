export type DbServiceError = DbServiceClientError

export class DbServiceClientError extends Error {
  readonly _tag: "DbServiceClientError"
  constructor(error: unknown) {
    super(`Dbクライアントの初期化に失敗しました ${error instanceof Error ? error.message : String(error)}`)
    this._tag = "DbServiceClientError"
  }
}
