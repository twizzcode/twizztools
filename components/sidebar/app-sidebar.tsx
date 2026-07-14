"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home01Icon, ScissorIcon, InstagramIcon, BookOpen02Icon, Settings05Icon, ChartRingIcon, SentIcon, CropIcon, PieChartIcon, MapsIcon, GithubIcon } from "@hugeicons/core-free-icons"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      title: "Support",
      url: "#",
      icon: (
        <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Feedback",
      url: "#",
      icon: (
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
      ),
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <HugeiconsIcon icon={CropIcon} strokeWidth={2} />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />
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
        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-center space-y-3 border-t">
          <p className="text-xs text-muted-foreground">
            © 2026 twizzcode
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/twizzcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={GithubIcon} strokeWidth={2} className="size-5" />
            </a>
            <a
              href="https://instagram.com/twizzcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={InstagramIcon} strokeWidth={2} className="size-5" />
            </a>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
