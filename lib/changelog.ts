export interface ChangelogEntry {
  id: string
  title: string
  version: string
  date: string
  description: string
  changes: string[]
  image?: {
    src: string
    alt: string
  }
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function formatChangelogDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}

export const changelogEntries: ChangelogEntry[] = [
  {
    id: "changelog-faq-theme",
    title: "Changelog, FAQ, dan Theme",
    version: "3.0.3",
    date: "2026-07-15",
    description:
      "Update berikutnya akan fokus ke halaman informasi produk, dokumentasi ringan, dan pengalaman tema.",
    changes: [
      "Halaman Changelog untuk riwayat update produk",
      "FAQ untuk pertanyaan umum pengguna",
      "Theme toggle untuk mode terang dan gelap",
      "Perapian navigasi Settings, Changelog, dan FAQ",
      "Penyempurnaan copy, metadata, dan struktur konten",
    ],
  },
  {
    id: "captions-generator",
    title: "AI Captions Generator",
    version: "3.0.2",
    date: "2026-07-15",
    description:
      "Menambahkan fitur AI Captions untuk membantu kreator membuat caption social media lebih cepat.",
    changes: [
      "Halaman Captions baru untuk generate caption dengan AI",
      "Pengaturan tone, platform, bahasa, dan jumlah variasi caption",
      "Footer manager untuk menyimpan CTA, hashtag, dan signature reusable",
      "Rate limit lokal untuk menjaga penggunaan tetap aman",
      "Google Analytics dipasang untuk tracking penggunaan halaman utama",
    ],
  },
  {
    id: "rebuild-twizztools",
    title: "Rebuild TwizzCutter ke TwizzTools",
    version: "3.0.1",
    date: "2026-07-14",
    description:
      "TwizzCutter.com dibangun ulang menjadi TwizzTools.my.id dengan fondasi baru untuk kumpulan tools kreator.",
    changes: [
      "Migrasi brand dari TwizzCutter ke TwizzTools",
      "Domain baru TwizzTools.my.id",
      "Image Cutter tetap tersedia untuk grid dan carousel Instagram",
      "Reels Maker tetap tersedia untuk format konten vertikal 9:16",
      "Layout dashboard, sidebar, dan navigasi dibangun ulang",
    ],
    image: {
      src: "/changelog/3.0.1.webp",
      alt: "TwizzTools 3.0.1 dashboard preview",
    },
  },
]
