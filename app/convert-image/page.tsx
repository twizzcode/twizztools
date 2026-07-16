"use client"

import * as React from "react"
import Image from "next/image"
import { Delete02Icon, ImageUploadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"] as const
const OUTPUT_FORMATS = ["png", "jpeg", "webp"] as const
const MAX_FILES = 50
const MAX_FILE_SIZE = 20 * 1024 * 1024
const CONVERT_CONCURRENCY = 3

type OutputFormat = (typeof OUTPUT_FORMATS)[number]
type ImageDetails = {
  width: number
  height: number
  size: number
  type: string
}
type ImageItem = ImageDetails & {
  id: string
  file: File
  url: string
}
type ConvertResult = ImageDetails & {
  id: string
  url: string
  name: string
  originalSize: number
  blob: Blob
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${sizes[index]}`
}

function formatType(type: string) {
  return type.replace("image/", "").toUpperCase()
}

function getOutputType(format: OutputFormat) {
  return `image/${format}`
}

function getOutputName(file: File, format: OutputFormat) {
  return `${file.name.replace(/\.[^.]+$/, "") || "converted-image"}.${format === "jpeg" ? "jpg" : format}`
}

function getFileId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function revokeUrls(urls: string[]) {
  for (const url of urls) URL.revokeObjectURL(url)
}

async function readImageItem(file: File): Promise<ImageItem> {
  const bitmap = await createImageBitmap(file)
  const item = {
    id: `${getFileId(file)}-${crypto.randomUUID()}`,
    file,
    url: URL.createObjectURL(file),
    width: bitmap.width,
    height: bitmap.height,
    size: file.size,
    type: file.type,
  }
  bitmap.close()
  return item
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, mapper: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length)
  let index = 0

  async function worker() {
    while (index < items.length) {
      const currentIndex = index
      index += 1
      results[currentIndex] = await mapper(items[currentIndex])
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function convertImage(file: File, format: OutputFormat, quality: number): Promise<ConvertResult> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext("2d")
  if (!context) {
    bitmap.close()
    throw new Error("Canvas tidak didukung")
  }

  context.drawImage(bitmap, 0, 0)
  bitmap.close()

  const type = getOutputType(format)
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, format === "png" ? undefined : quality)
  })

  if (!blob) throw new Error("Gagal convert gambar")

  return {
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
    type,
    id: `${getFileId(file)}-${crypto.randomUUID()}`,
    url: URL.createObjectURL(blob),
    name: getOutputName(file, format),
    originalSize: file.size,
    blob,
  }
}

const crcTable = new Uint32Array(256).map((_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  return value >>> 0
})

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function writeUint16(output: number[], value: number) {
  output.push(value & 0xff, (value >>> 8) & 0xff)
}

function writeUint32(output: number[], value: number) {
  output.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff)
}

function writeBytes(output: number[], bytes: Uint8Array) {
  for (const byte of bytes) output.push(byte)
}

async function createZip(results: ConvertResult[]) {
  const encoder = new TextEncoder()
  const output: number[] = []
  const centralDirectory: number[] = []

  for (const result of results) {
    const bytes = new Uint8Array(await result.blob.arrayBuffer())
    const nameBytes = encoder.encode(result.name)
    const checksum = crc32(bytes)
    const offset = output.length

    writeUint32(output, 0x04034b50)
    writeUint16(output, 20)
    writeUint16(output, 0)
    writeUint16(output, 0)
    writeUint16(output, 0)
    writeUint16(output, 0)
    writeUint32(output, checksum)
    writeUint32(output, bytes.length)
    writeUint32(output, bytes.length)
    writeUint16(output, nameBytes.length)
    writeUint16(output, 0)
    writeBytes(output, nameBytes)
    writeBytes(output, bytes)

    writeUint32(centralDirectory, 0x02014b50)
    writeUint16(centralDirectory, 20)
    writeUint16(centralDirectory, 20)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint32(centralDirectory, checksum)
    writeUint32(centralDirectory, bytes.length)
    writeUint32(centralDirectory, bytes.length)
    writeUint16(centralDirectory, nameBytes.length)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint16(centralDirectory, 0)
    writeUint32(centralDirectory, 0)
    writeUint32(centralDirectory, offset)
    writeBytes(centralDirectory, nameBytes)
  }

  const centralDirectoryOffset = output.length
  writeBytes(output, new Uint8Array(centralDirectory))
  writeUint32(output, 0x06054b50)
  writeUint16(output, 0)
  writeUint16(output, 0)
  writeUint16(output, results.length)
  writeUint16(output, results.length)
  writeUint32(output, centralDirectory.length)
  writeUint32(output, centralDirectoryOffset)
  writeUint16(output, 0)

  return new Blob([new Uint8Array(output)], { type: "application/zip" })
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium">{value}</span>
    </div>
  )
}

function FormatToggle({ value, onChange }: { value: OutputFormat; onChange: (value: OutputFormat) => void }) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(nextValue) => {
        const selected = nextValue[0]
        if (selected) onChange(selected as OutputFormat)
      }}
      className="grid w-full grid-cols-3"
      variant="outline"
      spacing={0}
    >
      {OUTPUT_FORMATS.map((format) => (
        <ToggleGroupItem key={format} value={format} className="w-full uppercase">
          {format === "jpeg" ? "jpg" : format}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default function ConvertImagePage() {
  const [files, setFiles] = React.useState<File[]>([])
  const [items, setItems] = React.useState<ImageItem[]>([])
  const [format, setFormat] = React.useState<OutputFormat>("webp")
  const [compress, setCompress] = React.useState(true)
  const [quality, setQuality] = React.useState(0.8)
  const [results, setResults] = React.useState<ConvertResult[]>([])
  const [isReading, setIsReading] = React.useState(false)
  const [isConverting, setIsConverting] = React.useState(false)
  const [isZipping, setIsZipping] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const itemsRef = React.useRef<ImageItem[]>([])
  const resultsRef = React.useRef<ConvertResult[]>([])
  const pendingFileIdsRef = React.useRef(new Set<string>())
  const canUseQuality = format !== "png" && compress

  React.useEffect(() => {
    itemsRef.current = items
  }, [items])

  React.useEffect(() => {
    resultsRef.current = results
  }, [results])

  React.useEffect(() => {
    return () => {
      revokeUrls(itemsRef.current.map((item) => item.url))
      revokeUrls(resultsRef.current.map((result) => result.url))
    }
  }, [])

  const resetResults = React.useCallback(() => {
    setResults((current) => {
      revokeUrls(current.map((result) => result.url))
      return []
    })
  }, [])

  const resetAll = React.useCallback(() => {
    pendingFileIdsRef.current.clear()
    setFiles([])
    setError(null)
    setItems((current) => {
      revokeUrls(current.map((item) => item.url))
      return []
    })
    resetResults()
  }, [resetResults])

  const onFilesChange = React.useCallback(async (nextFiles: File[]) => {
    setError(null)
    resetResults()

    if (nextFiles.length === 0) {
      resetAll()
      return
    }

    const existingIds = new Set(itemsRef.current.map((item) => getFileId(item.file)))
    const incomingIds = new Set<string>()
    const nextUniqueFiles = nextFiles.filter((file) => {
      const id = getFileId(file)
      if (existingIds.has(id) || pendingFileIdsRef.current.has(id) || incomingIds.has(id)) return false
      incomingIds.add(id)
      return true
    })
    const validFiles = nextUniqueFiles.filter((file) => ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number]) && file.size <= MAX_FILE_SIZE)
    const nextLimit = Math.max(0, MAX_FILES - itemsRef.current.length - pendingFileIdsRef.current.size)
    const acceptedFiles = validFiles.slice(0, nextLimit)
    const acceptedIds = acceptedFiles.map(getFileId)
    const messages: string[] = []

    if (validFiles.length !== nextUniqueFiles.length) messages.push(`Sebagian file dilewati. Format didukung PNG/JPG/WEBP dan maksimal ${formatBytes(MAX_FILE_SIZE)}.`)
    if (validFiles.length > acceptedFiles.length) messages.push(`Maksimal ${MAX_FILES} file.`)
    if (messages.length > 0) setError(messages.join(" "))
    if (acceptedFiles.length === 0) return

    for (const id of acceptedIds) pendingFileIdsRef.current.add(id)
    setIsReading(true)
    try {
      const nextItems = await Promise.all(acceptedFiles.map(readImageItem))
      setItems((current) => [...current, ...nextItems])
      setFiles((current) => [...current, ...acceptedFiles])
    } catch {
      setError("Gagal membaca detail gambar")
    } finally {
      for (const id of acceptedIds) pendingFileIdsRef.current.delete(id)
      setIsReading(false)
    }
  }, [resetAll, resetResults])

  const removeFile = React.useCallback((index: number) => {
    setError(null)
    resetResults()
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))
    setItems((current) => {
      const removed = current[index]
      if (removed) revokeUrls([removed.url])
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }, [resetResults])

  const handleConvert = React.useCallback(async () => {
    if (files.length === 0) return

    setIsConverting(true)
    setError(null)
    resetResults()

    try {
      const nextResults = await mapWithConcurrency(files, CONVERT_CONCURRENCY, (file) => convertImage(file, format, canUseQuality ? quality : 0.92))
      setResults(nextResults)
    } catch {
      setError("Gagal convert gambar")
    } finally {
      setIsConverting(false)
    }
  }, [canUseQuality, files, format, quality, resetResults])

  const downloadAll = React.useCallback(() => {
    for (const result of results) {
      const link = document.createElement("a")
      link.href = result.url
      link.download = result.name
      link.click()
    }
  }, [results])

  const downloadZip = React.useCallback(async () => {
    if (results.length === 0) return

    setIsZipping(true)
    setError(null)

    try {
      const zip = await createZip(results)
      const url = URL.createObjectURL(zip)
      const link = document.createElement("a")
      link.href = url
      link.download = "converted-images.zip"
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setError("Gagal membuat ZIP")
    } finally {
      setIsZipping(false)
    }
  }, [results])

  return (
    <div className="container mx-auto flex h-full flex-1 flex-col min-h-0 pt-4 pb-8 lg:py-0">
      <div className="relative flex flex-1 flex-col gap-4 px-4 pb-4 lg:min-h-0 lg:flex-row lg:items-stretch lg:py-4">
        <section className="flex min-h-[420px] min-w-0 flex-1 flex-col gap-4 rounded-lg border bg-card p-4 lg:min-h-0">
          {results.length === 0 ? (
            <>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Convert Image</h1>
                <p className="mt-1 text-sm text-muted-foreground">Upload banyak gambar PNG, JPG, JPEG, atau WEBP</p>
                <p className="mt-1 text-xs text-muted-foreground">Maksimal {MAX_FILES} file, {formatBytes(MAX_FILE_SIZE)} per file.</p>
              </div>

              <FileUpload value={files} onValueChange={onFilesChange} accept="image/png,image/jpeg,image/webp" maxFiles={MAX_FILES} maxSize={MAX_FILE_SIZE} multiple label="Image upload" className="flex min-h-0 flex-1 flex-col gap-4">
                {items.length === 0 ? (
                  <FileUploadDropzone className="flex min-h-60 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed bg-background/60 px-6 py-8">
                    <HugeiconsIcon icon={ImageUploadIcon} strokeWidth={1.75} className="mb-4 size-10 text-muted-foreground" />
                    <p className="text-sm font-semibold">Drop image di sini</p>
                    <p className="text-xs text-muted-foreground">atau klik buat pilih banyak file</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">PNG, JPG, WEBP · max {formatBytes(MAX_FILE_SIZE)} / file</p>
                  </FileUploadDropzone>
                ) : (
                  <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto lg:grid-cols-3">
                    {items.map((item, index) => (
                      <div key={item.id} className="relative overflow-hidden rounded-lg border bg-background">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-xs"
                          className="absolute top-2 right-2 z-10 border border-border bg-background text-destructive shadow-md hover:bg-background"
                          onClick={() => removeFile(index)}
                          aria-label={`Hapus ${item.file.name}`}
                        >
                          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                        </Button>
                        <div className="relative aspect-square">
                          <Image src={item.url} alt={item.file.name} fill unoptimized className="object-cover" />
                        </div>
                        <div className="grid gap-1 p-2">
                          <p className="truncate text-xs font-medium">{item.file.name}</p>
                          <DetailRow label="Pixel" value={`${item.width} × ${item.height}`} />
                          <DetailRow label="Size" value={formatBytes(item.size)} />
                          <DetailRow label="Format" value={formatType(item.type)} />
                        </div>
                      </div>
                    ))}
                    <FileUploadDropzone className="flex min-h-full flex-col items-center justify-center rounded-lg border border-dashed bg-background/60 p-3 text-center">
                      <div className="flex aspect-square w-full flex-col items-center justify-center">
                        <HugeiconsIcon icon={ImageUploadIcon} strokeWidth={1.75} className="mb-2 size-7 text-muted-foreground" />
                        <p className="text-xs font-semibold">Tambah image</p>
                        <p className="text-[11px] text-muted-foreground">{items.length}/{MAX_FILES} file</p>
                      </div>
                    </FileUploadDropzone>
                  </div>
                )}
              </FileUpload>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Result</h1>
                <p className="mt-1 text-sm text-muted-foreground">Preview dan download hasil convert</p>
              </div>

              <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto lg:grid-cols-3">
                {results.map((result) => (
                  <div key={result.id} className="overflow-hidden rounded-lg border bg-background">
                    <div className="relative aspect-square">
                      <Image src={result.url} alt={result.name} fill unoptimized className="object-cover" />
                    </div>
                    <div className="grid gap-1 p-2">
                      <p className="truncate text-xs font-medium">{result.name}</p>
                      <DetailRow label="Pixel" value={`${result.width} × ${result.height}`} />
                      <DetailRow label="Size" value={formatBytes(result.size)} />
                      <DetailRow label="Format" value={formatType(result.type)} />
                      <DetailRow label="Selisih" value={`${result.size <= result.originalSize ? "-" : "+"}${formatBytes(Math.abs(result.originalSize - result.size))}`} />
                      <Button
                        size="sm"
                        className="mt-1"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = result.url
                          link.download = result.name
                          link.click()
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="flex h-fit flex-col rounded-lg border bg-card p-4 lg:sticky lg:top-4 lg:h-full lg:w-[320px] lg:flex-none">
          <div className="flex-1 space-y-4">
            <div className="grid gap-2">
              <h2 className="text-sm font-semibold">Output format</h2>
              <FormatToggle value={format} onChange={setFormat} />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
              <div>
                <h2 className="text-sm font-semibold">Compress</h2>
                <p className="text-xs text-muted-foreground">Untuk JPG dan WEBP</p>
              </div>
              <Switch checked={compress} onCheckedChange={setCompress} disabled={format === "png"} aria-label="Toggle compression" />
            </div>

            <div className={canUseQuality ? "grid gap-2" : "pointer-events-none opacity-50 grid gap-2"}>
              <label className="flex items-center justify-between text-sm font-semibold">
                <span>Quality</span>
                <span className="tabular-nums text-xs font-normal text-muted-foreground">{Math.round(quality * 100)}%</span>
              </label>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} disabled={!canUseQuality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full" />
            </div>

            {isReading && <p className="text-xs text-muted-foreground">Membaca file...</p>}
            {error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          </div>

          <div className="mt-4 grid gap-3">
            {results.length > 0 ? (
              <div className="flex gap-2">
                <Button className="flex-1" onClick={downloadAll}>
                  Download semua
                </Button>
                <Button className="flex-1" variant="outline" onClick={downloadZip} disabled={isZipping}>
                  {isZipping ? "Zipping..." : "Download ZIP"}
                </Button>
              </div>
            ) : (
              <Button onClick={handleConvert} disabled={files.length === 0 || isReading || isConverting} data-umami-event="image_convert">
                {isConverting ? "Converting..." : "Convert semua"}
              </Button>
            )}
            {results.length > 0 && (
              <Button variant="outline" onClick={resetResults}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={resetAll} disabled={files.length === 0 && !error}>
              Reset
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
