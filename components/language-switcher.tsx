"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const flags = {
  id: "🇮🇩",
  en: "🇬🇧",
} as const

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const flag = flags[locale as keyof typeof flags] ?? flags.id

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <Select value={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger
        aria-label="Change language"
        className={cn(
          compact && "h-8 w-8 justify-center border-transparent bg-transparent px-0 text-base shadow-none hover:bg-accent [&>svg]:hidden",
          !compact && "w-[140px]"
        )}
      >
        {compact ? <span>{flag}</span> : <SelectValue />}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
        <SelectItem value="en">🇬🇧 English</SelectItem>
      </SelectContent>
    </Select>
  )
}
