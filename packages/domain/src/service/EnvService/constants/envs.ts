export const ENV_LIST = ["MONGODB_ENDPOINT"] as const

export type ApplicationEnv = {
  [key in (typeof ENV_LIST)[number]]: string
}
