import { BRAND_LOCKUP_RATIO, BRAND_LOCKUP_WHITE_DATA_URI } from '@/lib/brand-assets';
import { siteConfig } from '@/lib/site-config';

const LOGO_HEIGHT = 84;

interface AcademiaOgProps {
  kicker: string;
  title: string;
  subtitle: string;
  /** Path exibido no rodapé, ex.: '/academias/simulador'. */
  path: string;
  /** Gradiente de fundo. */
  background: string;
}

/**
 * Template das OG images das duas rotas /academias.
 *
 * Cada rota tem a sua arte em vez de cair no `siteConfig.ogImage` genérico — as
 * pages passam `image: null` e a imagem vem daqui via `next/og`.
 *
 * ⚠️ O Satori exige `display: flex` em qualquer div com mais de um filho, e o
 * rodapé é uma string só por isso. A logomarca entra como data URI
 * (`lib/brand-assets.ts`) porque o Satori não busca arquivos de `public/`.
 */
export function AcademiaOg({ kicker, title, subtitle, path, background }: AcademiaOgProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
        background,
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
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
            color: '#7cc8ff',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          {kicker}
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, maxWidth: 960 }}>{title}</div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.75)', maxWidth: 900 }}>
          {subtitle}
        </div>
      </div>

      <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>
        {`${siteConfig.url.replace(/^https?:\/\//, '')}${path}`}
      </div>
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
