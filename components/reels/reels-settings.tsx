"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { ReelsMode } from "./reels-preview"

const MODES: readonly ReelsMode[] = ["content", "white", "black", "custom"] as const
const EXPORT_W = 1080
const EXPORT_H = 1920

type ReelsSettingsProps = {
  image?: string
  mode: ReelsMode
  customColor: string
  contentBlur: number
  onModeChange: (mode: ReelsMode) => void
  onCustomColorChange: (color: string) => void
  onContentBlurChange: (blur: number) => void
  onReset: () => void
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(nextValue) => {
        const selected = nextValue[0]
        if (selected) onChange(selected as T)
      }}
      className="grid w-full"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      variant="outline"
      spacing={0}
      disabled={disabled}
    >
      {options.map((item) => (
        <ToggleGroupItem key={item} value={item} className="w-full capitalize">
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function ReelsSettings({ image, mode, customColor, contentBlur, onModeChange, onCustomColorChange, onContentBlurChange, onReset }: ReelsSettingsProps) {
  const [customInput, setCustomInput] = React.useState(customColor)
  const [exporting, setExporting] = React.useState(false)

  const disabled = !image

  const handleColorInput = (val: string) => {
    setCustomInput(val)
    const trimmed = val.trim()
    const hexOk = /^#([0-9a-f]{3}|([0-9a-f]{6}))$/i.test(trimmed)
    const fnOk = /^(rgb|rgba|hsl|hsla)\(/i.test(trimmed)
    if (hexOk || fnOk) {
      onCustomColorChange(trimmed)
    }
  }

  const download = () => {
    if (exporting || !image) return
    setExporting(true)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = EXPORT_W
        canvas.height = EXPORT_H
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("ctx")

        ctx.clearRect(0, 0, EXPORT_W, EXPORT_H)
        if (mode === "white") ctx.fillStyle = "#fff"
        else if (mode === "black") ctx.fillStyle = "#000"
        else if (mode === "custom") ctx.fillStyle = customColor
        else ctx.fillStyle = "transparent"
        ctx.fillRect(0, 0, EXPORT_W, EXPORT_H)

        const nW = img.naturalWidth
        const nH = img.naturalHeight
        const targetH = EXPORT_H * 0.75
        const scale = targetH / nH
        const targetW = nW * scale
        const destY = (EXPORT_H - targetH) / 2

        let srcX = 0
        let visW = nW
        if (targetW > EXPORT_W) {
          visW = EXPORT_W / scale
          srcX = (nW - visW) / 2
        }

        if (mode === "content" && destY > 0) {
          const sliceH = destY / scale
          ctx.filter = `blur(${contentBlur}px)`
          ctx.drawImage(img, srcX, 0, visW, sliceH, 0, 0, EXPORT_W, destY)
          ctx.drawImage(img, srcX, nH - sliceH, visW, sliceH, 0, destY + targetH, EXPORT_W, destY)
          ctx.filter = "none"
        }

        const destX = targetW <= EXPORT_W ? (EXPORT_W - targetW) / 2 : 0
        ctx.drawImage(img, srcX, 0, visW, nH, destX, destY, targetW <= EXPORT_W ? targetW : EXPORT_W, targetH)

        canvas.toBlob((b) => {
          if (!b) {
            setExporting(false)
            return
          }
          const url = URL.createObjectURL(b)
          const a = document.createElement("a")
          a.href = url
          a.download = "reels_1080x1920.png"
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(url)
          setExporting(false)
        }, "image/png")
      } catch (e) {
        console.error(e)
        setExporting(false)
      }
    }
    img.onerror = () => setExporting(false)
    img.src = image
  }

  return (
    <aside className="flex h-fit flex-col bg-transparent lg:sticky lg:top-0 lg:h-full lg:min-h-0">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:h-full">
        <div className="flex-1 space-y-3">
          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">Reels Mode</h2>
            <Segmented options={MODES} value={mode} onChange={onModeChange} />
          </div>

          <div className={mode === "content" ? "grid gap-2" : "pointer-events-none invisible grid gap-2"}>
            <label className="flex items-center justify-between text-sm font-semibold">
              <span>Blur</span>
              <span className="tabular-nums text-xs font-normal text-muted-foreground">{contentBlur}px</span>
            </label>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={contentBlur}
              disabled={disabled || mode !== "content"}
              onChange={(e) => onContentBlurChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className={mode === "custom" ? "grid gap-2" : "pointer-events-none invisible grid gap-2"}>
            <h2 className="text-sm font-semibold">Custom Background</h2>
            <div className="flex items-center gap-2">
              <input
                type="color"
                disabled={disabled || mode !== "custom"}
                value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(customColor) ? customColor : "#000000"}
                onChange={(e) => {
                  if (mode !== "custom") return
                  onCustomColorChange(e.target.value)
                  setCustomInput(e.target.value)
                }}
                className="h-10 w-10 p-0 border rounded cursor-pointer"
              />
              <input
                disabled={disabled || mode !== "custom"}
                value={customInput}
                onChange={(e) => {
                  if (mode !== "custom") return
                  handleColorInput(e.target.value)
                }}
                placeholder="#112233 / rgb(0,0,0)"
                className="flex-1 h-10 text-xs px-3 rounded-md border bg-background"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <Button onClick={download} disabled={disabled || exporting}>
            {exporting ? "Exporting..." : "Download"}
          </Button>
          <Button variant="outline" onClick={onReset} disabled={disabled}>
            Ganti gambar
          </Button>
        </div>
      </div>
    </aside>
  )
}
