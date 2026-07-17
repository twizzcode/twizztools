"use client"

import * as React from "react"
import { SettingsPanel } from "@/components/home/settings-panel"
import { Workspace } from "@/components/home/workspace"
import { GRID_CONST, type CutMode, type GapOption, type Phase } from "@/components/home/live-preview"

export const iframeHeight = "980px"

export const description = "Playground overview page."

function revokeUrls(urls: string[]) {
  for (const url of urls) {
    URL.revokeObjectURL(url)
  }
}

async function canvasToObjectUrl(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((value) => resolve(value), "image/png")
  })

  return blob ? URL.createObjectURL(blob) : null
}

async function loadImage(file: File) {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = new window.Image()
    image.src = objectUrl

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error("Gagal memuat gambar"))
    })

    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export default function Page() {
  const [phase, setPhase] = React.useState<Phase>("upload")
  const [files, setFiles] = React.useState<File[]>([])
  const [mode, setMode] = React.useState<CutMode>("Grid")
  const [gap, setGap] = React.useState<GapOption>("With-Gap")
  const [rows, setRows] = React.useState(1)
  const [cols, setCols] = React.useState(1)
  const [resultUrls, setResultUrls] = React.useState<string[]>([])
  const [isCropping, setIsCropping] = React.useState(false)
  const imageFile = files[0] ?? null

  React.useEffect(() => {
    return () => revokeUrls(resultUrls)
  }, [resultUrls])

  const resetAll = React.useCallback(() => {
    setPhase("upload")
    setFiles([])
    setMode("Grid")
    setGap("With-Gap")
    setRows(1)
    setCols(1)
    setResultUrls((currentUrls) => {
      revokeUrls(currentUrls)
      return []
    })
  }, [])

  const onFilesChange = React.useCallback(
    async (nextFiles: File[]) => {
      if (nextFiles.length === 0) {
        resetAll()
        return
      }

      setFiles(nextFiles)
      setResultUrls((currentUrls) => {
        revokeUrls(currentUrls)
        return []
      })
      setPhase("crop")
    },
    [resetAll],
  )

  const onModeChange = React.useCallback((nextMode: CutMode) => {
    setMode(nextMode)
    if (nextMode === "Grid") {
      setCols(1)
    }
    if (nextMode === "Carousel") {
      setRows(1)
    }
  }, [])

  const handleCrop = React.useCallback(async () => {
    if (!imageFile) return

    const nextUrls: string[] = []
    setIsCropping(true)

    try {
      const image = await loadImage(imageFile)
      const imageWidth = image.width
      const imageHeight = image.height

      const pushCanvas = async (
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        outputWidth: number,
        outputHeight: number,
      ) => {
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(outputWidth))
        canvas.height = Math.max(1, Math.round(outputHeight))
        const context = canvas.getContext("2d")
        if (!context) return

        context.drawImage(
          image,
          sx,
          sy,
          sw,
          sh,
          0,
          0,
          canvas.width,
          canvas.height,
        )

        const url = await canvasToObjectUrl(canvas)
        if (url) {
          nextUrls.push(url)
        }
      }

      if (mode === "Grid") {
        const config = GRID_CONST[gap]
        const outputHeight = GRID_CONST.outputSliceHeight
        let effectiveWidth = imageWidth
        let rowHeight = effectiveWidth * config.aspect

        if (rowHeight * rows > imageHeight) {
          effectiveWidth = (imageHeight / rows) / config.aspect
          rowHeight = effectiveWidth * config.aspect
        }

        const startX = effectiveWidth < imageWidth ? (imageWidth - effectiveWidth) / 2 : 0
        const totalHeight = rowHeight * rows
        const startY = totalHeight < imageHeight ? (imageHeight - totalHeight) / 2 : 0

        for (let row = 0; row < rows; row++) {
          const rowCanvas = document.createElement("canvas")
          rowCanvas.width = config.compositeWidth
          rowCanvas.height = outputHeight
          const rowContext = rowCanvas.getContext("2d")
          if (!rowContext) continue

          rowContext.drawImage(
            image,
            startX,
            startY + row * rowHeight,
            effectiveWidth,
            rowHeight,
            0,
            0,
            config.compositeWidth,
            outputHeight,
          )

          for (let index = 0; index < config.sliceOffsets.length; index++) {
            const sliceCanvas = document.createElement("canvas")
            sliceCanvas.width = GRID_CONST.outputSliceWidth
            sliceCanvas.height = outputHeight
            const sliceContext = sliceCanvas.getContext("2d")
            if (!sliceContext) continue

            sliceContext.drawImage(
              rowCanvas,
              config.sliceOffsets[index],
              0,
              GRID_CONST.outputSliceWidth,
              outputHeight,
              0,
              0,
              GRID_CONST.outputSliceWidth,
              outputHeight,
            )

            const url = await canvasToObjectUrl(sliceCanvas)
            if (url) {
              nextUrls.push(url)
            }
          }
        }
      } else if (mode === "Carousel") {
        const aspectCarousel = 4 / 5
        let cellWidth = imageWidth / cols
        let cellHeight = cellWidth / aspectCarousel

        if (cellHeight > imageHeight) {
          cellHeight = imageHeight
          cellWidth = cellHeight * aspectCarousel
        }

        const startX = (imageWidth - cellWidth * cols) / 2
        const startY = (imageHeight - cellHeight) / 2

        for (let col = 0; col < cols; col++) {
          await pushCanvas(startX + col * cellWidth, startY, cellWidth, cellHeight, 1080, 1350)
        }
      } else {
        const cellWidth = imageWidth / cols
        const cellHeight = imageHeight / rows

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            await pushCanvas(
              col * cellWidth,
              row * cellHeight,
              cellWidth,
              cellHeight,
              cellWidth,
              cellHeight,
            )
          }
        }
      }

      setResultUrls((currentUrls) => {
        revokeUrls(currentUrls)
        return nextUrls
      })
      setPhase("result")
    } catch (error) {
      revokeUrls(nextUrls)
      throw error
    } finally {
      setIsCropping(false)
    }
  }, [cols, gap, imageFile, mode, rows])

  return (
    <div className="container mx-auto flex h-full flex-1 flex-col min-h-0 py-4 lg:py-0">
      <div className="relative flex flex-1 flex-col gap-4 lg:min-h-0 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1 pr-4 lg:pr-0 pl-4 lg:min-h-0 lg:py-4 flex flex-col">
          <Workspace
            files={files}
            imageFile={imageFile}
            phase={phase}
            mode={mode}
            gap={gap}
            rows={rows}
            cols={cols}
            resultUrls={resultUrls}
            onFilesChange={onFilesChange}
          />
        </div>

        {phase !== "upload" && (
          <div className="w-full px-4 pb-4 lg:w-[320px] lg:flex-none lg:min-h-0 lg:py-4 lg:pl-0 lg:pr-4">
            <SettingsPanel
              phase={phase}
              mode={mode}
              gap={gap}
              rows={rows}
              cols={cols}
              imageFile={imageFile}
              isCropping={isCropping}
              resultUrls={resultUrls}

            onModeChange={onModeChange}
            onGapChange={setGap}
            onRowsChange={setRows}
            onColsChange={setCols}
            onCrop={handleCrop}
            cropEvent="cutter_crop"
            onReset={resetAll}
            onBackToCrop={() => setPhase("crop")}
          />
          </div>
        )}
      </div>
    </div>
  )
}
