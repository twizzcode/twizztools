import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Caption Generator - Twizz Tools",
  description:
    "Generate engaging social media captions with AI. Customize theme, tone, and style for perfect Instagram captions.",
  openGraph: {
    title: "AI Caption Generator - Twizz Tools",
    description:
      "Generate engaging social media captions with AI. Customize theme, tone, and style for perfect Instagram captions.",
  },
}

export default function CaptionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
