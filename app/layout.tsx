import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/lib/site-config'
import { organizationSchema, websiteSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/JsonLd'
import { CookieConsent } from '@/components/CookieConsent'
import { SimulatorGateProvider } from '@/components/simulator-gate'

// Inter no corpo, Manrope nos títulos — as duas fontes do layout aprovado.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-manrope',
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
    'telessaúde assistida',
    'telemedicina B2B',
    'programas de saúde assistida',
    'especialidades médicas',
    'clínicas',
    'academias',
    'empresas',
    'NR-1',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteConfig.language}
      className={`${inter.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Favicons vêm de app/icon.png, app/apple-icon.png e app/favicon.ico,
            que o App Router injeta sozinho — não declare <link> aqui. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="font-sans">
        {/* O modal "Simular proposta" é aberto pelo Header e pelos CTAs de
            qualquer página pública, por isso o provider mora aqui. */}
        <SimulatorGateProvider>{children}</SimulatorGateProvider>
        <CookieConsent gaId={siteConfig.analytics.gaId} />
      </body>
    </html>
  )
}
