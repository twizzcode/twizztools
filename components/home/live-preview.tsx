"use client"

import * as React from "react"

const GRID_GAP_OPTIONS = ["With-Gap", "Without-Gap"] as const

export type Phase = "upload" | "crop" | "result"
export type CutMode = "Grid" | "Carousel" | "Custom"
export type GapOption = (typeof GRID_GAP_OPTIONS)[number]

export const CUT_MODES: CutMode[] = ["Grid", "Carousel", "Custom"]
export { GRID_GAP_OPTIONS }

export const GRID_CONST = {
  "With-Gap": {
    aspect: 0.4313099041533546,
    compositeWidth: 3130,
    sliceOffsets: [0, 1025, 2050] as const,
  },
  "Without-Gap": {
    aspect: 0.4340836012861736,
    compositeWidth: 3110,
    sliceOffsets: [0, 1015, 2030] as const,
  },
  outputSliceHeight: 1350,
  outputSliceWidth: 1080,
} as const

export function clampCount(value: number) {
  return Math.min(10, Math.max(1, value || 1))
}

export function LivePreview({
  file,
  mode,
  gap,
  rows,
  cols,
}: {
  file: File
  mode: CutMode
  gap: GapOption
  rows: number
  cols: number
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const imageRef = React.useRef<HTMLImageElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const [previewSize, setPreviewSize] = React.useState<{ width: number; height: number } | null>(null)
  const [url, setUrl] = React.useState("")

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    const wrapper = containerRef.current
    if (!canvas || !image || !wrapper) return
    const context = canvas.getContext("2d")
    if (!context) return

    const { naturalWidth, naturalHeight } = image
    if (!naturalWidth || !naturalHeight) return

    const maxWidth = wrapper.clientWidth
    const maxHeight = wrapper.clientHeight
    let width = naturalWidth
    let height = naturalHeight
    const aspect = width / height

    if (width > maxWidth) {
      width = maxWidth
      height = width / aspect
    }
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspect
    }

    width = Math.round(width)
    height = Math.round(height)

    setPreviewSize((current) =>
      current?.width === width && current?.height === height ? current : { width, height },
    )

    canvas.width = width
    canvas.height = height
    context.clearRect(0, 0, width, height)
    context.save()
    context.strokeStyle = "rgba(255,255,255,0.95)"
    context.lineWidth = 2

    if (mode === "Grid") {
      const config = GRID_CONST[gap]
      let effectiveWidth = width
      let rowHeight = effectiveWidth * config.aspect

      if (rowHeight * rows > height) {
        effectiveWidth = (height / rows) / config.aspect
        rowHeight = effectiveWidth * config.aspect
      }

      const startX = effectiveWidth < width ? (width - effectiveWidth) / 2 : 0
      const totalHeight = rowHeight * rows
      const startY = totalHeight < height ? (height - totalHeight) / 2 : 0
      const scale = effectiveWidth / config.compositeWidth

      for (let row = 0; row < rows; row++) {
        context.strokeRect(startX, startY + row * rowHeight, effectiveWidth, rowHeight)
        for (let index = 1; index < config.sliceOffsets.length; index++) {
          const lineX = startX + config.sliceOffsets[index] * scale
          context.beginPath()
          context.moveTo(lineX, startY + row * rowHeight)
          context.lineTo(lineX, startY + (row + 1) * rowHeight)
          context.stroke()
        }
      }
    } else if (mode === "Carousel") {
      const aspectCarousel = 4 / 5
      let cellWidth = width / cols
      let cellHeight = cellWidth / aspectCarousel

      if (cellHeight > height) {
        cellHeight = height
        cellWidth = cellHeight * aspectCarousel
      }

      const totalWidth = cellWidth * cols
      const startX = (width - totalWidth) / 2
      const startY = (height - cellHeight) / 2

      for (let col = 0; col < cols; col++) {
        context.strokeRect(startX + col * cellWidth, startY, cellWidth, cellHeight)
      }
    } else {
      const cellWidth = width / cols
      const cellHeight = height / rows
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          context.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight)
        }
      }
    }

    context.restore()
  }, [cols, gap, mode, rows])

  React.useEffect(() => {
    draw()
  }, [draw])

  React.useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => draw())
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [draw])

  React.useEffect(() => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
    return () => setUrl("")
  }, [file])

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-background max-lg:min-h-[50svh]"
    >
      {url && (
        <img
          ref={imageRef}
          src={url}
          alt={file.name}
          onLoad={draw}
          className="block object-contain"
          style={previewSize ? { width: previewSize.width, height: previewSize.height } : undefined}
        />
      )}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 m-auto"
        style={previewSize ? { width: previewSize.width, height: previewSize.height } : undefined}
      />
    </div>
  )
}
