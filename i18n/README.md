# Best Practice: Struktur i18n untuk Next.js dengan next-intl

## Struktur Folder
```
i18n/
├── messages/
│   ├── id.json    # Bahasa Indonesia
│   └── en.json    # English
└── request.ts     # Config next-intl
```

## Cara Penggunaan

### 1. Client Components
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

### 2. Server Components
```tsx
import { useTranslations } from 'next-intl';

export default function MyPage() {
  const t = useTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

### 3. Metadata (Server-side)
```tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}
```

## Struktur JSON Translation

Gunakan namespace untuk organisasi yang lebih baik:

```json
{
  "home": {
    "title": "...",
    "description": "..."
  },
  "nav": {
    "home": "...",
    "settings": "..."
  },
  "metadata": {
    "title": "...",
    "description": "..."
  }
}
```

## Language Switcher

Simpan preferensi bahasa di cookie untuk persistence:

```tsx
'use client';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const locale = useLocale();
  
  function changeLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  }
  
  return <button onClick={() => changeLocale('en')}>EN</button>;
}
```

## Best Practice: Memisahkan Data & Content

Untuk konten dinamis seperti changelog, pisahkan:

### Data Structure (lib/changelog.ts)
```typescript
export interface ChangelogEntry {
  id: string           // ← Translation key
  version: string
  date: string
  changeCount: number  // ← Jumlah items
  image?: { src, alt }
}
```

### Translations (i18n/messages/[locale].json)
```json
{
  "changelog": {
    "entries": {
      "new-feature": {
        "title": "New Feature",
        "description": "Description...",
        "changes": ["Change 1", "Change 2"]
      }
    }
  }
}
```

### Usage in Component
```tsx
const t = useTranslations('changelog');
return (
  <div>
    <h2>{t(`entries.${entry.id}.title`)}</h2>
    <p>{t(`entries.${entry.id}.description`)}</p>
    <ul>
      {Array.from({ length: entry.changeCount }).map((_, i) => (
        <li key={i}>{t(`entries.${entry.id}.changes.${i}`)}</li>
      ))}
    </ul>
  </div>
);
```

## Menambah Konten Baru

### 1. Tambah struktur di `lib/[feature].ts`:
```typescript
{
  id: "my-new-entry",
  version: "1.0.0",
  date: "2026-07-17",
  changeCount: 3
}
```

### 2. Tambah translations di `i18n/messages/id.json` & `en.json`:
```json
{
  "entries": {
    "my-new-entry": {
      "title": "Judul",
      "description": "Deskripsi",
      "changes": ["Item 1", "Item 2", "Item 3"]
    }
  }
}
```

## Tips

1. **Namespace yang jelas**: Pisahkan translations berdasarkan fitur/halaman
2. **Reusable keys**: Gunakan namespace `common` untuk text yang sering dipakai
3. **Consistent naming**: Gunakan camelCase untuk keys
4. **Type safety**: Next-intl support TypeScript types
5. **Lazy loading**: Messages hanya di-load sesuai locale yang aktif
6. **Data vs Content**: Pisahkan struktur data (metadata) dan konten (text)
