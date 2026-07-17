import { NextIntlClientProvider } from "next-intl"
import { getNamespaceMessages } from "@/i18n/messages"

export default async function ConvertImageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getNamespaceMessages(["convertImage"])

  return (
    <NextIntlClientProvider messages={{ convertImage: messages.convertImage }}>
      {children}
    </NextIntlClientProvider>
  )
}
