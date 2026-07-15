"use client"

import * as React from "react"
import { CaptionsWorkspace } from "@/components/captions/captions-workspace"
import { CaptionsSettings } from "@/components/captions/captions-settings"
import type { CaptionOptions } from "@/lib/caption-prompt"
import { checkRateLimit, incrementUsage } from "@/lib/rate-limit"
import { toast } from "sonner"

export default function CaptionsPage() {
  const [image, setImage] = React.useState<string>()
  const [options, setOptions] = React.useState<CaptionOptions>({
    theme: "personal",
    tone: "casual",
    length: "medium",
    writingStyle: "informative",
    includeEmotions: false,
    language: "indonesian",
  })
  const [captions, setCaptions] = React.useState<string[]>([])
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const [rateLimit, setRateLimit] = React.useState(() => checkRateLimit())

  React.useEffect(() => {
    setRateLimit(checkRateLimit())
  }, [captions.length])

  const handleGenerate = React.useCallback(async () => {
    if (!image) return

    const currentRateLimit = checkRateLimit()
    if (!currentRateLimit.allowed) {
      toast.error("Daily limit reached. Try again tomorrow!")
      return
    }

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    setIsGenerating(true)
    setError(undefined)
    setCaptions([])

    try {
      const response = await fetch("/api/captions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, options }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate captions")
      }

      const data = await response.json()
      setCaptions(data.captions)
      incrementUsage()
      toast.success("Captions generated successfully!")
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate captions"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [image, options])

  const handleGenerateAgain = React.useCallback(() => {
    if (!image) return

    const currentRateLimit = checkRateLimit()
    if (!currentRateLimit.allowed) {
      toast.error("Daily limit reached. Try again tomorrow!")
      return
    }

    setCaptions([])
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    setIsGenerating(true)
    setError(undefined)

    fetch("/api/captions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, options }),
      signal: abortControllerRef.current.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to generate captions")
        }
        return response.json()
      })
      .then((data) => {
        setCaptions(data.captions)
        incrementUsage()
        toast.success("Captions generated successfully!")
      })
      .catch((err) => {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }

        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate captions"
        setError(errorMessage)
        toast.error(errorMessage)
      })
      .finally(() => {
        setIsGenerating(false)
      })
  }, [image, options])

  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return (
    <div className="container mx-auto flex h-full flex-1 flex-col min-h-0 py-4 lg:py-0">
      <div className="relative flex flex-1 flex-col gap-4 lg:min-h-0 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1 pr-4 lg:pr-0 pl-4 lg:min-h-0 lg:py-4 flex flex-col">
          <CaptionsWorkspace
            image={image}
            onImageChange={setImage}
            isGenerating={isGenerating}
            error={error}
            captions={captions}
            onGenerateAgain={handleGenerateAgain}
            canGenerateAgain={rateLimit.allowed}
          />
        </div>

        {image && (
          <div className="w-full px-4 pb-4 lg:w-[320px] lg:flex-none lg:min-h-0 lg:py-4 lg:pl-0 lg:pr-4">
            <CaptionsSettings
              options={options}
              onOptionsChange={setOptions}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              hasImage={!!image}
            />
          </div>
        )}
      </div>
    </div>
  )
}
