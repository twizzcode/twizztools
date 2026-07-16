import { db } from "@/db"
import { footers } from "@/db/schema"
import { buildCaptionPrompt, type CaptionOptions } from "@/lib/caption-prompt"
import { generateCaptions } from "@/lib/gemini"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

const MAX_IMAGE_SIZE = 20 * 1024 * 1024

function validateImageDataUrl(dataUrl: string): {
  valid: boolean
  mimeType?: string
  sizeBytes?: number
  error?: string
} {
  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches) {
      return { valid: false, error: "Invalid data URL format" }
    }

    const mimeType = matches[1]
    const base64Data = matches[2]

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(mimeType)) {
      return { valid: false, error: "Unsupported image format" }
    }

    const sizeBytes = (base64Data.length * 3) / 4
    if (sizeBytes > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: `Image size exceeds 20MB limit (${Math.round(sizeBytes / 1024 / 1024)}MB)`,
      }
    }

    return { valid: true, mimeType, sizeBytes }
  } catch {
    return { valid: false, error: "Failed to validate image" }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, options } = body as {
      image: string
      options: CaptionOptions & { footerCode?: string }
    }

    if (!image || !options) {
      return NextResponse.json(
        { error: "Image and options are required" },
        { status: 400 }
      )
    }

    const validation = validateImageDataUrl(image)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    let footerContent: string | undefined

    if (options.footerCode) {
      const [footer] = await db
        .select()
        .from(footers)
        .where(eq(footers.code, options.footerCode))
        .limit(1)

      if (footer) {
        footerContent = footer.content
      }
    }

    const prompt = buildCaptionPrompt(options, footerContent)

    const captions = await generateCaptions(
      image,
      validation.mimeType!,
      prompt
    )

    return NextResponse.json({ captions })
  } catch (_error) {
    console.error("Error generating captions:", _error)

    const errorMessage =
      _error instanceof Error ? _error.message : "Unknown error"

    if (errorMessage.includes("API keys exhausted")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. All API keys exhausted. Please try again later." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate captions" },
      { status: 500 }
    )
  }
}
