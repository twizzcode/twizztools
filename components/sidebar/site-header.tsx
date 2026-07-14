"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { SidebarLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-(--header-height) w-full items-center">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/favicon.ico" 
              alt="Twizz Tools Logo" 
              width={32} 
              height={32}
              className="rounded"
            />
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              Twizz Tools
            </span>
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
    </header>
  )
}
