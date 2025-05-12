import {} from "@mastra/core/agent"
import { vertexModel } from "../../../utils/models"

const PLACEMENT_AGENT_PROMPT = `あなたは、入力された顔画像に基づいて「目・鼻・口」が最も自然かつ美しく配置される相対座標（％）を計算し、JSON形式で返すAIエージェントです。

座標は、画像の中心点（中央 = x: 0, y: 0）を基準として、各パーツの位置を左右・上下にどれだけずれているかを**-1.0〜1.0の小数（%）で表現**してください。

【出力形式】
以下のような正しいJSON形式で出力してください。各値は number 型（例: 0.05、-0.12）です。

\`\`\`json
{
  "percent": {
    "eye": {
      "x": number,
      "y": number
    },
    "mouth": {
      "x": number,
      "y": number
    },
    "nose": {
      "x": number,
      "y": number
    }
  }
}
\`\`\`

【出力例】
\`\`\`json
{
  "percent": {
    "eye": {
      "x": 0.02,
      "y": -0.12
    },
    "mouth": {
      "x": 0.01,
      "y": 0.15
    },
    "nose": {
      "x": 0.00,
      "y": 0.05
    }
  }
}
\`\`\`

※注意：
- JSONの構文エラー（カンマ漏れ、ダブルクォート忘れなど）を含まないようにしてください。
- JSON以外のテキストは一切含めず、上記形式の出力のみを返してください。
`

export const placeMentAgent = {
  generate: async (image: Uint8Array<ArrayBufferLike> | URL) =>
    await vertexModel.doGenerate({
      prompt: [
        {
          role: "user",
          content: [
            { type: "text", text: PLACEMENT_AGENT_PROMPT },
            { type: "image", image }
          ]
        }
      ],
      inputFormat: "messages",
      mode: { type: "regular" }
    })
}
