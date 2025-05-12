import { vertex } from "@ai-sdk/google-vertex"

const vertexModel = vertex.languageModel("gemini-2.0-flash-001")

const vertexImageModel = vertex.image("imagen-3.0-fast-generate-001")

export { vertexModel, vertexImageModel }
