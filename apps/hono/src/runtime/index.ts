import { Layer, ManagedRuntime } from "effect"
import { DbContextLiveLayer } from "../context/db/DbContextLive"
import { EnvContextLiveLayer } from "../context/env/EnvContextLive"
import { CloudTaskServiceLiveLayer } from "../service/cloudTaskService/CloudTaskServiceLive"

// 全てのコンテキストを含む統合レイヤー
const AppLayers = Layer.mergeAll(EnvContextLiveLayer, DbContextLiveLayer, CloudTaskServiceLiveLayer)

// アプリケーション全体で共有するランタイム
export const runtime = ManagedRuntime.make(AppLayers)
