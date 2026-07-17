"use client"

import * as React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatChangelogDate } from "@/lib/changelog"

function VersionBadge({ version }: { version: string }) {
  const t = useTranslations('changelog');
  return (
    <span className="inline-flex h-5 w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-4xl border border-transparent bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-all">
      {t('version')} {version}
    </span>
  )
}

export function ChangelogContent() {
  const t = useTranslations('changelog');
  const changelogEntries = t.raw('entries') as Array<{
    id: string;
    version: string;
    date: string;
    title: string;
    description: string;
    changes: string[];
    image?: { src: string; alt: string };
  }>;
  
  const [activeEntry, setActiveEntry] = React.useState(0)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const getScrollParent = (element: HTMLElement) => {
      let parent = element.parentElement

      while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY

        if (overflowY === "auto" || overflowY === "scroll") {
          return parent
        }

        parent = parent.parentElement
      }

      return window
    }

    const scrollParent = rootRef.current ? getScrollParent(rootRef.current) : window

    const updateActiveEntry = () => {
      if (scrollParent instanceof HTMLElement) {
        const maxScroll = scrollParent.scrollHeight - scrollParent.clientHeight

        if (scrollParent.scrollTop <= 4) {
          setActiveEntry(0)
          return
        }

        if (scrollParent.scrollTop >= maxScroll - 4) {
          setActiveEntry(changelogEntries.length - 1)
          return
        }
      } else {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight

        if (window.scrollY <= 4) {
          setActiveEntry(0)
          return
        }

        if (window.scrollY >= maxScroll - 4) {
          setActiveEntry(changelogEntries.length - 1)
          return
        }
      }

      const scrollRect =
        scrollParent instanceof HTMLElement
          ? scrollParent.getBoundingClientRect()
          : { top: 0, height: window.innerHeight }
      const middle = scrollRect.top + scrollRect.height / 2
      const closestEntry = changelogEntries.reduce(
        (closest, entry, index) => {
          const element = document.getElementById(entry.id)

          if (!element) {
            return closest
          }

          const rect = element.getBoundingClientRect()
          const distance = Math.abs(rect.top + rect.height / 2 - middle)

          return distance < closest.distance ? { index, distance } : closest
        },
        { index: 0, distance: Number.POSITIVE_INFINITY }
      )

      setActiveEntry(closestEntry.index)
    }

    if (scrollParent instanceof HTMLElement) {
      scrollParent.dataset.changelogScroll = "true"
      scrollParent.style.scrollbarWidth = "none"
    }

    scrollParent.addEventListener("scroll", updateActiveEntry, { passive: true })
    requestAnimationFrame(updateActiveEntry)

    return () => {
      scrollParent.removeEventListener("scroll", updateActiveEntry)

      if (scrollParent instanceof HTMLElement) {
        delete scrollParent.dataset.changelogScroll
        scrollParent.style.scrollbarWidth = ""
      }
    }
  }, [changelogEntries])

  return (
    <>
      <style>{`[data-changelog-scroll]::-webkit-scrollbar{display:none}`}</style>
      <div ref={rootRef} className="container relative flex flex-col lg:flex-row">
      <div className="mb-12 lg:hidden">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          {t('title')}
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          {t('subtitle')}
        </p>
        <Separator className="mt-8" />
      </div>

      <aside className="sticky top-0 hidden h-fit w-72 overflow-visible lg:px-6 pt-4 lg:block lg:pt-6">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-base text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <Separator className="mb-6" />
        <div className="relative h-[calc(100vh-300px)] overflow-y-auto">
          <div className="pb-6">
            <nav className="flex flex-col space-y-2.5">
          {changelogEntries.map((entry, index) => (
                <a
                  key={entry.version}
                  href={`#${entry.id}`}
                  className={cn(
                    "group flex flex-col gap-2 rounded-md border border-transparent px-3 py-2 text-left text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-foreground",
                    activeEntry === index &&
                      "border-border bg-accent font-medium text-foreground shadow-sm"
                  )}
                >
                  <span className="text-sm">{entry.title}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{t('version')} {entry.version}</span>
                    <span>•</span>
                    <span>{formatChangelogDate(entry.date)}</span>
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:pl-10 lg:py-6 lg:pr-6">
        <div className="space-y-12 md:space-y-16">
          {changelogEntries.map((entry) => (
            <section
              key={entry.version}
              id={entry.id}
              className="relative flex flex-col gap-6 border-l-4 border-l-border/30 pl-4 lg:pl-6 transition-colors hover:border-l-border md:gap-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <VersionBadge version={entry.version} />
                <span className="text-xs font-medium text-muted-foreground">
                  {formatChangelogDate(entry.date)}
                </span>
              </div>
              <div>
                <h2 className="mb-4 text-xl leading-tight font-bold text-foreground md:text-2xl">
                  {entry.title}
                </h2>
                <p className="mb-6 text-base text-muted-foreground md:text-base">
                  {entry.description}
                </p>
                <div className="mt-6 rounded-lg border bg-muted/30 p-5">
                  <h3 className="mb-3 text-sm font-medium">{t('whatsIncluded')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {entry.changes.map((change, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mt-1 mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {entry.image && (
                  <div className="mt-8 overflow-hidden rounded-xl border">
                    <Image
                      src={entry.image.src}
                      alt={entry.image.alt}
                      width={1200}
                      height={675}
                      unoptimized
                      className="w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
      </div>
    </>
  )
}
