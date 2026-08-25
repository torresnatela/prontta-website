# Mídia da página /proposta

Inventário do que está publicado aqui, para que serve e o que ainda é placeholder.

Gêmeo de [`public/academias/README.md`](../academias/README.md): as duas páginas
usam o mesmo sistema de design (`app/simulador-ui.css`) e a mesma camada
explicativa, então as pendências de mídia têm a mesma forma.

## ⚠️ Por que a pasta se chama `proposta-midia` e não `proposta`

O matcher de [`proxy.ts`](../../proxy.ts) cobre `/proposta/:path*`. Uma pasta
`public/proposta/` seria servida em `/proposta/...`, cairia dentro do matcher e
**todo arquivo estático viraria um redirect 307 para o login** — imagens quebradas
na página, sem nenhum erro no console que explicasse o motivo.

Se um dia a rota deixar de ser protegida, renomear passa a ser possível — mas não
é necessário.

## Pendências antes de considerar a página "pronta"

1. **Trocar os vídeos.** Os cinco capítulos apontam para `PLACEHOLDER_YOUTUBE_ID`
   em [`lib/simulador/explainer.ts`](../../lib/simulador/explainer.ts) — hoje "Big
   Buck Bunny", da Blender Foundation. Grave os cinco vídeos, publique no canal e
   substitua o `youtubeId` de cada capítulo em
   [`lib/proposta/videos.ts`](../../lib/proposta/videos.ts). Nenhum componente
   precisa mudar.
2. **Trocar o hero por foto real.** `hero-proposta.svg` é arte abstrata gerada por
   script, não foto. É o único hero do site que ainda não é real — o de
   `/academias` já é.
3. **Trocar as capas dos capítulos** pelas ilustrações ou frames definitivos.
4. **Só então**, publicar JSON-LD `VideoObject`. O helper deve entrar em
   [`lib/structured-data.ts`](../../lib/structured-data.ts), como os demais.
   Foi deixado de fora de propósito: dados estruturados apontando para um vídeo
   placeholder seriam informação falsa para o Google.

## Arquivos

| Arquivo | Proporção | Onde aparece |
| --- | --- | --- |
| `hero-proposta.svg` | 1916×821 (~2.33:1) | Fundo do hero, via `components/simulador/shared/HeroMedia.tsx` (caminho em `PROPOSTA_HERO_IMAGE`). **Placeholder.** |
| `capitulos/visao-geral.svg` | 16:9 | Capa do capítulo 1. Placeholder. |
| `capitulos/consultas.svg` | 16:9 | Capa do capítulo 2. Placeholder. |
| `capitulos/programas.svg` | 16:9 | Capa do capítulo 3. Placeholder. |
| `capitulos/dre.svg` | 16:9 | Capa do capítulo 4. Placeholder. |
| `capitulos/pdf.svg` | 16:9 | Capa do capítulo 5. Placeholder. |

Tudo aqui sai de
[`scripts/generate-placeholder-covers.mjs`](../../scripts/generate-placeholder-covers.mjs):

```sh
node scripts/generate-placeholder-covers.mjs proposta
```

A saída é determinística — rodar o script sem ter mudado o template deixa o
`git status` limpo.

## Como trocar um placeholder por arquivo real

1. Salve o arquivo aqui, na mesma proporção, com no mínimo 1280 px de largura
   (o hero pede ~1900).
2. Atualize o caminho — é uma linha em cada caso, as duas em
   [`lib/proposta/videos.ts`](../../lib/proposta/videos.ts): `PROPOSTA_HERO_IMAGE`
   para o hero, o helper `poster()` para as capas.
3. **A extensão importa.** `next/image` serve `.svg` sem otimizar (`unoptimized`
   automático); um `.jpg`/`.png`/`.webp` no lugar passa a ser otimizado de verdade
   — o que é o comportamento desejado, mas exige trocar a extensão no código.
4. Quando trocar, tire a linha correspondente das pendências acima.
