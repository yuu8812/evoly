/**
 * シークレットが見つからない場合のエラー
 */
export class SecretNotFoundError extends Error {
  readonly _tag: "SecretNotFoundError"
  constructor(secretName: string) {
    super(`シークレット "${secretName}" が見つかりません`)
    this._tag = "SecretNotFoundError"
  }
}

/**
 * シークレットマネージャーのクライアントエラー
 */
export class SecretManagerClientError extends Error {
  readonly _tag: "SecretManagerClientError"
  constructor(error: unknown) {
    super(`シークレットマネージャーの操作に失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    this._tag = "SecretManagerClientError"
  }
}

/**
 * データベース接続エラー
 */
export class DatabaseConnectionError extends Error {
  readonly _tag: "DatabaseConnectionError"
  constructor(error: unknown) {
    super(`データベース接続に失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    this._tag = "DatabaseConnectionError"
  }
}

/**
 * サービスエラーの共用型
 */
export type ServiceError = 
  | SecretNotFoundError 
  | SecretManagerClientError 
  | DatabaseConnectionError
