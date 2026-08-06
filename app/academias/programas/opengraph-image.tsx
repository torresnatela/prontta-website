import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'nodejs';
export const alt = 'Programas de saúde assistida para associados — Prontta Saúde';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * OG fixo (sem programa/preço da query string): o link é compartilhado por
 * WhatsApp, onde o crawler não executa JS e o preview precisa ser estável.
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
          background: 'linear-gradient(135deg, #0f2740 0%, #123e62 55%, #2c97e8 165%)',
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
              background: '#ebf7ff',
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
            Jornadas de saúde assistida
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, maxWidth: 960 }}>
            Programas de saúde para os associados da sua academia
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.75)', maxWidth: 900 }}>
            Médicos, nutrição e psicologia acompanhando você no ciclo inteiro
          </div>
        </div>

        {/* Uma única string: o Satori exige display:flex em div com mais de um filho. */}
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>
          {`${siteConfig.url.replace(/^https?:\/\//, '')}/academias/programas`}
        </div>
      </div>
    ),
    { ...size },
  );
}
