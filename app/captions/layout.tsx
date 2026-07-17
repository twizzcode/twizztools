import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

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

export default async function CaptionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={{ captions: messages.captions }}>
      {children}
    </NextIntlClientProvider>
  )
}
