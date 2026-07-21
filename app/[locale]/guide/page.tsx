import type { Metadata } from "next"
import { getNamespaceMessages } from "@/i18n/messages"

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getNamespaceMessages(["guide"])
  const guide = messages.guide as GuideMessages

  return guide.metadata
}

type GuideStep = {
  title: string
  description: string
}

type CutterGuide = {
  title: string
  subtitle: string
  width: string
  height: string
  slides: string
}

type GuideMessages = {
  title: string
  subtitle: string
  metadata: Metadata
  cutter: CutterGuide
  steps: GuideStep[]
}

export default async function GuidePage() {
  const messages = await getNamespaceMessages(["guide"])
  const guide = messages.guide as GuideMessages
  const cutterSizes = Array.from({ length: 10 }, (_, index) => ({
    slides: index + 1,
    width: (index + 1) * 1080,
  }))
  const gridModes = [
    { name: "With gap", width: 3130 },
    { name: "Without gap", width: 3110 },
  ]
  const gridSizes = Array.from({ length: 10 }, (_, index) => ({
    rows: index + 1,
    height: (index + 1) * 1350,
  }))

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6">
      <div className="px-6 text-center md:px-12 md:py-6">
        <h1 className="mx-auto max-w-3xl text-5xl leading-none font-black tracking-tight text-foreground md:text-7xl">
          {guide.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm font-medium text-muted-foreground md:text-base">
          {guide.subtitle}
        </p>
      </div>

      <section>
        <div className="mb-6">
          <h2 className="text-base font-medium">{guide.cutter.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {guide.cutter.subtitle}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-2 md:p-5">
          <div>
            <div className="grid grid-cols-[auto_1fr] gap-4 md:gap-6">
              <div className="grid grid-rows-[1fr_auto] gap-4">
                <div className="flex items-stretch gap-3 md:gap-4">
                  <div className="flex w-5 items-center justify-end md:w-6">
                    <span className="-rotate-90 whitespace-nowrap text-xs text-muted-foreground">
                      {guide.cutter.height}
                    </span>
                  </div>
                  <div className="relative border-l-2 border-foreground">
                    <span className="absolute -left-2 top-0 w-4 border-t-2 border-foreground" />
                    <span className="absolute -left-2 bottom-0 w-4 border-t-2 border-foreground" />
                  </div>
                </div>
                <div className="h-9" />
              </div>

              <div>
                <div className="grid grid-cols-3 border-2 border-foreground md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-[1080/1350] border-r-2 border-foreground max-md:nth-[n+4]:hidden md:last:border-r-0"
                    >
                      <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 text-center text-xs text-muted-foreground md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="px-1 max-md:nth-[n+4]:hidden md:px-3">
                      <div className="relative mb-2 border-t-2 border-foreground">
                        <span className="absolute -top-1 left-0 h-2 border-l-2 border-foreground" />
                        <span className="absolute -top-1 right-0 h-2 border-l-2 border-foreground" />
                      </div>
                      {guide.cutter.width}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {cutterSizes.map((size) => (
            <div
              key={size.slides}
              className="rounded-lg border border-border/60 bg-card p-3"
            >
              <div className="mb-3 overflow-x-auto">
                <div
                  className="grid overflow-hidden rounded-sm border border-foreground"
                  style={{
                    gridTemplateColumns: `repeat(${size.slides}, 48px)`,
                    width: `${size.slides * 48}px`,
                  }}
                >
                  {Array.from({ length: size.slides }).map((_, index) => (
                    <span
                      key={index}
                      className="flex aspect-[1080/1350] items-center justify-center border-r border-foreground font-mono text-[10px] text-muted-foreground last:border-r-0"
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>{size.slides} slide</span>
                <span aria-hidden="true">→</span>
                <span className="font-mono">1350 x {size.width}px</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-base font-medium">Grid Mode</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ukuran grid berdasarkan tinggi 1350px per baris.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {gridModes.map((mode) => (
            <div key={mode.name}>
              <h3 className="mb-3 text-sm font-medium">{mode.name}</h3>
              <div className="rounded-lg border border-border/60 bg-card p-3">
                <div className="mb-6 grid grid-cols-[auto_1fr] gap-4">
                  <div className="grid grid-rows-[1fr_auto] gap-4">
                    <div className="grid grid-rows-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-stretch gap-3">
                          <div className="flex w-5 items-center justify-end">
                            <span className="-rotate-90 whitespace-nowrap text-xs text-muted-foreground">
                              1350px
                            </span>
                          </div>
                          <div className="relative border-l-2 border-foreground">
                            <span className="absolute -left-2 top-0 w-4 border-t-2 border-foreground" />
                            <span className="absolute -left-2 bottom-0 w-4 border-t-2 border-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-9" />
                  </div>

                  <div>
                    <div className="grid border-2 border-foreground">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <span
                          key={index}
                          className="flex items-center justify-center border-b-2 border-foreground font-mono text-xs text-muted-foreground last:border-b-0"
                          style={{ aspectRatio: `${mode.width} / 1350` }}
                        >
                          {index + 1}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                      <div className="relative mb-2 border-t-2 border-foreground">
                        <span className="absolute -top-1 left-0 h-2 border-l-2 border-foreground" />
                        <span className="absolute -top-1 right-0 h-2 border-l-2 border-foreground" />
                      </div>
                      {mode.width}px
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {gridSizes.map((size) => (
                    <div
                      key={`${mode.name}-${size.rows}`}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <span>{size.rows} row</span>
                      <span aria-hidden="true">→</span>
                      <span className="font-mono">
                        {mode.width} x {size.height}px
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
