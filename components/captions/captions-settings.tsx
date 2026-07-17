"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
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
  const t = useTranslations('captions');
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
  
  const lengthLabels: Record<CaptionOptions["length"], string> = {
    short: t('lengths.short'),
    medium: t('lengths.medium'),
    long: t('lengths.long'),
  };

  return (
    <aside className="flex h-fit flex-col bg-transparent lg:sticky lg:top-0 lg:h-full lg:min-h-0">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:h-full lg:min-h-0">
        <div className="caption-scroll flex-1 overflow-auto space-y-3">
          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">{t('theme')}</h2>
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
                <SelectItem value="personal">{t('themes.personal')}</SelectItem>
                <SelectItem value="organization">{t('themes.organization')}</SelectItem>
                <SelectItem value="promotion">{t('themes.promotion')}</SelectItem>
                <SelectItem value="event">{t('themes.event')}</SelectItem>
                <SelectItem value="education">{t('themes.education')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">{t('tone')}</h2>
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
                <SelectItem value="casual">{t('tones.casual')}</SelectItem>
                <SelectItem value="formal">{t('tones.formal')}</SelectItem>
                <SelectItem value="inspirational">{t('tones.inspirational')}</SelectItem>
                <SelectItem value="professional">{t('tones.professional')}</SelectItem>
                <SelectItem value="friendly">{t('tones.friendly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">{t('length')}</h2>
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
                  {lengthLabels[item]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">{t('writingStyle')}</h2>
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
                <SelectItem value="storytelling">{t('writingStyles.storytelling')}</SelectItem>
                <SelectItem value="informative">{t('writingStyles.informative')}</SelectItem>
                <SelectItem value="persuasive">{t('writingStyles.persuasive')}</SelectItem>
                <SelectItem value="reflective">{t('writingStyles.reflective')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <h2 className="text-sm font-semibold">{t('language')}</h2>
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
                <SelectItem value="english">{t('languages.english')}</SelectItem>
                <SelectItem value="indonesian">{t('languages.indonesian')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t('includeEmotions')}</h2>
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
              <h2 className="text-sm font-semibold">{t('customPrompt')}</h2>
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
                  placeholder={t('customPromptPlaceholder')}
                  value={options.customPrompt || ""}
                  onChange={(e) =>
                    onOptionsChange({ ...options, customPrompt: e.target.value })
                  }
                  rows={3}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {t('customPromptHint')}
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t('includeFooter')}</h2>
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
                    <SelectValue placeholder={t('selectFooter')} />
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
                  {t('manageFooters')}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm font-medium">
              {t('usageLimit', { used: 5 - rateLimit.remaining, limit: 5 })}
            </p>
            {!rateLimit.allowed && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t('resetIn', { time: 'midnight' })}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={onGenerate}
            disabled={!canGenerate}
            data-umami-event={generateEvent}
          >
            {isGenerating ? t('generating') : t('generate')}
          </Button>
        </div>
      </div>

      {showFooterManager && (
        <FooterManager open={showFooterManager} onClose={handleFooterManagerClose} />
      )}
    </aside>
  )
}
