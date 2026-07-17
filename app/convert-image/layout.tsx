import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export default async function ConvertImageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={{ convertImage: messages.convertImage }}>
      {children}
    </NextIntlClientProvider>
  )
}
