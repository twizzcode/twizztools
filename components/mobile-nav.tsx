"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home01Icon, ScissorIcon, InstagramIcon, Menu01Icon, MessageMultiple01Icon } from "@hugeicons/core-free-icons"
import { useSidebar } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

export function MobileNav() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()
  const t = useTranslations('nav');

  const navItems = [
    {
      title: t('home'),
      url: "/",
      icon: Home01Icon,
    },
    {
      title: t('cutter'),
      url: "/cutter",
      icon: ScissorIcon,
    },
    {
      title: t('menu'),
      url: "#",
      icon: Menu01Icon,
      isMenu: true,
    },
    {
      title: t('reels'),
      url: "/reels",
      icon: InstagramIcon,
    },
    {
      title: t('captions'),
      url: "/captions",
      icon: MessageMultiple01Icon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.url
          
          if (item.isMenu) {
            return (
              <button
                key={item.title}
                onClick={() => toggleSidebar()}
                className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors"
              >
                <div className="flex size-9 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                </div>
                <span className="text-muted-foreground">{item.title}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.title}
              href={item.url}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors"
            >
              <div className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
                isActive ? "border border-sidebar-border/60 bg-sidebar-accent/30" : ""
              }`}>
                <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
              </div>
              <span className={isActive ? "text-foreground" : "text-muted-foreground"}>{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
