import { ImageResponse } from 'next/og'
import { BRAND_LOCKUP_RATIO, BRAND_LOCKUP_WHITE_DATA_URI } from '@/lib/brand-assets'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'
import { siteConfig } from '@/lib/site-config'

const LOGO_HEIGHT = 84

export const runtime = 'nodejs'
export const alt = 'Prontta Saúde'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Pré-gera as imagens junto com os artigos (estático).
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

/**
 * Imagem Open Graph gerada dinamicamente para cada post — elimina a
 * necessidade de criar uma imagem manual por artigo e garante bom
 * compartilhamento em redes sociais e por IAs.
 */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const title = post?.title ?? siteConfig.name
  const category = post?.category ?? 'Blog'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #0D2137 0%, #0D2137 55%, #00B4E6 160%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Data URI: o Satori não busca arquivos de `public/` — ver lib/brand-assets.ts. */}
        <img
          src={BRAND_LOCKUP_WHITE_DATA_URI}
          width={Math.round(LOGO_HEIGHT * BRAND_LOCKUP_RATIO)}
          height={LOGO_HEIGHT}
          alt={siteConfig.name}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 24,
              color: '#00B4E6',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {category}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>
            {title.length > 110 ? `${title.slice(0, 110)}…` : title}
          </div>
        </div>

        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    { ...size },
  )
}
