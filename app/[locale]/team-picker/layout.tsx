import { NextIntlClientProvider } from "next-intl"
import { getNamespaceMessages } from "@/i18n/messages"

export default async function TeamPickerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getNamespaceMessages(["teamPicker"])

  return (
    <NextIntlClientProvider messages={{ teamPicker: messages.teamPicker }}>
      {children}
    </NextIntlClientProvider>
  )
}
