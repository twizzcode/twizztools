"use client"

import { ImageUploadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload"
import { ReelsPreview, type ReelsMode } from "./reels-preview"

type ReelsWorkspaceProps = {
  image?: string
  onChangeImage: (dataUrl: string) => void
  mode: ReelsMode
  customColor: string
  contentBlur: number
}

export function ReelsWorkspace({ image, onChangeImage, mode, customColor, contentBlur }: ReelsWorkspaceProps) {
  const t = useTranslations('reels');
  
  const handleFilesChange = (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) onChangeImage(reader.result as string)
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
        className={image ? "flex min-h-0 flex-1 flex-col gap-4 lg:h-full lg:min-h-0" : "flex h-full flex-1 flex-col gap-4"}
      >
        {!image && (
          <div className="flex h-full items-center justify-center flex-col gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>
            </div>
            <FileUploadDropzone className="min-h-25 w-full max-w-sm rounded-2xl bg-background/60 px-6 py-10 lg:min-h-30 lg:flex-none">
              <HugeiconsIcon icon={ImageUploadIcon} strokeWidth={1.75} className="mb-4 size-10 text-muted-foreground" />
              <p className="text-sm font-semibold">{t('dropImage')}</p>
              <p className="text-xs text-muted-foreground">{t('orClick')}</p>
            </FileUploadDropzone>
          </div>
        )}

        {image && <ReelsPreview image={image} mode={mode} customColor={customColor} contentBlur={contentBlur} />}
      </FileUpload>
    </div>
  )
}
