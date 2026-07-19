"use client"

import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { type GapOption, GRID_GAP_OPTIONS, type CutMode, CUT_MODES, clampCount, type Phase } from "./live-preview"

function Segmented<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  labels?: Record<T, string>
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
    >
      {options.map((item) => (
        <ToggleGroupItem key={item} value={item} className="w-full">
          {labels?.[item] || item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function Counter({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid gap-1 text-sm">
      <h2 className="text-sm font-semibold">{label}</h2>
      <div className="grid h-10 grid-cols-[40px_1fr_40px] overflow-hidden rounded-md border bg-background">
        <Button variant="outline" size="icon-sm" className="h-10 w-10 rounded-none border-0 border-r shadow-none" onClick={() => onChange(clampCount(value - 1))}>
          <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} className="size-4" />
        </Button>
        <div className="flex items-center justify-center text-sm font-medium">{value}</div>
        <Button variant="outline" size="icon-sm" className="h-10 w-10 rounded-none border-0 border-l shadow-none" onClick={() => onChange(clampCount(value + 1))}>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
        </Button>
      </div>
    </div>
  )
}

type SettingsPanelProps = {
  phase: Phase
  mode: CutMode
  gap: GapOption
  rows: number
  cols: number
  imageFile: File | null
  isCropping: boolean
  resultUrls: string[]
  onModeChange: (value: CutMode) => void
  onGapChange: (value: GapOption) => void
  onRowsChange: (value: number) => void
  onColsChange: (value: number) => void
  onCrop: () => void
  cropEvent?: string
  onReset: () => void
  onBackToCrop: () => void
}

export function SettingsPanel({
  phase,
  mode,
  gap,
  rows,
  cols,
  imageFile,
  isCropping,
  resultUrls,
  onModeChange,
  onGapChange,
  onRowsChange,
  onColsChange,
  onCrop,
  cropEvent,
  onReset,
  onBackToCrop,
}: SettingsPanelProps) {
  const t = useTranslations('cutter');
  
  const modeLabels: Record<CutMode, string> = {
    Grid: t('modes.grid'),
    Carousel: t('modes.carousel'),
    Custom: t('modes.custom'),
  };
  
  const gapLabels: Record<GapOption, string> = {
    'With-Gap': t('gapTypes.withGap'),
    'Without-Gap': t('gapTypes.noGap'),
  };

  return (
    <aside className="flex h-fit flex-col bg-transparent lg:sticky lg:top-0 lg:h-full lg:min-h-0">
      {phase !== "result" && (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:h-full">
          <div className="flex-1 space-y-3">
            <div className="grid gap-2">
              <h2 className="text-sm font-semibold">{t('typeOfCut')}</h2>
              <Segmented options={CUT_MODES} value={mode} onChange={onModeChange} labels={modeLabels} />
            </div>

            <div className="grid gap-3 grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {mode !== "Carousel" && (
                <Counter label={t('rows')} value={rows} onChange={onRowsChange} />
              )}

              {mode !== "Grid" && (
                <Counter label={t('columns')} value={cols} onChange={onColsChange} />
              )}
            </div>

            <div className={mode === "Grid" ? "grid gap-2" : "pointer-events-none invisible grid gap-2"}>
              <h2 className="text-sm font-semibold">{t('typeOfGrid')}</h2>
              <Segmented options={GRID_GAP_OPTIONS} value={gap} onChange={onGapChange} labels={gapLabels} />
              <p className="text-xs text-muted-foreground">
                {t('recommendation')}: {gap === "With-Gap" ? `3130 × ${1350 * rows}` : `3110 × ${1350 * rows}`} px
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <Button onClick={onCrop} disabled={!imageFile || isCropping} data-umami-event={cropEvent} data-umami-event-mode={mode}>
              {isCropping ? t('cropping') : t('crop')}
            </Button>
            <Button variant="outline" onClick={onReset} disabled={!imageFile}>
              {t('reset')}
            </Button>
          </div>
        </div>
      )}

      {phase === "result" && resultUrls.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:h-full">
          <div className="flex-1"></div>
          <div className="grid gap-3">
            <Button
              variant="default"
              onClick={() => {
                resultUrls.forEach((url, index) => {
                  const link = document.createElement("a")
                  link.href = url
                  link.download = `crop-result-${index + 1}.png`
                  link.click()
                })
              }}
            >
              {t('downloadAll')}
            </Button>
            <Button variant="outline" onClick={onBackToCrop}>
              {t('backToCrop')}
            </Button>
            <Button variant="outline" onClick={onReset}>
              {t('reset')}
            </Button>
          </div>
        </div>
      )}
    </aside>
  )
}
