"use client"

import { ImageUploadIcon, RulerIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload"
import { Link } from "@/i18n/navigation"
import { LivePreview, type CutMode, type GapOption, type Phase } from "./live-preview"

type WorkspaceProps = {
  files: File[]
  imageFile: File | null
  phase: Phase
  mode: CutMode
  gap: GapOption
  rows: number
  cols: number
  resultUrls: string[]
  onFilesChange: (files: File[]) => void
}

export function Workspace({
  files,
  imageFile,
  phase,
  mode,
  gap,
  rows,
  cols,
  resultUrls,
  onFilesChange,
}: WorkspaceProps) {
  const t = useTranslations('cutter');
  
  return (
    <div className="flex h-full flex-col lg:min-h-0">
      <FileUpload
        value={files}
        onValueChange={onFilesChange}
        accept="image/*"
        maxFiles={1}
        label="Image upload"
        className={phase !== "upload" ? "flex min-h-0 flex-1 flex-col gap-4 lg:h-full lg:min-h-0" : "flex h-full flex-1 flex-col gap-4"}
      >
        {phase === "upload" && (
          <div className="flex h-full items-center justify-center flex-col gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-3">
              <FileUploadDropzone className="min-h-25 w-full rounded-2xl bg-background/60 px-6 py-10 lg:min-h-30 lg:flex-none">
                <HugeiconsIcon icon={ImageUploadIcon} strokeWidth={1.75} className="mb-4 size-10 text-muted-foreground" />
                <p className="text-sm font-semibold">{t('dropImage')}</p>
                <p className="text-xs text-muted-foreground">{t('orClick')}</p>
              </FileUploadDropzone>
              <Button nativeButton={false} variant="outline" render={<Link href="/guide" />}>
                <HugeiconsIcon icon={RulerIcon} strokeWidth={2} className="size-4" />
                {t('sizeGuide')}
              </Button>
            </div>
          </div>
        )}

        {imageFile && phase !== "result" && (
          <LivePreview file={imageFile} mode={mode} gap={gap} rows={rows} cols={cols} />
        )}

        {phase === "result" && resultUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 overflow-y-auto">
            {resultUrls.map((url, index) => (
              <div key={url} className="relative">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={url}
                    alt={`Crop result ${index + 1}`}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `crop-result-${index + 1}.png`
                    link.click()
                  }}
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background border rounded-lg p-2"
                  aria-label={t('downloadResult', { number: index + 1 })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </FileUpload>
    </div>
  )
}
