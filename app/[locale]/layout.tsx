import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist_Mono, Noto_Sans_TC } from 'next/font/google'
import { getMessages } from 'next-intl/server'
import './globals.css'
import '@/app/styles/colors.scss'
import Header from '@/app/components/Header/Header'
import { NextIntlClientProvider } from 'next-intl'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Calens',
  description: 'See it. Schedule it.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = await getMessages({ locale })

  return (
    <ClerkProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <html lang={locale as string} className="light">
          <body
            className={`${notoSansTC.variable} ${geistMono.variable} antialiased`}
          >
            <Header />
            {children}
          </body>
        </html>
      </NextIntlClientProvider>
    </ClerkProvider>
  )
}
