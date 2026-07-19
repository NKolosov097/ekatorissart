// Nested layout under the locale segment.
// Provides i18n context, Header and Footer for the public site.

import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import type { Locale } from "@/i18n/config"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  )
}
