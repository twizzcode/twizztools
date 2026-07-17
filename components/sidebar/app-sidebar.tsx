"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  ScissorIcon,
  InstagramIcon,
  Image01Icon,
  Settings05Icon,
  GithubIcon,
  MessageMultiple01Icon,
  NoteIcon,
  HelpCircleIcon,
  Moon02Icon,
  Sun03Icon,
  GroupIcon,
} from "@hugeicons/core-free-icons"

function SidebarThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  React.useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon
        icon={Sun03Icon}
        strokeWidth={2}
        className="ml-1 size-4 text-muted-foreground"
      />
      <Switch
        checked={isDark}
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
        className="h-5 w-9 data-[state=checked]:[&>span]:translate-x-4 [&>span]:size-4"
      />
      <HugeiconsIcon
        icon={Moon02Icon}
        strokeWidth={2}
        className="mr-1 size-4 text-muted-foreground"
      />
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('nav');
  
  const navMain = React.useMemo(() => [
    {
      title: t('home'),
      url: "/",
      description: t('home'),
      icon: <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />,
    },
    {
      title: t('imageCutter'),
      url: "/cutter",
      description: t('imageCutterDesc'),
      icon: <HugeiconsIcon icon={ScissorIcon} strokeWidth={2} />,
    },
    {
      title: t('reels'),
      url: "/reels",
      description: t('reelsDesc'),
      icon: <HugeiconsIcon icon={InstagramIcon} strokeWidth={2} />,
    },
    {
      title: t('captions'),
      url: "/captions",
      description: t('captionsDesc'),
      icon: <HugeiconsIcon icon={MessageMultiple01Icon} strokeWidth={2} />,
    },
    {
      title: t('convertImage'),
      url: "/convert-image",
      description: t('convertImageDesc'),
      icon: <HugeiconsIcon icon={Image01Icon} strokeWidth={2} />,
    },
    {
      title: t('teamPicker'),
      url: "/team-picker",
      description: t('teamPickerDesc'),
      icon: <HugeiconsIcon icon={GroupIcon} strokeWidth={2} />,
    },
  ], [t]);

  const navSecondary = React.useMemo(() => [
    {
      title: t('settings'),
      url: "/settings",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
    },
    {
      title: t('changelog'),
      url: "/changelog",
      icon: <HugeiconsIcon icon={NoteIcon} strokeWidth={2} />,
    },
    {
      title: t('faq'),
      url: "/faq",
      icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
    },
  ], [t]);
  
  return (
    <Sidebar {...props} className="border-l">
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="p-0">
        <div className="space-y-3 px-4 pb-4 pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/twizzcode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={GithubIcon} strokeWidth={2} className="size-4" />
              </a>
              <a
                href="https://instagram.com/twizzcode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={InstagramIcon} strokeWidth={2} className="size-4" />
              </a>
            </div>
            <SidebarThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
