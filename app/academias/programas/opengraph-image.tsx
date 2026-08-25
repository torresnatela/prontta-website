import { ImageResponse } from 'next/og';
import { AcademiaOg, OG_SIZE } from '@/components/academias/shared/OgTemplate';

export const runtime = 'nodejs';
export const alt = 'Programas de saúde assistida para associados — Prontta Saúde';
export const size = OG_SIZE;
export const contentType = 'image/png';

/**
 * Fixo, sem programa/preço da query string: o link circula por WhatsApp, onde o
 * crawler não executa JS e o preview precisa ser estável.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <AcademiaOg
        kicker="Jornadas de saúde assistida"
        title="Programas de saúde para os associados da sua academia"
        subtitle="Médicos, nutrição e psicologia acompanhando você no ciclo inteiro"
        path="/academias/programas"
        background="linear-gradient(135deg, #0f2740 0%, #123e62 55%, #2c97e8 165%)"
      />
    ),
    { ...size },
  );
}
