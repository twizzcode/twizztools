"use client"

import { ImageUploadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload"
import { CaptionsResults } from "./captions-results"

type CaptionsWorkspaceProps = {
  image?: string
  onImageChange: (image: string | undefined) => void
  isGenerating: boolean
  error?: string
  captions?: string[]
  onGenerateAgain?: () => void
  canGenerateAgain?: boolean
}

export function CaptionsWorkspace({
  image,
  onImageChange,
  isGenerating,
  error,
  captions,
  onGenerateAgain,
  canGenerateAgain,
}: CaptionsWorkspaceProps) {
  const t = useTranslations('captions');
  
  const handleFilesChange = (files: File[]) => {
    if (files.length === 0) {
      onImageChange(undefined)
      return
    }

    const file = files[0]

    if (file.size > 20 * 1024 * 1024) {
      alert("Image size must be less than 20MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) onImageChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex h-full flex-col lg:min-h-0">
      <FileUpload
        value={[]}
        onValueChange={handleFilesChange}
        accept="image/*"
        maxFiles={1}
        label="Image upload"
        className={
          image
            ? "flex min-h-0 flex-1 flex-col gap-4 lg:h-full lg:min-h-0"
            : "flex h-full flex-1 flex-col gap-4"
        }
      >
        {!image && (
          <div className="flex h-full items-center justify-center flex-col gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t('title')}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
            <FileUploadDropzone className="min-h-25 w-full max-w-sm rounded-2xl bg-background/60 px-6 py-10 lg:min-h-30 lg:flex-none">
              <HugeiconsIcon
                icon={ImageUploadIcon}
                strokeWidth={1.75}
                className="mb-4 size-10 text-muted-foreground"
              />
              <p className="text-sm font-semibold">{t('dropImage')}</p>
              <p className="text-xs text-muted-foreground">
                {t('orClick')}
              </p>
            </FileUploadDropzone>
          </div>
        )}

        {image && (
          <div className={`caption-scroll relative flex h-full min-h-0 flex-col gap-4 ${captions && captions.length > 0 ? 'overflow-auto' : ''}`}>
            <div className={`relative flex items-center justify-center ${captions && captions.length > 0 ? 'flex-shrink-0 max-h-[50vh]' : 'flex-1 max-h-full'}`}>
              {isGenerating && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center">
                    <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm font-medium">{t('generating')}</p>
                  </div>
                </div>
              )}
              <img
                src={image}
                alt="Upload preview"
                className="h-full w-auto max-w-full rounded-lg object-contain"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive flex-shrink-0">
                {error}
              </div>
            )}

            {captions && captions.length > 0 && onGenerateAgain && (
              <CaptionsResults
                captions={captions}
                onGenerateAgain={onGenerateAgain}
                canGenerateAgain={canGenerateAgain || false}
              />
            )}
          </div>
        )}
      </FileUpload>
    </div>
  )
}
