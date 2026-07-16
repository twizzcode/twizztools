"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"
import type { CaptionOptions } from "@/lib/caption-prompt"
import { checkRateLimit } from "@/lib/rate-limit"
import { FooterManager } from "./footer-manager"

type CaptionsSettingsProps = {
  options: CaptionOptions & { footerCode?: string }
  onOptionsChange: (options: CaptionOptions & { footerCode?: string }) => void
  onGenerate: () => void
  generateEvent?: string
  isGenerating: boolean
  hasImage: boolean
}

export function CaptionsSettings({
  options,
  onOptionsChange,
  onGenerate,
  generateEvent,
  isGenerating,
  hasImage,
}: CaptionsSettingsProps) {
  const [rateLimit, setRateLimit] = React.useState(() => checkRateLimit())
  const [footers, setFooters] = React.useState<
    Array<{ code: string }>
  >([])
  const [showFooterManager, setShowFooterManager] = React.useState(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRateLimit(checkRateLimit())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchFooters = React.useCallback(async () => {
    try {
      const response = await fetch("/api/footers")
      const data = await response.json()
      setFooters(data.footers || [])
    } catch (error) {
      console.error("Failed to fetch footers:", error)
    }
  }, [])

  React.useEffect(() => {
    const timeout = window.setTimeout(fetchFooters, 0)
    return () => window.clearTimeout(timeout)
  }, [fetchFooters])

  const handleFooterManagerClose = () => {
    setShowFooterManager(false)
    fetchFooters()
  }

  const canGenerate = hasImage && rateLimit.allowed && !isGenerating

  const lengthOptions: CaptionOptions["length"][] = ["short", "medium", "long"]

  return (
    <aside className="flex h-fit flex-col bg-transparent lg:sticky lg:top-0 lg:h-full lg:min-h-0">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:h-full lg:min-h-0">
        <div className="caption-scroll flex-1 overflow-auto space-y-3">
          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">Theme</h2>
            <Select
              value={options.theme}
              onValueChange={(value) =>
                onOptionsChange({ ...options, theme: value as CaptionOptions["theme"] })
              }
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">Tone</h2>
            <Select
              value={options.tone}
              onValueChange={(value) =>
                onOptionsChange({ ...options, tone: value as CaptionOptions["tone"] })
              }
            >
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">Length</h2>
            <ToggleGroup
              value={[options.length]}
              onValueChange={(value) => {
                const selected = value[0]
                if (selected) onOptionsChange({ ...options, length: selected as CaptionOptions["length"] })
              }}
              className="grid w-full"
              style={{ gridTemplateColumns: `repeat(${lengthOptions.length}, minmax(0, 1fr))` }}
              variant="outline"
              spacing={0}
            >
              {lengthOptions.map((item) => (
                <ToggleGroupItem key={item} value={item} className="w-full capitalize">
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">Writing Style</h2>
            <Select
              value={options.writingStyle}
              onValueChange={(value) =>
                onOptionsChange({
                  ...options,
                  writingStyle: value as CaptionOptions["writingStyle"],
                })
              }
            >
              <SelectTrigger id="writingStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="storytelling">Storytelling</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="reflective">Reflective</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">Language</h2>
            <Select
              value={options.language}
              onValueChange={(value) =>
                onOptionsChange({ ...options, language: value as CaptionOptions["language"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">🇺🇸 English</SelectItem>
                <SelectItem value="indonesian">🇮🇩 Bahasa Indonesia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Include Emotions</h2>
              <Switch
                id="emotions"
                checked={options.includeEmotions}
                onCheckedChange={(checked) =>
                  onOptionsChange({ ...options, includeEmotions: checked })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Custom Prompt</h2>
              <Switch
                id="custom-prompt-toggle"
                checked={options.customPrompt !== undefined}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onOptionsChange({ ...options, customPrompt: "" })
                  } else {
                    onOptionsChange({ ...options, customPrompt: undefined })
                  }
                }}
              />
            </div>
            {options.customPrompt !== undefined && (
              <div className="space-y-2">
                <Textarea
                  placeholder="e.g. Mention sustainability, Include call-to-action, Focus on benefits..."
                  value={options.customPrompt || ""}
                  onChange={(e) =>
                    onOptionsChange({ ...options, customPrompt: e.target.value })
                  }
                  rows={3}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Add specific instructions to customize the caption generation
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Include Footer</h2>
              <Switch
                id="footer-toggle"
                checked={options.footerCode !== undefined}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onOptionsChange({ ...options, footerCode: "" })
                  } else {
                    onOptionsChange({ ...options, footerCode: undefined })
                  }
                }}
              />
            </div>
            {options.footerCode !== undefined && (
              <div className="space-y-2">
                <Select
                  value={options.footerCode || ""}
                  onValueChange={(value) =>
                    onOptionsChange({
                      ...options,
                      footerCode: value || undefined,
                    })
                  }
                >
                  <SelectTrigger id="footer">
                    <SelectValue placeholder="Select footer" />
                  </SelectTrigger>
                  <SelectContent>
                    {footers.map((footer) => (
                      <SelectItem key={footer.code} value={footer.code}>
                        {footer.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowFooterManager(true)}
                >
                  Manage Footers
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3">
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-sm font-medium">
            {rateLimit.remaining}/5 generations remaining today
          </p>
          {!rateLimit.allowed && (
            <p className="mt-1 text-xs text-muted-foreground">
              Resets at midnight
            </p>
          )}
        </div>

          <Button
            className="w-full"
            onClick={onGenerate}
            disabled={!canGenerate}
            data-umami-event={generateEvent}
          >
            {isGenerating ? "Generating..." : "Generate Captions"}
          </Button>
        </div>

        <FooterManager
          open={showFooterManager}
          onClose={handleFooterManagerClose}
        />
      </div>
    </aside>
  )
}
