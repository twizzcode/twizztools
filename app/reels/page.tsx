"use client"

import * as React from "react"
import { ReelsWorkspace } from "@/components/reels/reels-workspace"
import { ReelsSettings } from "@/components/reels/reels-settings"
import type { ReelsMode } from "@/components/reels/reels-preview"

export default function ReelsPage() {
  const [image, setImage] = React.useState<string>()
  const [mode, setMode] = React.useState<ReelsMode>("content")
  const [customColor, setCustomColor] = React.useState("#222831")
  const [contentBlur, setContentBlur] = React.useState(10)

  const handleReset = () => {
    setImage(undefined)
    setMode("content")
    setCustomColor("#222831")
    setContentBlur(10)
  }

  return (
    <div className="container mx-auto flex h-full flex-1 flex-col min-h-0 py-4 lg:py-0">
      <div className="relative flex flex-1 flex-col gap-4 lg:min-h-0 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1 pr-4 lg:pr-0 pl-4 lg:min-h-0 lg:py-4 flex flex-col">
          <ReelsWorkspace
            image={image}
            onChangeImage={setImage}
            mode={mode}
            customColor={customColor}
            contentBlur={contentBlur}
          />
        </div>

        {image && (
          <div className="w-full px-4 pb-4 lg:w-[320px] lg:flex-none lg:min-h-0 lg:py-4 lg:pl-0 lg:pr-4">
            <ReelsSettings
            image={image}
            mode={mode}
            customColor={customColor}
            contentBlur={contentBlur}
            onModeChange={setMode}
            onCustomColorChange={setCustomColor}
            onContentBlurChange={setContentBlur}
            onReset={handleReset}
          />
          </div>
        )}
      </div>
    </div>
  )
}
