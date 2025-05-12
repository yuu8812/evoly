import { Context, type Effect } from "effect"

type Metadata = {
  contentType: string
}

export type CloudStorageService = {
  upload(
    images: {
      base64: string
      metadata?: Metadata
    }[]
  ): Effect.Effect<
    {
      storagePath: string
    }[],
    Error,
    never
  >
  getSignedUrl(
    storagePath: string,
    expiresInSeconds?: number
  ): Effect.Effect<
    {
      url: string
    },
    Error,
    never
  >
}

export const CloudStorageServiceTag = Context.GenericTag<CloudStorageService>("CloudStorageService")
