import type { Metadata } from "next"
import { getNamespaceMessages } from "@/i18n/messages"

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getNamespaceMessages(["settings"])
  const settings = messages.settings as SettingsMessages

  return settings.metadata
}

type SettingSection = {
  title: string
  description: string
  status: string
}

type SettingsMessages = {
  title: string
  subtitle: string
  metadata: Metadata
  sections: SettingSection[]
}

export default async function SettingsPage() {
  const messages = await getNamespaceMessages(["settings"])
  const settings = messages.settings as SettingsMessages

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h1 className="text-2xl font-semibold">{settings.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{settings.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.sections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-border/60 bg-muted/30 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-medium">{section.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {section.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
