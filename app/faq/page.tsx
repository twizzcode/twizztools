import type { Metadata } from "next"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "FAQ - TwizzTools",
  description: "Pertanyaan yang sering diajukan tentang TwizzTools.",
}

const categories = ["General", "Plans & Pricing", "Privacy", "Responsible AI"] as const

type Category = (typeof categories)[number]
type FAQ = {
  question: string
  answer: string
}

const faqsByCategory: Record<Category, FAQ[]> = {
  General: [
    {
      question: "Apa itu TwizzTools?",
      answer:
        "TwizzTools adalah kumpulan tools gratis untuk membantu workflow kreatif, terutama konten Instagram.",
    },
    {
      question: "Bagaimana cara mulai memakai TwizzTools?",
      answer:
        "Pilih tool yang kamu butuhkan dari halaman utama, lalu ikuti instruksi di halaman tool tersebut.",
    },
    {
      question: "Platform apa yang didukung?",
      answer:
        "TwizzTools berjalan di browser modern pada desktop dan mobile.",
    },
    {
      question: "Apakah ada aplikasi mobile?",
      answer:
        "Belum ada aplikasi mobile terpisah. Semua fitur bisa dipakai langsung lewat browser.",
    },
    {
      question: "Bagaimana cara menghubungi support?",
      answer:
        "Gunakan kanal kontak yang tersedia di website atau repository proyek.",
    },
  ],
  "Plans & Pricing": [
    {
      question: "Apakah TwizzTools gratis?",
      answer:
        "Ya, semua fitur TwizzTools 100% gratis untuk digunakan tanpa batasan.",
    },
    {
      question: "Apakah ada versi premium?",
      answer:
        "Saat ini belum ada rencana untuk versi premium. Semua tools akan tetap gratis.",
    },
    {
      question: "Apakah perlu registrasi atau login?",
      answer:
        "Tidak perlu registrasi. Langsung akses dan pakai tool yang kamu butuhkan.",
    },
  ],
  Privacy: [
    {
      question: "Apakah gambar yang saya upload disimpan?",
      answer:
        "Tidak. Semua proses editing dilakukan langsung di browser kamu. Gambar tidak dikirim ke server.",
    },
    {
      question: "Apakah data saya aman?",
      answer:
        "Ya. Karena semua proses berjalan di browser, data kamu tidak meninggalkan perangkat kamu.",
    },
    {
      question: "Apakah TwizzTools menggunakan cookies?",
      answer:
        "Hanya untuk analytics dan preferensi tema. Tidak ada data pribadi yang dikumpulkan.",
    },
  ],
  "Responsible AI": [
    {
      question: "Apakah AI Caption Generator aman digunakan?",
      answer:
        "Ya. AI Caption menggunakan API resmi dari Google Gemini dengan rate limit untuk mencegah penyalahgunaan.",
    },
    {
      question: "Apakah caption yang dihasilkan original?",
      answer:
        "AI menghasilkan caption berdasarkan context yang kamu berikan. Hasilnya unique tapi tetap disarankan untuk review dan edit sesuai brand voice kamu.",
    },
    {
      question: "Berapa limit generate caption per hari?",
      answer:
        "Maksimal 5 caption per hari untuk mencegah spam dan memastikan kualitas layanan tetap optimal.",
    },
  ],
}

function FAQList({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="mx-auto max-w-xl">
      {faqs.map((faq, index) => (
        <div key={faq.question} className="mb-8 flex gap-4">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
            {index + 1}
          </span>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">{faq.question}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function FAQTabsContent({ category }: { category: Category }) {
  return (
    <TabsContent value={category} className="mt-0">
      <h2 className="mb-8 text-xl font-medium text-muted-foreground">
        {category}
      </h2>
      <FAQList faqs={faqsByCategory[category]} />
    </TabsContent>
  )
}

export default function FAQPage() {
  return (
    <div className="faq-page flex flex-1 flex-col p-4">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="px-6 text-center md:px-12 md:py-6">
          <h1 className="mx-auto max-w-3xl text-5xl leading-none font-black tracking-tight text-foreground md:text-7xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium text-muted-foreground md:text-base">
            Kalau kamu baru memakai TwizzTools atau ingin tahu cara kerja tiap
            fitur, panduan ini membantu kamu memahami tools gratis untuk workflow
            kreatif kamu.
          </p>
        </div>

        <Tabs
          defaultValue="General"
          className="hidden w-full items-start gap-16 md:flex lg:gap-28"
        >
          <TabsList className="flex h-auto min-w-60 flex-col gap-4 bg-transparent p-0 lg:min-w-90">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="w-full justify-start rounded-lg px-8 py-3 text-base font-medium text-muted-foreground shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full pt-2">
            {categories.map((category) => (
              <FAQTabsContent key={category} category={category} />
            ))}
          </div>
        </Tabs>

        <Tabs defaultValue="General" className="w-full md:hidden">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <FAQList faqs={faqsByCategory[category]} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}
