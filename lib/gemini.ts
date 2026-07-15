import { GoogleGenerativeAI } from "@google/generative-ai"

let currentKeyIndex = 0

function getApiKeys(): string[] {
  const keys = process.env.GEMINI_API_KEYS?.split(",") || []
  return keys.map((key) => key.trim()).filter((key) => key.length > 0)
}

function getNextApiKey(): string {
  const keys = getApiKeys()
  if (keys.length === 0) {
    throw new Error("No Gemini API keys configured")
  }

  const key = keys[currentKeyIndex]
  currentKeyIndex = (currentKeyIndex + 1) % keys.length
  return key
}

export async function generateCaptions(
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string[]> {
  const keys = getApiKeys()
  const maxRetries = keys.length

  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const apiKey = getNextApiKey()
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" })

      const base64Data = imageBase64.split(",")[1] || imageBase64

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ])

      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini")
      }

      const captions = JSON.parse(jsonMatch[0])

      if (!Array.isArray(captions) || captions.length !== 3) {
        throw new Error("Expected exactly 3 captions from Gemini")
      }

      return captions
    } catch (error) {
      lastError = error as Error
      console.error(`Attempt ${attempt + 1} failed:`, error)
      continue
    }
  }

  throw new Error(
    `All ${maxRetries} API keys exhausted. Last error: ${lastError?.message || "Unknown error"}`
  )
}
