# Mídia das páginas /proposta

Inventário do que está publicado aqui, para que serve e o que ainda é placeholder.

Gêmeo de [`public/academias/README.md`](../academias/README.md): as páginas usam o
mesmo sistema de design (`app/simulador-ui.css`) e a mesma camada explicativa.

## ⚠️ Por que a pasta se chama `proposta-midia` e não `proposta`

O matcher de [`proxy.ts`](../../proxy.ts) cobre `/proposta/:path*`. Uma pasta
`public/proposta/` seria servida em `/proposta/...`, cairia dentro do matcher e
**todo arquivo estático viraria um redirect 307 para o login** — imagens quebradas
na página, sem nenhum erro no console que explicasse o motivo.

Se um dia a rota deixar de ser protegida, renomear passa a ser possível — mas não
é necessário.

## Vídeos de /proposta/clinicas e /proposta/academias — no Vercel Blob

Os três capítulos são gravações de tela reais, **auto-hospedadas** no Vercel Blob
(store `prontta-website-midia`, conectado ao projeto `prontta-website`, região
`gru1`), e não no YouTube. Tocam num `<video>` nativo atrás do mesmo facade
(`components/simulador/shared/VideoFacade.tsx`, `video.kind === 'file'`).

| Pathname no Blob | Capítulo | Duração | Origem |
| --- | --- | --- | --- |
| `proposta/como-fazer-uma-simulacao.mp4` | `visao-geral` — Como fazer uma simulação | 3:05 | `IMG_0168.MOV` |
| `proposta/programas-de-saude.mp4` | `programas` — Programas de Saúde Assistida | 1:28 | `IMG_0170.MOV` |
| `proposta/resultado-final-da-proposta.mp4` | `dre` — Resultado final da proposta | 2:01 | `IMG_0209.MOV` |

As URLs públicas ficam hardcoded em [`lib/proposta/videos.ts`](../../lib/proposta/videos.ts)
(`BLOB_HOST` + pathname). **Nada em runtime depende do Blob**: sem SDK, sem token
no deploy — o token só é necessário para subir arquivo.

### Como (re)publicar um vídeo

1. Converta o `.MOV` (HEVC, ~180 MB) para MP4 H.264, que qualquer navegador toca:

   ```sh
   ffmpeg -i IMG_XXXX.MOV -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -r 30 \
     -c:a aac -b:a 96k -ac 2 -movflags +faststart saida.mp4
   ```

   Gravação de tela comprime muito: os três ficaram entre 6 e 14 MB.
   `+faststart` é o que permite começar a tocar antes de baixar tudo.

2. Suba no mesmo pathname, sobrescrevendo (`vercel link` já feito no repo;
   o token vem de `vercel env pull`):

   ```sh
   vercel blob put saida.mp4 --pathname proposta/<nome>.mp4 \
     --content-type video/mp4 --access public --allow-overwrite
   ```

   O `cache-control` padrão é 30 dias — depois de sobrescrever, o CDN pode
   servir a versão antiga por até esse prazo. Se for urgente, use outro nome e
   troque a URL em `lib/proposta/videos.ts`.

3. Se a duração mudou, ajuste `durationLabel` no capítulo.

## Capas dos capítulos

| Arquivo | Proporção | Onde aparece |
| --- | --- | --- |
| `capitulos/visao-geral.jpg` | 16:9 (1600×900) | Capa do capítulo 1 de clínicas/academias. **Frame real** do vídeo (2:17), sem a barra do navegador. |
| `capitulos/programas.jpg` | 16:9 (1600×900) | Capa do capítulo 2. **Frame real** (1:19). |
| `capitulos/dre.jpg` | 16:9 (1600×900) | Capa do capítulo 3. **Frame real** (1:03). |
| `capitulos/visao-geral.svg`, `consultas.svg`, `programas.svg`, `pdf.svg` | 16:9 | Capas de `/proposta/empresa`. Placeholder. |
| `capitulos/beneficio.svg`, `retorno.svg` | 16:9 | Capas exclusivas de `/proposta/empresa`. Placeholder. |
| `hero-proposta.svg` | 1916×821 (~2.33:1) | Fundo do hero de `/proposta/empresa` (via `heroImageFor` em `lib/proposta/videos.ts`). Placeholder. |

Para extrair uma capa nova de um vídeo (escolha um instante sem legenda queimada;
o recorte tira a barra do navegador):

```sh
ffmpeg -ss 137.5 -i IMG_0168.MOV -frames:v 1 -vf "crop=1688:949:0:131,scale=1600:900" \
  -q:v 3 public/proposta-midia/capitulos/visao-geral.jpg
```

O hero de `/proposta/clinicas` e `/proposta/academias` usa a **foto real de
/academias** (`public/academias/hero-academias.png`) — decisão deliberada até
existir uma foto própria de clínica; trocar é uma linha em `heroImageFor`.

Os placeholders em SVG saem de
[`scripts/generate-placeholder-covers.mjs`](../../scripts/generate-placeholder-covers.mjs):

```sh
node scripts/generate-placeholder-covers.mjs proposta
```

A saída é determinística — rodar o script sem ter mudado o template deixa o
`git status` limpo.

## Pendências

1. **/proposta/empresa** ainda é todo placeholder: vídeos (Big Buck Bunny via
   `PLACEHOLDER_VIDEO`), capas e hero. Quando gravar, siga o mesmo caminho acima
   e troque `video: PLACEHOLDER_VIDEO` por `{ kind: 'file', src }` em
   [`lib/empresa/videos.ts`](../../lib/empresa/videos.ts).
2. **Foto própria de clínica** para o hero de `/proposta/clinicas`.
3. **JSON-LD `VideoObject`** para os três vídeos reais de clínicas/academias — o
   helper deve entrar em [`lib/structured-data.ts`](../../lib/structured-data.ts),
   como os demais. Só para capítulos com vídeo real; nunca para placeholder.
