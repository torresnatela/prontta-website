import type { Metadata } from 'next'
import { Outfit, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/lib/site-config'
import { organizationSchema, websiteSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/JsonLd'
import { CookieConsent } from '@/components/CookieConsent'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const defaultTitle = `${siteConfig.name} | ${siteConfig.shortDescription}`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'terceirização médica',
    'telesaúde híbrida',
    'telemedicina',
    'agenda médica dedicada',
    'especialidades médicas',
    'clínicas',
    'hospitais',
    'saúde',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: siteConfig.analytics.googleVerification
    ? { google: siteConfig.analytics.googleVerification }
    : undefined,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={siteConfig.language}
      className={`${outfit.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="font-sans">
        {children}
        <CookieConsent gaId={siteConfig.analytics.gaId} />
      </body>
    </html>
  )
}

