import type { Metadata } from "next"
import { getTranslations } from 'next-intl/server';

import { ChangelogContent } from "@/components/changelog-content"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('changelog.metadata');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ChangelogPage() {
  return (
    <div className="flex flex-1 flex-col p-4 lg:p-0">
      <ChangelogContent />
    </div>
  )
}
