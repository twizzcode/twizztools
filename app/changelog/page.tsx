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

export default async function ChangelogPage() {
  const t = await getTranslations('changelog');

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-0">
      <ChangelogContent
        entries={t.raw('entries')}
        labels={{
          title: t('title'),
          subtitle: t('subtitle'),
          version: t('version'),
          whatsIncluded: t('whatsIncluded'),
        }}
      />
    </div>
  )
}
