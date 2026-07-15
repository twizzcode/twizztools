import type { Metadata } from "next"

import { ChangelogContent } from "@/components/changelog-content"

export const metadata: Metadata = {
  title: "Changelog - TwizzTools",
  description: "Riwayat update TwizzTools.",
}

export default function ChangelogPage() {
  return (
    <div className="flex flex-1 flex-col p-4 lg:p-0">
      <ChangelogContent />
    </div>
  )
}
