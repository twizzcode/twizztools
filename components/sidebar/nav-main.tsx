"use client"

import { Link, usePathname } from "@/i18n/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    description?: string
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const isActive = pathname === item.url
          const description = item.description ?? "Open section"

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                size="lg"
                isActive={isActive}
                 className="h-auto min-h-12 gap-3 px-2 py-2"
                 render={<Link href={item.url} />}
               >

                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 [&_svg]:size-4.5">
                  {item.icon}
                </div>
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate font-medium">{item.title}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {description}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
