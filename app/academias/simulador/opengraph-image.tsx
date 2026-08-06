import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'nodejs';
export const alt = 'Simulador de receita para academias — Prontta Saúde';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * OG gerado no build. `public/` está vazio (só .gitkeep), então
 * `siteConfig.ogImage` daria 404 — por isso a page passa `image: null` e a
 * imagem vem daqui.
 */
export default function OgImage() {
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
          background: 'linear-gradient(135deg, #102a43 0%, #123e62 60%, #0a9fd6 170%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: '#e1f4fb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a6db4',
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            P+
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 30, fontWeight: 700 }}>
            <span>prontta</span>
            <span style={{ color: '#7cc8ff' }}>saúde</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 24,
              color: '#7cc8ff',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Para academias
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, maxWidth: 960 }}>
            Simule uma nova fonte de receita para sua academia
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.75)', maxWidth: 900 }}>
            Programas de saúde assistida · ciclos de 3, 6 ou 12 meses
          </div>
        </div>

        {/* Uma única string: o Satori exige display:flex em div com mais de um filho. */}
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>
          {`${siteConfig.url.replace(/^https?:\/\//, '')}/academias/simulador`}
        </div>
      </div>
    ),
    { ...size },
  );
}
