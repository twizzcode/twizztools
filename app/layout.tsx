import { Geist_Mono, Roboto } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { cn } from "@/lib/utils"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Twizz Tools - Image Cutter & Instagram Tools",
  description:
    "Free online tools for Instagram content creators. Cut images for carousel posts and create Instagram Reels with ease.",
  keywords: [
    "instagram tools",
    "image cutter",
    "instagram carousel",
    "reels creator",
    "social media tools",
  ],
  authors: [{ name: "twizzcode", url: "https://github.com/twizzcode" }],
  creator: "twizzcode",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Twizz Tools - Image Cutter & Instagram Tools",
    description:
      "Free online tools for Instagram content creators. Cut images for carousel posts and create Instagram Reels with ease.",
    siteName: "Twizz Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twizz Tools - Image Cutter & Instagram Tools",
    description:
      "Free online tools for Instagram content creators. Cut images for carousel posts and create Instagram Reels with ease.",
    creator: "@twizzcode",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", roboto.variable)}
    >
      <body>{children}</body>
    </html>
  )
}
