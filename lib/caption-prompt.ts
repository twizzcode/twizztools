export type CaptionOptions = {
  theme: "personal" | "organization" | "promotion" | "event" | "education"
  tone: "casual" | "formal" | "inspirational" | "professional" | "friendly"
  length: "short" | "medium" | "long"
  writingStyle: "storytelling" | "informative" | "persuasive" | "reflective"
  includeEmotions: boolean
  language: "english" | "indonesian"
  customPrompt?: string
}

const lengthGuide = {
  short: "100-150 characters for the caption body",
  medium: "150-250 characters for the caption body",
  long: "250-450 characters for the caption body, split into 2 paragraphs",
}

const themeContext = {
  personal: "personal life, daily moments, self-expression",
  organization: "organizational updates, team activities, company culture",
  promotion: "product/service promotion, marketing, sales",
  event: "events, gatherings, announcements",
  education: "educational content, learning, knowledge sharing",
}

const toneGuide = {
  casual: "relaxed, conversational, friendly",
  formal: "professional, polished, business-appropriate",
  inspirational: "motivating, uplifting, encouraging",
  professional: "expert, credible, authoritative",
  friendly: "warm, approachable, personable",
}

const styleGuide = {
  storytelling: "narrative approach, engaging story arc",
  informative: "fact-based, clear information delivery",
  persuasive: "compelling, call-to-action focused",
  reflective: "thoughtful, introspective, contemplative",
}

export function buildCaptionPrompt(
  options: CaptionOptions,
  footer?: string
): string {
  const emotionInstruction = options.includeEmotions
    ? "Include relevant emojis naturally throughout the caption to enhance emotional expression."
    : "Use neutral tone without emojis or overly expressive language."

  const lengthStructure = options.length === "long"
    ? "The caption body must be split into 2 distinct paragraphs separated by a line break."
    : "The caption body should be a single paragraph."

  const footerInstruction = footer
    ? `\n\nAfter the caption body, add two line breaks and then append this footer:\n${footer}`
    : ""

  const languageInstruction =
    options.language === "indonesian"
      ? "Write the captions in Bahasa Indonesia."
      : "Write the captions in English."

  const customPromptInstruction = options.customPrompt
    ? `\n\nADDITIONAL INSTRUCTIONS:\n${options.customPrompt}\nMake sure to incorporate these additional instructions into the caption generation.`
    : ""

  return `You are an expert social media caption writer specializing in creating engaging, platform-optimized content.

CONTEXT:
- Theme: ${options.theme} (${themeContext[options.theme]})
- Tone: ${options.tone} (${toneGuide[options.tone]})
- Length: ${options.length} (${lengthGuide[options.length]})
- Writing Style: ${options.writingStyle} (${styleGuide[options.writingStyle]})
- Emotions: ${emotionInstruction}
- Language: ${languageInstruction}${customPromptInstruction}

TASK:
Analyze the provided image carefully and generate exactly 3 unique, high-quality captions.

CAPTION STRUCTURE:
Each caption MUST follow this exact structure:

1. **Title** (5-10 words, catchy and attention-grabbing)
2. **Caption Body** (${lengthGuide[options.length]})
   - ${lengthStructure}
   - Must accurately reflect the visual content and context of the image
   - Match the specified theme (${options.theme}) and tone (${options.tone})
   - Follow the ${options.writingStyle} writing style approach
   - ${emotionInstruction}
   - Written in ${options.language === "indonesian" ? "Bahasa Indonesia" : "English"}
3. **Footer** (if provided)${footerInstruction}

FORMAT REQUIREMENTS:
- Title should be on its own line (no extra formatting, just the text)
- Add ONE line break after the title
- Caption body follows${options.length === "long" ? " (2 paragraphs separated by ONE line break)" : ""}
- If footer is provided, add TWO line breaks before the footer
- Each of the 3 captions should offer a different perspective or angle

OUTPUT FORMAT:
Return ONLY a valid JSON array containing exactly 3 caption strings. Do not include any other text, explanation, markdown formatting, or code blocks.

Example format for SHORT/MEDIUM:
["Title Here\nCaption body text goes here...${footer ? "\n\nFooter text" : ""}", "Another Title\nAnother caption body...${footer ? "\n\nFooter text" : ""}", "Third Title\nThird caption body...${footer ? "\n\nFooter text" : ""}"]

Example format for LONG:
["Title Here\nFirst paragraph of the caption body text goes here with more details and context.\n\nSecond paragraph continues the story or adds more information to make it comprehensive.${footer ? "\n\nFooter text" : ""}", "Another Title\nFirst paragraph for second caption...\n\nSecond paragraph for second caption...${footer ? "\n\nFooter text" : ""}", "Third Title\nFirst paragraph for third caption...\n\nSecond paragraph for third caption...${footer ? "\n\nFooter text" : ""}"]

Generate the captions now:`
}
