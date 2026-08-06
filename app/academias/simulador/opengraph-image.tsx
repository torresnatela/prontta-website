import { ImageResponse } from 'next/og';
import { AcademiaOg, OG_SIZE } from '@/components/academias/shared/OgTemplate';

export const runtime = 'nodejs';
export const alt = 'Simulador de receita para academias — Prontta Saúde';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <AcademiaOg
        kicker="Para academias"
        title="Simule uma nova fonte de receita para sua academia"
        subtitle="Programas de saúde assistida · ciclos de 3, 6 ou 12 meses"
        path="/academias/simulador"
        background="linear-gradient(135deg, #102a43 0%, #123e62 60%, #0a9fd6 170%)"
        markBackground="#e1f4fb"
      />
    ),
    { ...size },
  );
}
