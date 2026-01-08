import { Metadata } from 'next'

const BASE_URL = 'https://pronttasaude.com.br'

export function generateMetadata({
  title,
  description,
  path = '',
  image = '/og-image.png',
}: {
  title: string
  description: string
  path?: string
  image?: string
}): Metadata {
  const url = `${BASE_URL}${path}`

  return {
    title: `${title} | Prontta Saúde`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Prontta Saúde`,
      description,
      url,
      siteName: 'Prontta Saúde',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Prontta Saúde`,
      description,
      images: [image],
    },
  }
}

