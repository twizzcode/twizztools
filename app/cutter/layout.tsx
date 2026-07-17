import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export const metadata: Metadata = {
  title: "Image Cutter - Cut Images for Instagram | TwizzTools",
  description: "Free online image cutter tool. Cut images for Instagram Grid & Carousel posts. Supports custom grid sizes and gap options.",
  keywords: ["image cutter", "instagram grid", "instagram carousel", "photo splitter", "image crop tool"],
  openGraph: {
    title: "Image Cutter - Cut Images for Instagram | TwizzTools",
    description: "Free online image cutter tool. Cut images for Instagram Grid & Carousel posts. Supports custom grid sizes and gap options.",
  },
}

export default async function CutterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={{ cutter: messages.cutter }}>
      {children}
    </NextIntlClientProvider>
  )
}
