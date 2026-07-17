import type { Metadata } from "next"
import { WhatsappIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  };
}

export default function HomePage() {
  const t = useTranslations('home');
  
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('description')}
        </p>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 mt-8">
          <a
            href="/cutter"
            className="flex items-center gap-3 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 p-2 hover:bg-accent transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30">
              <svg className="size-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">{t('imageCutter.title')}</span>
              <span className="truncate text-xs text-muted-foreground">
                {t('imageCutter.description')}
              </span>
            </div>
          </a>
          <a
            href="/convert-image"
            className="flex items-center gap-3 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 p-2 hover:bg-accent transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30">
              <svg className="size-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">{t('convertImage.title')}</span>
              <span className="truncate text-xs text-muted-foreground">
                {t('convertImage.description')}
              </span>
            </div>
          </a>
          <a
            href="/reels"
            className="flex items-center gap-3 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 p-2 hover:bg-accent transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30">
              <svg className="size-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">{t('reelsMaker.title')}</span>
              <span className="truncate text-xs text-muted-foreground">
                {t('reelsMaker.description')}
              </span>
            </div>
          </a>
          <a
            href="/captions"
            className="flex items-center gap-3 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 p-2 hover:bg-accent transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30">
              <svg className="size-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">{t('aiCaptions.title')}</span>
              <span className="truncate text-xs text-muted-foreground">
                {t('aiCaptions.description')}
              </span>
            </div>
          </a>
          <a
            href="/team-picker"
            className="flex items-center gap-3 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 p-2 hover:bg-accent transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30">
              <svg className="size-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">{t('teamPicker.title')}</span>
              <span className="truncate text-xs text-muted-foreground">
                {t('teamPicker.description')}
              </span>
            </div>
          </a>
        </div>
        <a
          href="https://chat.whatsapp.com/JAXMVJAdtZWKZI41ioOKLW"
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-sidebar-border/60 bg-sidebar-accent/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <HugeiconsIcon icon={WhatsappIcon} strokeWidth={2} className="size-4" />
          {t('feedback')}
        </a>
      </div>
    </div>
  )
}
