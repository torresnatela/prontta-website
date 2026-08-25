# Mídia das páginas /academias

Inventário do que está publicado aqui, para que serve e o que ainda é placeholder.

## Pendências antes de considerar a camada explicativa "pronta"

1. **Trocar os vídeos.** Todos os capítulos apontam para `PLACEHOLDER_YOUTUBE_ID`
   em [`lib/simulador/explainer.ts`](../../lib/simulador/explainer.ts) — hoje "Big Buck
   Bunny", da Blender Foundation. Grave os quatro vídeos, publique no canal e
   substitua o `youtubeId` de cada capítulo. Nenhum componente precisa mudar.
2. **Trocar as capas em SVG** pelas fotos reais (ver tabela abaixo).
3. **Só então**, publicar JSON-LD `VideoObject`. O helper deve entrar em
   [`lib/structured-data.ts`](../../lib/structured-data.ts), como os demais.
   Foi deixado de fora de propósito: dados estruturados apontando para um vídeo
   placeholder seriam informação falsa para o Google.

## Arquivos

| Arquivo | Proporção | Onde aparece |
| --- | --- | --- |
| `hero-academias.png` | 1916×821 (~2.33:1) | Fundo do hero das duas páginas, via `components/simulador/shared/HeroMedia.tsx` (caminho em `ACADEMIA_HERO_IMAGE`, `lib/academias/catalog.ts`). **Foto real** — não é placeholder. |
| `capitulos/visao-geral.svg` | 16:9 | Capa do capítulo 1 do hub, nas duas páginas. Placeholder. |
| `capitulos/programas.svg` | 16:9 | Capa do capítulo "programas". Placeholder. |
| `capitulos/ciclo.svg` | 16:9 | Capa do capítulo "ciclo". Placeholder. |
| `capitulos/dre.svg` | 16:9 | Capa do capítulo "DRE" — só no simulador do dono. Placeholder. |
| `programas/performance.svg` | 16:9 | Capa do programa. Placeholder. |
| `programas/emagrecimento-inteligente.svg` | 16:9 | Capa do programa. Placeholder. |
| `programas/longevidade-ativa.svg` | 16:9 | Capa do programa. Placeholder. |
| `programas/sono-e-energia.svg` | 16:9 | Capa do programa. Placeholder. |

Os posters de `capitulos/` são **compartilhados pelas duas páginas** — por isso
trazem só a palavra-chave do tema, e não o título completo do capítulo (que muda
conforme o público: dono da academia x associado).

## Como trocar um placeholder por foto real

1. Salve o arquivo aqui, na mesma proporção (16:9), com no mínimo 1280 px de largura.
2. Atualize o caminho — é uma linha em cada caso:
   - capas de programa → o campo `image` do factory `card()` em
     [`lib/academias/catalog.ts`](../../lib/academias/catalog.ts);
   - posters de capítulo → o helper `poster()` em
     [`lib/academias/videos.ts`](../../lib/academias/videos.ts).
3. **A extensão importa.** `next/image` serve `.svg` sem otimizar (`unoptimized`
   automático); um `.jpg`/`.png`/`.webp` no lugar passa a ser otimizado de verdade
   — o que é o comportamento desejado, mas exige trocar a extensão no código.

As capas de `capitulos/` saem de
[`scripts/generate-placeholder-covers.mjs`](../../scripts/generate-placeholder-covers.mjs):

```sh
node scripts/generate-placeholder-covers.mjs academias
```

A saída é determinística e estes arquivos estão versionados — rodar o script sem
ter mudado o template deixa o `git status` limpo.

As capas de `programas/` foram geradas à parte e usam a paleta de tema de cada
programa definida em [`app/simulador-ui.css`](../../app/simulador-ui.css)
(`[data-theme='blue'|'lilac'|'green'|'gold']`).

A página /proposta tem o inventário gêmeo em
[`public/proposta-midia/README.md`](../proposta-midia/README.md).
