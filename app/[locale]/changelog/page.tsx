import type { Metadata } from "next"
import { ChangelogContent } from "@/components/changelog-content"
import { getNamespaceMessages } from "@/i18n/messages"

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getNamespaceMessages(["changelog"])
  const changelog = messages.changelog as { metadata: Metadata }
  
  return changelog.metadata
}

export default async function ChangelogPage() {
  const messages = await getNamespaceMessages(["changelog"])
  const changelog = messages.changelog as {
    title: string
    subtitle: string
    version: string
    whatsIncluded: string
    entries: Parameters<typeof ChangelogContent>[0]["entries"]
  }

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-0">
      <ChangelogContent
        entries={changelog.entries}
        labels={{
          title: changelog.title,
          subtitle: changelog.subtitle,
          version: changelog.version,
          whatsIncluded: changelog.whatsIncluded,
        }}
      />
    </div>
  )
}
