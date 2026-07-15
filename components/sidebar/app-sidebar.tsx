"use client"

import * as React from "react"
import { useTheme } from "next-themes"

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
  Settings05Icon,
  GithubIcon,
  MessageMultiple01Icon,
  NoteIcon,
  HelpCircleIcon,
  Moon02Icon,
  Sun03Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons"

function SidebarThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  React.useEffect(() => {
    setMounted(true)
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

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      description: "Homepage",
      icon: (
      <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Image Cutter",
      url: "/cutter",
      description: "Cut images for Instagram",
      icon: (
      <HugeiconsIcon icon={ScissorIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Reels",
      url: "/reels",
      description: "Create Instagram Reels",
      icon: (
        <HugeiconsIcon icon={InstagramIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Captions",
      url: "/captions",
      description: "AI Caption Generator",
      icon: (
        <HugeiconsIcon icon={MessageMultiple01Icon} strokeWidth={2} />
      ),
    },
    // {
    //   title: "Documentation",
    //   url: "/documentation",
    //   description: "Guides and references",
    //   icon: (
    //     <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />
    //   ),
    // },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   description: "Manage preferences",
    //   icon: (
    //     <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
    //   ),
    // },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Changelog",
      url: "/changelog",
      icon: (
        <HugeiconsIcon icon={NoteIcon} strokeWidth={2} />
      ),
    },
    {
      title: "FAQ",
      url: "/faq",
      icon: (
        <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      {/*<SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <HugeiconsIcon icon={CommandIcon} strokeWidth={2} className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>*/}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="p-0">
        {/*<div className="border-t" />*/}
        <div className="space-y-3 px-4 pb-4 pt-3">
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
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span>Made with</span>
            <HugeiconsIcon
              icon={FavouriteIcon}
              strokeWidth={2}
              className="size-3.5 text-red-500"
            />
            <span>by twizzcode</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
