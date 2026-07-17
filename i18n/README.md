# i18n TwizzTools

## Struktur saat ini

```txt
app/
├── [locale]/          # Semua page UI
└── api/               # API routes tetap di luar [locale]

i18n/
├── messages.ts        # Loader namespace per locale
├── navigation.ts      # Link/useRouter/usePathname next-intl
├── request.ts         # Config request next-intl
├── routing.ts         # locales + localePrefix
└── messages/
    ├── en.json        # Legacy/full fallback
    ├── id.json        # Legacy/full fallback
    ├── en/
    │   ├── nav.json
    │   ├── home.json
    │   └── ...
    └── id/
        ├── nav.json
        ├── home.json
        └── ...
```

## Routing

Pakai `localePrefix: "as-needed"`:

- Default locale `id`: `/`, `/faq`, `/settings`
- English `en`: `/en`, `/en/faq`, `/en/settings`

Config utama ada di `i18n/routing.ts` dan `middleware.ts`.

## Navigation

Untuk internal navigation, pakai wrapper dari `@/i18n/navigation`.

```tsx
import { Link, usePathname, useRouter } from "@/i18n/navigation"
```

Jangan pakai `next/link` atau `next/navigation` untuk route internal yang perlu locale.

## Messages

Jangan pass full locale JSON ke `NextIntlClientProvider`.

Pakai namespace loader:

```tsx
import { getNamespaceMessages } from "@/i18n/messages"

const messages = await getNamespaceMessages(["nav"])
```

Provider harus route-specific dan kecil:

```tsx
<NextIntlClientProvider messages={{ nav: messages.nav }}>
  {children}
</NextIntlClientProvider>
```

## Client Components

Client component tetap pakai `useTranslations`, tapi pastikan namespace sudah diprovide oleh layout route terdekat.

```tsx
"use client"

import { useTranslations } from "next-intl"

export function Example() {
  const t = useTranslations("nav")
  return <span>{t("home")}</span>
}
```

## Server Pages

Untuk server page, baca namespace object langsung. Hindari `getMessages()` dan `getTranslations()` kalau tidak perlu.

```tsx
import { getNamespaceMessages } from "@/i18n/messages"

export default async function Page() {
  const messages = await getNamespaceMessages(["settings"])
  const settings = messages.settings as SettingsMessages

  return <h1>{settings.title}</h1>
}
```

## Metadata

Metadata juga ambil dari namespace split.

```tsx
export async function generateMetadata() {
  const messages = await getNamespaceMessages(["faq"])
  const faq = messages.faq as { metadata: Metadata }

  return faq.metadata
}
```

## Tambah namespace baru

1. Tambah file:
   - `i18n/messages/id/{namespace}.json`
   - `i18n/messages/en/{namespace}.json`
2. Update loader di `i18n/messages.ts` untuk `id` dan `en`.
3. Jika dipakai client, provide namespace di layout route terdekat.
4. Jika dipakai link internal, pakai `@/i18n/navigation`.

## Prinsip performa

- Load namespace yang dipakai saja.
- Jangan kirim full JSON ke client.
- Taruh provider sedekat mungkin dengan route yang butuh.
- Server-only content tidak perlu masuk `NextIntlClientProvider`.
- API routes tetap di luar `app/[locale]`.
