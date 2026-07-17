import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export default async function TeamPickerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={{ teamPicker: messages.teamPicker }}>
      {children}
    </NextIntlClientProvider>
  )
}
