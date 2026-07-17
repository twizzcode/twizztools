import { hasLocale, NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/mobile-nav"
import { WelcomeDialogLoader } from "@/components/welcome-dialog-loader"
import { UmamiAnalytics } from "@/components/umami-analytics"
import { Toaster } from "@/components/ui/sonner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getNamespaceMessages } from "@/i18n/messages"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getNamespaceMessages(["nav", "changelog"])
  const changelog = messages.changelog as { entries: Array<{ version: string }> }
  const latestVersion = changelog.entries[0]?.version ?? "0.0.0"

  return (
    <NextIntlClientProvider messages={{ nav: messages.nav }}>
      <UmamiAnalytics />
      <ThemeProvider>
        <Toaster />
        <WelcomeDialogLoader />
        <div className="h-svh overflow-hidden [--header-height:calc(--spacing(14))]">
          <SidebarProvider className="flex h-full min-h-0 w-full flex-col overflow-hidden">
            <SiteHeader latestVersion={latestVersion} />
            <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden pb-16 md:pb-0">
              <AppSidebar />
              <SidebarInset className="border-r">{children}</SidebarInset>
            </div>
            <MobileNav />
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
