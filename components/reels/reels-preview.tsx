"use client"

import * as React from "react"

const ASPECT = 0.5625
const IMG_HEIGHT_RATIO = 0.75

export type ReelsMode = "content" | "white" | "black" | "custom"

type ReelsPreviewProps = {
  image: string
  mode: ReelsMode
  customColor: string
  contentBlur: number
}

export function ReelsPreview({ image, mode, customColor, contentBlur }: ReelsPreviewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const imgElRef = React.useRef<HTMLImageElement | null>(null)

  const [containerSize, setContainerSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 })
  const [canvasSize, setCanvasSize] = React.useState<{ w: number; h: number } | null>(null)

  const avgCache = React.useRef<Record<string, string>>({})

  const measure = React.useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setContainerSize({ w: rect.width, h: rect.height })
  }, [])

  React.useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  const loadImage = React.useCallback((src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image()
      im.crossOrigin = "anonymous"
      im.onload = () => res(im)
      im.onerror = rej
      im.src = src
    }), [])

  const getAverage = React.useCallback((img: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, key: string) => {
    if (avgCache.current[key]) return avgCache.current[key]
    try {
      const off = document.createElement("canvas")
      off.width = 1
      off.height = 1
      const ctx = off.getContext("2d")
      if (!ctx) return "#000"
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      const c = `rgb(${d[0]},${d[1]},${d[2]})`
      avgCache.current[key] = c
      return c
    } catch {
      return "#000"
    }
  }, [])

  const drawComposite = React.useCallback(
    (
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      img: HTMLImageElement,
      useMode: ReelsMode,
      useColor: string,
      useBlur: number
    ) => {
      ctx.clearRect(0, 0, W, H)
      if (useMode === "white") ctx.fillStyle = "#fff"
      else if (useMode === "black") ctx.fillStyle = "#000"
      else if (useMode === "custom") ctx.fillStyle = useColor
      else ctx.fillStyle = "transparent"
      ctx.fillRect(0, 0, W, H)

      const nW = img.naturalWidth
      const nH = img.naturalHeight
      const targetH = H * IMG_HEIGHT_RATIO
      const scale = targetH / nH
      const targetW = nW * scale
      const destY = (H - targetH) / 2

      let srcX = 0
      let visW = nW
      if (targetW > W) {
        visW = W / scale
        srcX = (nW - visW) / 2
      }

      if (useMode === "content" && destY > 0) {
        const sliceH = destY / scale
        const topColor = getAverage(img, srcX, 0, visW, sliceH, `t:${srcX}:${visW}:${sliceH}`)
        const botColor = getAverage(img, srcX, nH - sliceH, visW, sliceH, `b:${srcX}:${visW}:${sliceH}`)
        ctx.fillStyle = topColor
        ctx.fillRect(0, 0, W, destY)
        ctx.fillStyle = botColor
        ctx.fillRect(0, destY + targetH, W, destY)
        ctx.filter = `blur(${useBlur}px)`
        ctx.drawImage(img, srcX, 0, visW, sliceH, 0, 0, W, destY)
        ctx.drawImage(img, srcX, nH - sliceH, visW, sliceH, 0, destY + targetH, W, destY)
        ctx.filter = "none"
      }

      const destX = targetW <= W ? (W - targetW) / 2 : 0
      ctx.drawImage(img, srcX, 0, visW, nH, destX, destY, targetW <= W ? targetW : W, targetH)
      return { destY, targetImgH: targetH }
    },
    [getAverage]
  )

  const redraw = React.useCallback(() => {
    if (!imgElRef.current || !canvasRef.current || !containerSize.h || !containerSize.w) return

    const availW = containerSize.w
    const availH = containerSize.h
    let H = availH
    let W = H * ASPECT
    if (W > availW) {
      W = availW
      H = W / ASPECT
    }
    W = Math.round(W)
    H = Math.round(H)

    const canvas = canvasRef.current
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W
      canvas.height = H
      setCanvasSize({ w: W, h: H })
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    drawComposite(ctx, W, H, imgElRef.current, mode, customColor, contentBlur)
  }, [containerSize, mode, customColor, contentBlur, drawComposite])

  React.useEffect(() => {
    let cancel = false
    if (!image) {
      imgElRef.current = null
      return
    }
    ;(async () => {
      try {
        const im = await loadImage(image)
        if (cancel) return
        imgElRef.current = im
        redraw()
      } catch (e) {
        console.error("load fail", e)
      }
    })()
    return () => {
      cancel = true
    }
  }, [image, loadImage, redraw])

  React.useEffect(() => {
    if (imgElRef.current) redraw()
  }, [redraw])

  React.useEffect(() => {
    if (!canvasRef.current) return
    canvasRef.current.style.backgroundColor =
      mode === "white" ? "#fff" : mode === "black" ? "#000" : mode === "custom" ? customColor : "transparent"
  }, [mode, customColor])

  return (
    <div ref={containerRef} className="flex flex-1 items-center justify-center relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="rounded border transition filter"
        style={canvasSize ? { width: canvasSize.w, height: canvasSize.h } : undefined}
      />
    </div>
  )
}
