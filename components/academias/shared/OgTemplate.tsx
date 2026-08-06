import { siteConfig } from '@/lib/site-config';

interface AcademiaOgProps {
  kicker: string;
  title: string;
  subtitle: string;
  /** Path exibido no rodapé, ex.: '/academias/simulador'. */
  path: string;
  /** Gradiente de fundo e cor da pílula do logo. */
  background: string;
  markBackground: string;
}

/**
 * Template das OG images das duas rotas /academias.
 *
 * `public/` está vazio, então `siteConfig.ogImage` daria 404 — as pages passam
 * `image: null` e a imagem vem daqui via `next/og`.
 *
 * ⚠️ O Satori exige `display: flex` em qualquer div com mais de um filho, e o
 * rodapé é uma string só por isso.
 */
export function AcademiaOg({
  kicker,
  title,
  subtitle,
  path,
  background,
  markBackground,
}: AcademiaOgProps) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: markBackground,
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
