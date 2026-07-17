import { getLocale } from "next-intl/server"

type Messages = Record<string, unknown>

const loaders = {
  en: {
    captions: () => import("./messages/en/captions.json"),
    changelog: () => import("./messages/en/changelog.json"),
    convertImage: () => import("./messages/en/convertImage.json"),
    cutter: () => import("./messages/en/cutter.json"),
    faq: () => import("./messages/en/faq.json"),
    home: () => import("./messages/en/home.json"),
    metadata: () => import("./messages/en/metadata.json"),
    nav: () => import("./messages/en/nav.json"),
    reels: () => import("./messages/en/reels.json"),
    settings: () => import("./messages/en/settings.json"),
    teamPicker: () => import("./messages/en/teamPicker.json"),
  },
  id: {
    captions: () => import("./messages/id/captions.json"),
    changelog: () => import("./messages/id/changelog.json"),
    convertImage: () => import("./messages/id/convertImage.json"),
    cutter: () => import("./messages/id/cutter.json"),
    faq: () => import("./messages/id/faq.json"),
    home: () => import("./messages/id/home.json"),
    metadata: () => import("./messages/id/metadata.json"),
    nav: () => import("./messages/id/nav.json"),
    reels: () => import("./messages/id/reels.json"),
    settings: () => import("./messages/id/settings.json"),
    teamPicker: () => import("./messages/id/teamPicker.json"),
  },
} as const

type Locale = keyof typeof loaders
type Namespace = keyof (typeof loaders)[Locale]

export async function getNamespaceMessages<const T extends Namespace[]>(
  namespaces: T
) {
  const locale = (await getLocale()) as Locale
  const entries = await Promise.all(
    namespaces.map(async (namespace) => {
      const mod = await loaders[locale][namespace]()
      return [namespace, mod.default] as const
    })
  )

  return Object.fromEntries(entries) as Pick<Messages, T[number]>
}
