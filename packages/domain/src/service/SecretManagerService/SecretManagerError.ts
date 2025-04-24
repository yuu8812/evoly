export class SecretNotFoundError extends Error {
  readonly _tag: "SecretNotFoundError"
  constructor(secretName: string) {
    super(`シークレット "${secretName}" が見つかりません`)
    this._tag = "SecretNotFoundError"
  }
}

export class SecretManagerClientError extends Error {
  readonly _tag: "SecretManagerClientError"
  constructor(error: unknown) {
    super(`シークレットマネージャーの操作に失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    this._tag = "SecretManagerClientError"
  }
}
