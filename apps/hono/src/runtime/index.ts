import { Layer, ManagedRuntime } from "effect"
import { AgentServiceLiveLayer } from "../service/agentService/AgentServiceLive"
import { CloudStorageServiceLiveLayer } from "../service/cloudStorageService/CloudStorageServiceLive"
import { CloudTaskServiceLiveLayer } from "../service/cloudTaskService/CloudTaskServiceLive"
import { MemoryServiceLiveLayer } from "../service/memoryService/MemoryServiceLive"
import { MongooseServiceLiveLayer } from "../service/mongooseService/MongooseServiceLive"

// 全てのコンテキストを含む統合レイヤー
const AppLayers = Layer.mergeAll(MongooseServiceLiveLayer, CloudTaskServiceLiveLayer, MemoryServiceLiveLayer, AgentServiceLiveLayer, CloudStorageServiceLiveLayer)

// アプリケーション全体で共有するランタイム
export const runtime = ManagedRuntime.make(AppLayers)
