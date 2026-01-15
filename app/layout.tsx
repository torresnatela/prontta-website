import type { Metadata } from 'next'
import { Outfit, Space_Grotesk } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Prontta Saúde | Soluções em Terceirização Médica',
  description: 'Terceirização de serviços médicos especializados para clínicas e hospitais. Retorno de implante capilar, acompanhamento pós-operatório, pré-operatório cardiológico e mais.',
  keywords: ['terceirização médica', 'retorno implante capilar', 'pós-operatório', 'pré-operatório', 'clínicas', 'hospitais', 'saúde'],
  authors: [{ name: 'Prontta Saúde' }],
  creator: 'Prontta Saúde',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://pronttasaude.com.br',
    siteName: 'Prontta Saúde',
    title: 'Prontta Saúde | Soluções em Terceirização Médica',
    description: 'Terceirização de serviços médicos especializados para clínicas e hospitais.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prontta Saúde',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prontta Saúde | Soluções em Terceirização Médica',
    description: 'Terceirização de serviços médicos especializados para clínicas e hospitais.',
    images: ['/og-image.png'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalOrganization',
              name: 'Prontta Saúde',
              description: 'Soluções em terceirização de serviços médicos especializados',
              url: 'https://pronttasaude.com.br',
              logo: 'https://pronttasaude.com.br/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+55-31-99333-3245',
                contactType: 'sales',
                availableLanguage: ['Portuguese'],
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Av. Pres. Eurico Dutra, 608 - Belvedere',
                addressLocality: 'Belo Horizonte',
                addressRegion: 'MG',
                postalCode: '30320-190',
                addressCountry: 'BR',
              },
              sameAs: [
                'https://instagram.com/pronttasaude',
                'https://linkedin.com/company/pronttasaude',
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}

