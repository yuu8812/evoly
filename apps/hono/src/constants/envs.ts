export const ENV_LIST = ["POSTGRES_ENDPOINT"] as const

export type ApplicationEnv = {
  [key in (typeof ENV_LIST)[number]]: string
}
