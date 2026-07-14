import { Geist, Geist_Mono, Roboto } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { WelcomeDialog } from "@/components/welcome-dialog"
import { GoogleAnalytics } from "@/components/google-analytics"
import { cn } from "@/lib/utils"

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Twizz Tools - Image Cutter & Instagram Tools",
  description: "Free online tools for Instagram content creators. Cut images for carousel posts and create Instagram Reels with ease.",
  keywords: ["instagram tools", "image cutter", "instagram carousel", "reels creator", "social media tools"],
  authors: [{ name: "twizzcode", url: "https://github.com/twizzcode" }],
  creator: "twizzcode",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Twizz Tools - Image Cutter & Instagram Tools",
    description: "Free online tools for Instagram content creators. Cut images for carousel posts and create Instagram Reels with ease.",
    siteName: "Twizz Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twizz Tools - Image Cutter & Instagram Tools",
    description: "Free online tools for Instagram content creators. Cut images for carousel posts and create Instagram Reels with ease.",
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
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", roboto.variable)}
    >
      <body>
        <GoogleAnalytics />
        <ThemeProvider>
          <WelcomeDialog />
          <div className="h-svh overflow-hidden [--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex h-full min-h-0 w-full flex-col overflow-hidden">
              <SiteHeader />
              <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden pb-16 md:pb-0">
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
              </div>
              <MobileNav />
            </SidebarProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
