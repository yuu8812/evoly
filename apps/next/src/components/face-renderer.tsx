"use client"

import type { AppType } from "@evoly/hono"
import gsap from "gsap"
import { hc } from "hono/client"
import Image from "next/image"
import { useEffect, useRef } from "react"
import useSWR from "swr"

const client = hc<AppType>("http://localhost:4000/")

export const FaceRenderer = ({}) => {
  // Refs for GSAP animations
  const containerRef = useRef(null)
  const faceRef = useRef(null)
  const leftEyeRef = useRef(null)
  const rightEyeRef = useRef(null)
  const mouthRef = useRef(null)

  const fetch = async () =>
    await client.baby[":id"]
      .$get({
        param: { id: "682217a2b98b58face6515aa" }
      })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch data")
        }
        return res.json()
      })

  const { data, error, isLoading } = useSWR("faceData", fetch)

  // GSAP Animations and Positioning
  useEffect(() => {
    if (!data) return

    // コンテナサイズを定義
    const containerWidth = 800
    const containerHeight = 1000
    const centerX = containerWidth / 2 // 400
    const centerY = containerHeight / 2 // 500

    // 修正した比率
    const faceWidthRatio = 0.8 // 80%
    const eyeWidthRatio = 0.18 // 18%（元の22%から小さく）
    const mouthWidthRatio = 0.15 // 20%（元の25%から小さく）

    // 顔のサイズ計算
    const faceWidth = containerWidth * faceWidthRatio
    const faceHeight = faceWidth * 1.2 // 黄金比に近い高さの比率

    // 目と口の参照を取得
    const leftEyeOpened = leftEyeRef.current.querySelector(".eye-opened")!
    const leftEyeClosed = leftEyeRef.current.querySelector(".eye-closed")!
    const rightEyeOpened = rightEyeRef.current.querySelector(".eye-opened")!
    const rightEyeClosed = rightEyeRef.current.querySelector(".eye-closed")!
    const mouthOpened = mouthRef.current.querySelector(".mouth-opened")!
    const mouthClosed = mouthRef.current.querySelector(".mouth-closed")!

    // 初期状態を設定 - 明示的に不透明度を設定
    gsap.set(leftEyeOpened, { opacity: 1 })
    gsap.set(rightEyeOpened, { opacity: 1 })
    gsap.set(leftEyeClosed, { opacity: 0 })
    gsap.set(rightEyeClosed, { opacity: 0 })
    gsap.set(mouthOpened, { opacity: 0 })
    gsap.set(mouthClosed, { opacity: 1 })

    // 顔の中心を基準点として配置する
    // まず顔を中央に配置
    gsap.set(faceRef.current, {
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
      width: faceWidth,
      height: faceHeight
    })

    // 目のサイズ計算
    const eyeWidth = containerWidth * eyeWidthRatio
    const eyeHeight = eyeWidth

    // 顔の中心からの絶対位置で目を配置する
    // 顔の幅に対する相対的な位置（%）で設定
    const eyeHorizontalOffsetRatio = data.agentModel.parts.percent.eye.x + -0.08 // 顔の幅の2.5%の位置（少し右寄り）
    const eyeVerticalOffsetRatio = data.agentModel.parts.percent.eye.y + -0.06 // 顔の高さの5%の位置（より上側に配置）
    // 絶対値での位置計算
    const eyeHorizontalOffset = faceWidth * eyeHorizontalOffsetRatio // 顔の中心から水平方向のオフセット
    const eyeVerticalOffset = faceHeight * eyeVerticalOffsetRatio // 顔の中心から垂直方向のオフセット

    // 右目の配置（顔の中心を基準とした絶対位置）
    gsap.set(rightEyeRef.current, {
      x: centerX + eyeHorizontalOffset,
      y: centerY + eyeVerticalOffset,
      xPercent: -50,
      yPercent: -50,
      width: eyeWidth,
      height: eyeHeight
    })

    // 左目の配置（顔の中心を基準とした絶対位置）
    gsap.set(leftEyeRef.current, {
      x: centerX - eyeHorizontalOffset,
      y: centerY + eyeVerticalOffset,
      xPercent: -50,
      yPercent: -50,
      scaleX: -1, // 左右反転
      width: eyeWidth,
      height: eyeHeight
    })

    // 口のサイズ計算
    const mouthWidth = containerWidth * mouthWidthRatio
    const mouthHeight = mouthWidth * 0.12 // 高さをさらに小さく調整

    // 顔の中心からの絶対位置で口を配置する
    // 顔の高さに対する相対的な位置（%）で設定
    const mouthHorizontalOffsetRatio = data.agentModel.parts.percent.mouth.x + -0.025 // 顔の幅の2.5%の位置（少し右寄り）
    const mouthVerticalOffsetRatio = data.agentModel.parts.percent.mouth.y + -0.278 // 顔の高さの5%の位置（より上側に配置）

    // 絶対値での位置計算
    const mouthHorizontalOffset = faceWidth * mouthHorizontalOffsetRatio
    const mouthVerticalOffset = faceHeight * mouthVerticalOffsetRatio

    // 口の配置（顔の中心を基準とした絶対位置）
    gsap.set(mouthRef.current, {
      x: centerX + mouthHorizontalOffset,
      y: centerY + mouthVerticalOffset,
      xPercent: -50,
      yPercent: -50,
      width: mouthWidth,
      height: mouthHeight
    })

    // 顔全体の自然な小刻みな動き
    const faceNaturalMovement = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5
    })

    // ランダムな小さな回転
    faceNaturalMovement
      .to(faceRef.current, {
        rotation: () => gsap.utils.random(-0.8, 0.8),
        duration: () => gsap.utils.random(2, 4),
        ease: "sine.inOut"
      })
      .to(faceRef.current, {
        rotation: () => gsap.utils.random(-1, 1),
        duration: () => gsap.utils.random(2, 3),
        ease: "sine.inOut"
      })
      .to(faceRef.current, {
        rotation: 0, // 元の位置に戻る
        duration: 3,
        ease: "sine.inOut"
      })

    // 同時に微妙な横の揺れも追加
    gsap.to(faceRef.current, {
      x: centerX + 2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      repeatDelay: 1
    })

    // 同時に微妙な縦の揺れも追加（息をするような）
    gsap.to(faceRef.current, {
      y: centerY - 2,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    // 全体の呼吸のようなゆっくりとした動き
    gsap.to(faceRef.current, {
      scale: 1.01,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    // まばたきのタイムライン - 閉じた目/開いた目の切り替え
    const createBlinkAnimation = () => {
      const timeline = gsap.timeline({
        onComplete: () => {
          // まばたきが完了したらランダムな時間後に再度まばたき
          gsap.delayedCall(gsap.utils.random(3, 7), createBlinkAnimation)
        }
      })

      // 両目が同時にまばたき - 画像を切り替える
      timeline
        .to(
          [leftEyeOpened, rightEyeOpened],
          {
            opacity: 0,
            duration: 0.08,
            ease: "power1.in"
          },
          0
        )
        .to(
          [leftEyeClosed, rightEyeClosed],
          {
            opacity: 1,
            duration: 0.08,
            ease: "power1.in"
          },
          0
        )
        .to({}, { duration: 0.1 }) // 閉じた状態を少しだけ維持
        .to(
          [leftEyeOpened, rightEyeOpened],
          {
            opacity: 1,
            duration: 0.1,
            ease: "power1.out"
          },
          "+=0.1"
        )
        .to(
          [leftEyeClosed, rightEyeClosed],
          {
            opacity: 0,
            duration: 0.1,
            ease: "power1.out"
          },
          "-=0.1"
        )

      return timeline
    }

    // まばたきアニメーションを開始
    createBlinkAnimation()

    // 時々の目の動き - より小さく自然な動きに
    const eyeMovementTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: gsap.utils.random(4, 8) // 不規則な間隔
    })

    eyeMovementTimeline
      // ごくわずかな視線の動き
      .to([leftEyeRef.current, rightEyeRef.current], {
        x: (i) => (i === 0 ? centerX - eyeHorizontalOffset + 2 : centerX + eyeHorizontalOffset + 2), // 元の絶対位置から+2px
        duration: 0.2,
        ease: "sine.out",
        delay: () => gsap.utils.random(2, 4)
      })
      .to([leftEyeRef.current, rightEyeRef.current], {
        x: (i) => (i === 0 ? centerX - eyeHorizontalOffset - 1 : centerX + eyeHorizontalOffset - 1), // 元の絶対位置から-1px
        duration: 0.4,
        ease: "sine.inOut"
      })
      .to([leftEyeRef.current, rightEyeRef.current], {
        x: (i) => (i === 0 ? centerX - eyeHorizontalOffset : centerX + eyeHorizontalOffset), // 元の絶対位置に戻る
        duration: 0.2,
        ease: "sine.in"
      })
      // しばらく待った後の別の小さな動き
      .to([leftEyeRef.current, rightEyeRef.current], {
        y: (i) => centerY + eyeVerticalOffset - 1, // 元の絶対位置から-1px
        duration: 0.15,
        ease: "sine.out",
        delay: 1
      })
      .to([leftEyeRef.current, rightEyeRef.current], {
        y: (i) => centerY + eyeVerticalOffset, // 元の絶対位置に戻る
        duration: 0.15,
        ease: "sine.in"
      })

    // 同時に微細な継続的な動き
    gsap.to([leftEyeRef.current, rightEyeRef.current], {
      y: (i) => centerY + eyeVerticalOffset - 0.5, // 元の絶対位置から-0.5px
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    // 口の開閉アニメーション - 開いた口/閉じた口の切り替え
    const createMouthAnimation = () => {
      // ランダムな確率で口を開けるかどうか決定
      const shouldOpenMouth = Math.random() > 0.7 // 30%の確率で口を開ける

      if (shouldOpenMouth) {
        const timeline = gsap.timeline({
          onComplete: () => {
            // 口のアニメーションが完了したらランダムな時間後に再度チェック
            gsap.delayedCall(gsap.utils.random(3, 8), createMouthAnimation)
          }
        })

        // 口を開けるアニメーション - 画像を切り替える
        timeline
          .to(
            mouthClosed,
            {
              opacity: 0,
              duration: 0.2,
              ease: "power1.out"
            },
            0
          )
          .to(
            mouthOpened,
            {
              opacity: 1,
              duration: 0.2,
              ease: "power1.out"
            },
            0
          )
          // 少し開けた状態を維持
          .to({}, { duration: gsap.utils.random(0.3, 0.8) })
          // 口を閉じる
          .to(mouthClosed, {
            opacity: 1,
            duration: 0.2,
            ease: "power1.in"
          })
          .to(
            mouthOpened,
            {
              opacity: 0,
              duration: 0.2,
              ease: "power1.in"
            },
            "-=0.2"
          )
      } else {
        // 口の小さな動きのみ
        const timeline = gsap.timeline({
          onComplete: () => {
            gsap.delayedCall(gsap.utils.random(2, 5), createMouthAnimation)
          }
        })

        // 閉じた口の小さな動き
        timeline
          .to(mouthRef.current, {
            scaleX: 1.03,
            scaleY: 0.97,
            duration: 0.4,
            ease: "sine.inOut"
          })
          .to(mouthRef.current, {
            scaleX: 1,
            scaleY: 1,
            duration: 0.3,
            ease: "sine.inOut"
          })
      }
    }

    // 口のアニメーションを開始
    createMouthAnimation()

    // 同時に口の微細な継続的な動き（絶対位置を基準）
    gsap.to(mouthRef.current, {
      y: centerY + mouthVerticalOffset + 0.8, // 元の絶対位置から+0.8px
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    // 全体の微妙な揺れを調整 - より自然な小刻みな動きに
    gsap.to(containerRef.current, {
      rotation: () => gsap.utils.random(-0.5, 0.5),
      x: () => gsap.utils.random(-2, 2),
      y: () => gsap.utils.random(-2, 2),
      duration: () => gsap.utils.random(3, 5),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      repeatDelay: gsap.utils.random(0.2, 1)
    })

    // コンポーネントがアンマウントされた時にアニメーションをクリア
    return () => {
      gsap.killTweensOf([
        containerRef.current,
        faceRef.current,
        leftEyeRef.current,
        rightEyeRef.current,
        mouthRef.current,
        leftEyeOpened,
        leftEyeClosed,
        rightEyeOpened,
        rightEyeClosed,
        mouthOpened,
        mouthClosed
      ])
    }
  }, [data])

  if (error) return <div>Error loading face data</div>
  // loading component
  if (!data)
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  // 正確なサイズ計算 (レンダリング用)
  const containerWidth = 800
  const faceWidth = containerWidth * 0.8 // 80%
  const eyeWidth = containerWidth * 0.18 // 18%
  const mouthWidth = containerWidth * 0.2 // 20%
  const mouthHeight = mouthWidth * 0.15 // 幅の15%の高さ

  return (
    <div ref={containerRef} className="relative w-[800px] h-[800px] overflow-hidden scale-200 select-none" draggable="false">
      {/* 顔の基本構造 - 位置はGSAPで制御 */}
      <div ref={faceRef} className="absolute">
        <Image src={data.agentModel.parts.face.normal.path} alt="Face Normal" width={faceWidth} height={faceWidth * 1.2} priority draggable="false" />
      </div>

      {/* 右目 - 開いた目と閉じた目を分離 */}
      <div ref={rightEyeRef} className="absolute">
        <div className="eye-opened relative">
          <Image src={data.agentModel.parts.eyes.opened.path} alt="Right Eye Opened" width={eyeWidth} height={eyeWidth} priority draggable="false" />
        </div>
        <div className="eye-closed absolute top-0 left-0 opacity-0">
          <Image src={data.agentModel.parts.eyes.closed.path} alt="Right Eye Closed" width={eyeWidth} height={eyeWidth} priority draggable="false" />
        </div>
      </div>

      {/* 左目 - 開いた目と閉じた目を分離 */}
      <div ref={leftEyeRef} className="absolute">
        <div className="eye-opened relative">
          <Image src={data.agentModel.parts.eyes.opened.path} alt="Left Eye Opened" width={eyeWidth} height={eyeWidth} priority draggable="false" />
        </div>
        <div className="eye-closed absolute top-0 left-0 opacity-0">
          <Image src={data.agentModel.parts.eyes.closed.path} alt="Left Eye Closed" width={eyeWidth} height={eyeWidth} priority draggable="false" />
        </div>
      </div>

      {/* 口 - 閉じた口と開いた口を分離 */}
      <div ref={mouthRef} className="absolute">
        <div className="mouth-closed relative">
          <Image src={data.agentModel.parts.mouth.closed.path} alt="Mouth Closed" width={mouthWidth} height={mouthHeight} priority draggable="false" />
        </div>
        <div className="mouth-opened absolute top-0 left-0 opacity-0">
          <Image src={data.agentModel.parts.mouth.opened.path} alt="Mouth Opened" width={mouthWidth} height={mouthHeight} priority draggable="false" />
        </div>
      </div>
    </div>
  )
}
