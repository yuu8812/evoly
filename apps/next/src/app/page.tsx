import { FaceRenderer } from "@/components/face-renderer"

export default async function Home() {
  return (
    <div className="flex-1 flex">
      <main className="flex-1 flex justify-center items-center relative overflow-hidden bg-black">
        {/* コンテナ：画面中心に配置 */}
        <FaceRenderer />
      </main>
    </div>
  )
}
