"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, CheckmarkCircle02Icon, PencilEdit02Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

type CaptionsResultsProps = {
  captions: string[]
  onGenerateAgain: () => void
  canGenerateAgain: boolean
}

export function CaptionsResults({
  captions,
  onGenerateAgain,
  canGenerateAgain,
}: CaptionsResultsProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [editedCaptions, setEditedCaptions] = React.useState<string[]>(captions)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setEditedCaptions(captions), 0)
    return () => window.clearTimeout(timeout)
  }, [captions])

  const handleCopy = React.useCallback((caption: string, index: number) => {
    navigator.clipboard.writeText(caption).then(() => {
      setCopiedIndex(index)
      toast.success("Caption copied to clipboard!")
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }, [])

  const handleEdit = React.useCallback((index: number) => {
    setEditingIndex(index)
  }, [])

  const handleSave = React.useCallback(() => {
    setEditingIndex(null)
    toast.success("Caption updated!")
  }, [])

  const handleCaptionChange = React.useCallback((index: number, value: string) => {
    setEditedCaptions((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generated Captions</h3>
        {canGenerateAgain && (
          <Button variant="outline" size="sm" onClick={onGenerateAgain}>
            Generate Again
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {editedCaptions.map((caption, index) => (
          <div
            key={index}
            className="group relative rounded-lg border bg-card p-4 transition-colors"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Caption {index + 1}
              </span>
              <div className="flex gap-1">
                {editingIndex === index ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => handleSave()}
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      strokeWidth={2}
                      className="size-4 text-green-500"
                    />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => handleEdit(index)}
                  >
                    <HugeiconsIcon
                      icon={PencilEdit02Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => handleCopy(caption, index)}
                >
                  <HugeiconsIcon
                    icon={copiedIndex === index ? CheckmarkCircle02Icon : Copy01Icon}
                    strokeWidth={2}
                    className={`size-4 ${copiedIndex === index ? "text-green-500" : ""}`}
                  />
                </Button>
              </div>
            </div>
            {editingIndex === index ? (
              <Textarea
                value={caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                className="min-h-[100px] text-sm leading-relaxed"
                autoFocus
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
