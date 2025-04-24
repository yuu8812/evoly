import type {} from "@evoly/domain"
import { Context } from "effect"
import type { ApplicationEnv } from "../../constants/envs"

export type EnvContext = ApplicationEnv

export const EnvContextTag = Context.GenericTag<EnvContext>("EnvContextTag")
