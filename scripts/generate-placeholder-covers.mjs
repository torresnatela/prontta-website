/**
 * Gera as capas 16:9 PLACEHOLDER dos capítulos da camada explicativa.
 *
 *   node scripts/generate-placeholder-covers.mjs            # todas as páginas
 *   node scripts/generate-placeholder-covers.mjs proposta   # só uma
 *
 * Estas capas são provisórias: existem para a camada explicativa não nascer com
 * buracos enquanto as fotos e os vídeos reais não são produzidos. Trocar uma
 * delas por foto é editar um caminho — ver o README de cada pasta em public/.
 *
 * ⚠️ A saída é determinística e os arquivos de /academias estão versionados:
 * rodar isto sem querer mudar nada deve deixar `git status` limpo. Se sujar, o
 * template mudou e as capas em uso vão mudar junto.
 *
 * As cores saem da paleta de `app/simulador-ui.css` (--brand, --brand-2, --navy).
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Glifos no grid 24×24 do lucide — o mesmo que os ícones inline usam. */
const GLYPHS = {
  bars: ['M4 18h16', 'M7 18V9', 'M12 18V5', 'M17 18v-6'],
  heartPulse: [
    'M12 20s-6.5-3.9-8.5-8A4.9 4.9 0 0 1 12 6a4.9 4.9 0 0 1 8.5 6C18.5 16.1 12 20 12 20z',
    'M8.5 12h2.2l1-2.2 1.6 4.4 1.1-2.2h1.9',
  ],
  cycle: ['M20 12a8 8 0 1 1-3-6.2', 'M20 4v5h-5', 'M12 8v4l3 2'],
  ledger: ['M4 20h16', 'M7 20V12', 'M12 20V6', 'M17 20v-5', 'M4 4h5'],
  calendarCheck: ['M4 6h16v14H4z', 'M8 3v4', 'M16 3v4', 'M4 10h16', 'M9 15l2 2 4-4'],
  document: ['M7 3h7l4 4v14H7z', 'M14 3v4h4', 'M10 13h6', 'M10 17h6'],
};

function cover({ label, number, eyebrow, glyph }) {
  const paths = GLYPHS[glyph].map((d) => `    <path d="${d}"/>`).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d2137"/>
      <stop offset="0.6" stop-color="#0a6db4"/>
      <stop offset="1" stop-color="#0a9fd6"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.8" cy="0.15" r="0.7">
      <stop offset="0" stop-color="#7cc8ff" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#7cc8ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d2137" stop-opacity="0"/>
      <stop offset="1" stop-color="#0d2137" stop-opacity="0.45"/>
    </linearGradient>
  </defs>

  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect width="1280" height="720" fill="url(#glow)"/>

  <g fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2">
    <circle cx="1060" cy="180" r="130"/>
    <circle cx="1060" cy="180" r="210"/>
    <circle cx="1060" cy="180" r="290"/>
  </g>

  <!-- Onda acima do bloco de texto e à esquerda do play (que ocupa o centro). -->
  <path d="M0 470 L340 470 L376 430 L410 512 L452 408 L488 470 L1280 470"
        fill="none" stroke="#7cc8ff" stroke-opacity="0.4" stroke-width="5"
        stroke-linecap="round" stroke-linejoin="round"/>

  <g transform="translate(910 130) scale(13)" fill="none" stroke="#ffffff"
     stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
${paths}
  </g>

  <!-- Escurece o rodapé para o texto conviver com o botão de play (centro) e
       com o chip "Assistir ao vídeo" que o componente desenha por cima. -->
  <rect x="0" y="330" width="1280" height="390" fill="url(#scrim)"/>

  <g font-family="system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
    <text x="96" y="230" font-size="180" font-weight="800" letter-spacing="-6"
          fill="#ffffff" fill-opacity="0.16">${number}</text>
    <text x="100" y="512" font-size="30" font-weight="700" letter-spacing="7"
          fill="#7cc8ff">${eyebrow}</text>
    <text x="100" y="614" font-size="88" font-weight="800" letter-spacing="-2"
          fill="#ffffff">${label}</text>
  </g>

  <rect x="100" y="656" width="210" height="8" rx="4" fill="#7cc8ff"/>
</svg>
`;
}

/**
 * Hero PLACEHOLDER — proporção ~2.33:1, igual à foto de /academias.
 *
 * A composição vive à DIREITA de propósito: o CSS do hero deita um véu em
 * gradiente sobre os ~68% da esquerda (`.hero-media::after`) e ancora a imagem
 * em `center right`, então tudo que for desenhado à esquerda some atrás do
 * texto. Abstrato porque é placeholder assumido — não tenta passar por foto.
 */
function hero({ label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1916 821" width="1916" height="821" role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d2137"/>
      <stop offset="0.55" stop-color="#0a6db4"/>
      <stop offset="1" stop-color="#0a9fd6"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.18" r="0.65">
      <stop offset="0" stop-color="#7cc8ff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#7cc8ff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1916" height="821" fill="url(#bg)"/>
  <rect width="1916" height="821" fill="url(#glow)"/>

  <g fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2">
    <circle cx="1480" cy="300" r="180"/>
    <circle cx="1480" cy="300" r="290"/>
    <circle cx="1480" cy="300" r="400"/>
  </g>

  <!-- Cartões translúcidos: a silhueta de uma proposta sendo montada. -->
  <g stroke="#ffffff" stroke-opacity="0.22" stroke-width="2">
    <rect x="1180" y="250" width="420" height="250" rx="26" fill="#ffffff" fill-opacity="0.08"/>
    <rect x="1330" y="380" width="420" height="250" rx="26" fill="#ffffff" fill-opacity="0.12"/>
  </g>
  <g fill="#7cc8ff" fill-opacity="0.55">
    <rect x="1370" y="424" width="150" height="14" rx="7"/>
    <rect x="1370" y="460" width="250" height="14" rx="7"/>
    <rect x="1370" y="496" width="200" height="14" rx="7"/>
  </g>
  <g fill="#ffffff" fill-opacity="0.5">
    <rect x="1370" y="556" width="330" height="10" rx="5"/>
    <rect x="1370" y="586" width="230" height="10" rx="5"/>
  </g>

  <!-- Traçado de ECG: a marca da Prontta, atravessando a composição. -->
  <path d="M960 620 L1180 620 L1214 566 L1252 686 L1298 520 L1336 620 L1916 620"
        fill="none" stroke="#7cc8ff" stroke-opacity="0.42" stroke-width="6"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
}

/**
 * As capas de /academias são COMPARTILHADAS pelas duas páginas (dono e
 * associado) — por isso trazem só a palavra-chave do tema, e não o título do
 * capítulo, que muda conforme o público.
 */
const PAGES = {
  academias: {
    dir: 'public/academias/capitulos',
    eyebrow: 'PRONTTA PARA ACADEMIAS',
    chapters: [
      { id: 'visao-geral', label: 'Visão geral', glyph: 'bars' },
      { id: 'programas', label: 'Programas', glyph: 'heartPulse' },
      { id: 'ciclo', label: 'Ciclo', glyph: 'cycle' },
      { id: 'dre', label: 'DRE', glyph: 'ledger' },
    ],
  },
  proposta: {
    dir: 'public/proposta-midia/capitulos',
    eyebrow: 'PRONTTA SAÚDE · PROPOSTA',
    // NÃO renomeie para `public/proposta/`: o matcher de `proxy.ts` cobre
    // `/proposta/:path*` e engoliria os arquivos estáticos num redirect
    // para o login. Ver `public/proposta-midia/README.md`.
    // /academias já tem foto real no hero; aqui ainda não.
    hero: { path: 'public/proposta-midia/hero-proposta.svg', label: 'Proposta comercial Prontta Saúde' },
    chapters: [
      { id: 'visao-geral', label: 'Visão geral', glyph: 'bars' },
      { id: 'consultas', label: 'Consultas', glyph: 'calendarCheck' },
      { id: 'programas', label: 'Programas', glyph: 'heartPulse' },
      { id: 'dre', label: 'Resultado', glyph: 'ledger' },
      { id: 'pdf', label: 'Proposta', glyph: 'document' },
    ],
  },
};

const requested = process.argv.slice(2);
const pages = requested.length ? requested : Object.keys(PAGES);

for (const name of pages) {
  const page = PAGES[name];
  if (!page) {
    console.error(`página desconhecida: ${name} (use ${Object.keys(PAGES).join(' | ')})`);
    process.exitCode = 1;
    continue;
  }
  if (page.hero) {
    mkdirSync(join(ROOT, dirname(page.hero.path)), { recursive: true });
    writeFileSync(join(ROOT, page.hero.path), hero({ label: page.hero.label }));
    console.log(page.hero.path);
  }
  mkdirSync(join(ROOT, page.dir), { recursive: true });
  page.chapters.forEach((chapter, index) => {
    const svg = cover({
      label: chapter.label,
      number: String(index + 1).padStart(2, '0'),
      eyebrow: page.eyebrow,
      glyph: chapter.glyph,
    });
    writeFileSync(join(ROOT, page.dir, `${chapter.id}.svg`), svg);
    console.log(`${page.dir}/${chapter.id}.svg`);
  });
}
