"use client"

import Image from "next/image"
import { SidebarLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { LanguageSwitcher } from "@/components/language-switcher"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const t = useTranslations('changelog');
  const changelogEntries = t.raw('entries') as Array<{ version: string }>;
  const latestVersion = changelogEntries[0]?.version ?? "0.0.0"

  return (
    <header className="sticky top-0 z-50 flex w-full items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-(--header-height) w-full items-center">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 h-full border-b border-l border-r">
          <div className="flex items-center gap-3">
            <Image 
              src="/favicon.ico" 
              alt="Twizz Tools Logo" 
              width={32} 
              height={32}
              className="rounded"
            />
            <div className="leading-none">
              <span className="block text-sm font-bold tracking-tight sm:text-base">
                Twizz Tools
              </span>
              <span className="block text-[10px] text-muted-foreground">
                v{latestVersion}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <Button
              className="flex h-8 w-8 md:hidden"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
            >
              <HugeiconsIcon icon={SidebarLeftIcon} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
