import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq.metadata")

  return {
    title: t("title"),
    description: t("description"),
  }
}

type Category = {
  id: string
  label: string
}

type FAQ = {
  question: string
  answer: string
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

function FAQTabsContent({ category, faqs }: { category: Category; faqs: FAQ[] }) {
  return (
    <TabsContent value={category.id} className="mt-0">
      <h2 className="mb-8 text-xl font-medium text-muted-foreground">
        {category.label}
      </h2>
      <FAQList faqs={faqs} />
    </TabsContent>
  )
}

export default async function FAQPage() {
  const t = await getTranslations("faq")
  const categories = t.raw("categories") as Category[]
  const faqsByCategory = t.raw("items") as Record<string, FAQ[]>
  const defaultCategory = categories[0]?.id ?? "general"

  return (
    <div className="faq-page flex flex-1 flex-col p-4">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="px-6 text-center md:px-12 md:py-6">
          <h1 className="mx-auto max-w-3xl text-5xl leading-none font-black tracking-tight text-foreground md:text-7xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium text-muted-foreground md:text-base">
            {t("subtitle")}
          </p>
        </div>

        <Tabs
          defaultValue={defaultCategory}
          className="hidden w-full items-start gap-16 md:flex lg:gap-28"
        >
          <TabsList className="flex h-auto min-w-60 flex-col gap-4 bg-transparent p-0 lg:min-w-90">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="w-full justify-start rounded-lg px-8 py-3 text-base font-medium text-muted-foreground shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full pt-2">
            {categories.map((category) => (
              <FAQTabsContent
                key={category.id}
                category={category}
                faqs={faqsByCategory[category.id] ?? []}
              />
            ))}
          </div>
        </Tabs>

        <Tabs defaultValue={defaultCategory} className="w-full md:hidden">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <FAQList faqs={faqsByCategory[category.id] ?? []} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}
