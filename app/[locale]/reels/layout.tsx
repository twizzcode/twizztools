import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getNamespaceMessages } from "@/i18n/messages"

export const metadata: Metadata = {
  title: "Reels Maker - Create Instagram Reels Images | TwizzTools",
  description: "Free Instagram Reels maker tool. Create 9:16 format images for Instagram Reels with custom backgrounds and blur effects.",
  keywords: ["reels maker", "instagram reels", "9:16 format", "reels creator", "vertical image"],
  openGraph: {
    title: "Reels Maker - Create Instagram Reels Images | TwizzTools",
    description: "Free Instagram Reels maker tool. Create 9:16 format images for Instagram Reels with custom backgrounds and blur effects.",
  },
}

export default async function ReelsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getNamespaceMessages(["reels"])

  return (
    <NextIntlClientProvider messages={{ reels: messages.reels }}>
      {children}
    </NextIntlClientProvider>
  )
}
