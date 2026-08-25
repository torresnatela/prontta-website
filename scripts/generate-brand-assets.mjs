/**
 * Gera todos os derivados da logomarca a partir dos originais em `assets/brand/`.
 *
 *   npm run brand:assets
 *
 * Fontes (não são servidas — ficam fora de `public/`):
 *   assets/brand/prontta-logo-completa.png  → lockup "P + Prontta / Saúde"
 *   assets/brand/prontta-icone-p.png        → só o ícone do P com a linha de ECG
 *
 * Saídas:
 *   public/logo-prontta.png          lockup recortado (fundos claros)
 *   public/logo-prontta-branco.png   lockup com o navy virado branco (fundos escuros)
 *   public/icone-prontta.png         ícone do P em canvas quadrado
 *   public/og-image.png              OG padrão (siteConfig.ogImage)
 *   app/icon.png / apple-icon.png / favicon.ico   favicons (convenção do App Router)
 *   lib/brand-assets.ts              data URIs para o PDF (@react-pdf) e as OG images (Satori)
 *
 * Por que data URI em `lib/brand-assets.ts`: nem o @react-pdf/renderer (roda no
 * browser) nem o Satori (next/og) resolvem caminhos de `public/` de forma
 * confiável; embutir o binário elimina fetch, CORS e file tracing.
 */
import { Buffer } from 'node:buffer'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const at = (...p) => path.join(root, ...p)

const SRC_LOCKUP = at('assets', 'brand', 'prontta-logo-completa.png')
const SRC_MARK = at('assets', 'brand', 'prontta-icone-p.png')

/** Navy do wordmark — mesmo valor de NAVY no ProposalPDF e de `primary-navy`. */
const NAVY = { r: 0, g: 32, b: 77 }

const transparent = { r: 0, g: 0, b: 0, alpha: 0 }

/** Recorta a moldura transparente que os originais trazem em volta da arte. */
const trimmed = (src) => sharp(src).trim({ background: transparent, threshold: 1 })

/** Ciano da marca vs. navy/cinza do wordmark — separa por dominância de azul/verde. */
const cyanHue = (d, i) => d[i + 2] - d[i] > 120 && d[i + 1] - d[i] > 100
const isCyan = (d, i) => d[i + 3] >= 128 && cyanHue(d, i)

/**
 * Silhueta cheia do ícone do P.
 *
 * A linha de ECG é um RECORTE (alpha 0), não pixels brancos — nos originais ela
 * só parece branca porque o fundo da página é branco. Sem preencher, o P fica
 * "vazado" em qualquer fundo que não seja branco.
 *
 * A linha de ECG atravessa o P inteiro e o quebra em vários componentes ciano,
 * então "maior mancha" não basta: junta os componentes que se tocam na bbox do
 * maior (as fatias do P) e ignora os distantes ("Saúde" também é ciano). O
 * buraco é fechado por um closing (dilate + erode), que só ACRESCENTA pixels em
 * vãos mais estreitos que 2r — costura a linha de ECG inteira, inclusive onde
 * ela encosta na borda do P, sem invadir a concavidade da haste.
 */
function markSilhouette(data, w, h) {
  const cyan = new Uint8Array(w * h)
  for (let p = 0; p < w * h; p++) if (isCyan(data, p * 4)) cyan[p] = 1

  // Componentes conectados (flood fill iterativo), cada um com sua bbox.
  const seen = new Uint8Array(w * h)
  const stack = new Int32Array(w * h)
  const blobs = []
  for (let start = 0; start < w * h; start++) {
    if (!cyan[start] || seen[start]) continue
    let top = 0
    stack[top++] = start
    seen[start] = 1
    const px = []
    const box = { x0: w, y0: h, x1: 0, y1: 0 }
    while (top > 0) {
      const p = stack[--top]
      px.push(p)
      const x = p % w
      const y = (p - x) / w
      if (x < box.x0) box.x0 = x
      if (x > box.x1) box.x1 = x
      if (y < box.y0) box.y0 = y
      if (y > box.y1) box.y1 = y
      if (x > 0 && cyan[p - 1] && !seen[p - 1]) (seen[p - 1] = 1), (stack[top++] = p - 1)
      if (x < w - 1 && cyan[p + 1] && !seen[p + 1]) (seen[p + 1] = 1), (stack[top++] = p + 1)
      if (y > 0 && cyan[p - w] && !seen[p - w]) (seen[p - w] = 1), (stack[top++] = p - w)
      if (y < h - 1 && cyan[p + w] && !seen[p + w]) (seen[p + w] = 1), (stack[top++] = p + w)
    }
    blobs.push({ px, box })
  }
  if (blobs.length === 0) return new Uint8Array(w * h)

  // Agrega em volta do maior componente enquanto houver vizinho encostado.
  blobs.sort((a, b) => b.px.length - a.px.length)
  const pad = Math.max(2, Math.round(h * 0.02))
  const group = [blobs[0]]
  const hull = { ...blobs[0].box }
  const rest = blobs.slice(1)
  for (let changed = true; changed; ) {
    changed = false
    for (let i = rest.length - 1; i >= 0; i--) {
      const { box } = rest[i]
      const touches =
        box.x0 <= hull.x1 + pad &&
        box.x1 >= hull.x0 - pad &&
        box.y0 <= hull.y1 + pad &&
        box.y1 >= hull.y0 - pad
      if (!touches) continue
      hull.x0 = Math.min(hull.x0, box.x0)
      hull.y0 = Math.min(hull.y0, box.y0)
      hull.x1 = Math.max(hull.x1, box.x1)
      hull.y1 = Math.max(hull.y1, box.y1)
      group.push(rest[i])
      rest.splice(i, 1)
      changed = true
    }
  }

  const mark = new Uint8Array(w * h)
  for (const blob of group) for (const p of blob.px) mark[p] = 1

  // r maior que a metade da espessura da linha de ECG e bem menor que o vão
  // entre a haste e a barriga do P.
  const r = Math.max(2, Math.round(h * 0.035))
  return morph(morph(mark, w, h, r, true), w, h, r, false)
}

/** Min/max-filter quadrado, separável em duas passadas. */
function morph(mask, w, h, r, dilate) {
  const hit = dilate ? 1 : 0
  const seed = dilate ? 0 : 1
  const step = (src, dst, horizontal) => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let v = seed
        for (let d = -r; d <= r; d++) {
          const nx = horizontal ? x + d : x
          const ny = horizontal ? y : y + d
          const out = nx < 0 || nx >= w || ny < 0 || ny >= h
          const s = out ? 0 : src[ny * w + nx]
          if (s === hit) {
            v = hit
            break
          }
        }
        dst[y * w + x] = v
      }
    }
  }
  const pass = new Uint8Array(w * h)
  const out = new Uint8Array(w * h)
  step(mask, pass, true)
  step(pass, out, false)
  return out
}

/**
 * Deixa a arte independente do fundo:
 *
 * 1. chapa branca sob a silhueta do P, para a linha de ECG (que é recorte) voltar
 *    a ser branca;
 * 2. tira o contorno claro que o original traz em volta do P — invisível no
 *    branco, um anel branco em qualquer fundo escuro;
 * 3. com `whiteWordmark`, tudo que não é ciano vira branco (o wordmark navy e o
 *    antialiasing dele, que senão vira um halo escuro sobre o azul).
 */
async function flatten(input, { whiteWordmark = false } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info

  const filled = markSilhouette(data, w, h)
  // A chapa recua 1px para não vazar pela borda antialiased do ciano; mais que
  // isso comeria os trechos da linha de ECG que encostam na borda do P. O anel
  // de limpeza vai bem além da silhueta — e ainda longe do wordmark.
  const backing = morph(filled, w, h, 1, false)
  const ring = morph(filled, w, h, Math.max(2, Math.round(h * 0.016)), true)

  const plate = Buffer.alloc(w * h * 4)
  for (let p = 0; p < w * h; p++) {
    if (!backing[p]) continue
    plate.fill(255, p * 4, p * 4 + 4)
  }

  for (let p = 0; p < w * h; p++) {
    const i = p * 4
    // O original foi fechado sobre branco e deixou um halo quase invisível em
    // volta da arte — em fundo escuro ele vira uma névoa clara.
    if (data[i + 3] < 24) {
      data[i + 3] = 0
      continue
    }
    if (ring[p] && !backing[p] && !cyanHue(data, i)) {
      data[i + 3] = 0
      continue
    }
    if (whiteWordmark && !isCyan(data, i)) {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
    }
  }

  const raw = { width: w, height: h, channels: 4 }
  return sharp(plate, { raw })
    .composite([{ input: data, raw }])
    .png({ compressionLevel: 9, palette: true, colors: 128 })
    .toBuffer()
}

/** Ícone do P centralizado num canvas quadrado, com respiro nas bordas. */
async function squareMark(mark, { size, margin = 0.1, background = transparent }) {
  const inner = Math.round(size * (1 - margin * 2))
  const art = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer()

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toBuffer()
}

/** ICO multi-resolução com payload PNG (aceito por todos os browsers atuais). */
function buildIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)

  let offset = 6 + pngs.length * 16
  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

const dataUri = (buf) => `data:image/png;base64,${buf.toString('base64')}`

async function main() {
  await mkdir(at('public'), { recursive: true })

  // --- lockup ------------------------------------------------------------
  const source = await trimmed(SRC_LOCKUP).resize({ width: 1000 }).png().toBuffer()
  const lockup = await flatten(source)
  const lockupWhite = await flatten(source, { whiteWordmark: true })
  await writeFile(at('public', 'logo-prontta.png'), lockup)
  await writeFile(at('public', 'logo-prontta-branco.png'), lockupWhite)

  const { width: lw, height: lh } = await sharp(lockup).metadata()

  // --- ícone -------------------------------------------------------------
  // Achatado uma vez em alta resolução: o preenchimento da silhueta depende de
  // pixels bem definidos e não sobreviveria a um canvas de 16px.
  const mark = await flatten(await trimmed(SRC_MARK).resize({ width: 1024 }).toBuffer())
  await writeFile(at('public', 'icone-prontta.png'), await squareMark(mark, { size: 512 }))

  // --- favicons (convenção do App Router: app/icon.png, app/apple-icon.png)
  await writeFile(at('app', 'icon.png'), await squareMark(mark, { size: 256, margin: 0.06 }))
  await writeFile(
    at('app', 'apple-icon.png'),
    // iOS não respeita transparência: fundo branco, igual ao perfil das redes.
    await squareMark(mark, {
      size: 180,
      margin: 0.14,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
  )
  await writeFile(
    at('app', 'favicon.ico'),
    buildIco(
      await Promise.all(
        [16, 32, 48].map(async (size) => ({
          size,
          data: await squareMark(mark, { size, margin: 0.04 }),
        }))
      )
    )
  )

  // --- OG padrão ---------------------------------------------------------
  const OG = { width: 1200, height: 630 }
  const ogLogo = await sharp(lockupWhite).resize({ width: 660 }).toBuffer()
  await writeFile(
    at('public', 'og-image.png'),
    await sharp({
      create: { ...OG, channels: 4, background: { ...NAVY, alpha: 1 } },
    })
      .composite([
        { input: ogLogo, gravity: 'centre' },
        {
          // Faixa ciano inferior, o mesmo acento usado no site.
          input: {
            create: {
              width: OG.width,
              height: 12,
              channels: 4,
              background: { r: 0, g: 176, b: 240, alpha: 1 },
            },
          },
          gravity: 'south',
        },
      ])
      .png()
      .toBuffer()
  )

  // --- data URI (capa do PDF + OG images das /academias) -----------------
  // Só a versão branca: os dois consumidores desenham sobre fundo escuro.
  const lockupWhiteUri = dataUri(await sharp(lockupWhite).resize({ width: 460 }).png().toBuffer())

  await writeFile(
    at('lib', 'brand-assets.ts'),
    [
      '/**',
      ' * Logomarca embutida em base64 — GERADO, não edite à mão.',
      ' *',
      ' * Rode `npm run brand:assets` (scripts/generate-brand-assets.mjs) depois de',
      ' * trocar os originais em `assets/brand/`.',
      ' *',
      ' * Existe porque o @react-pdf/renderer (browser) e o Satori (next/og) não',
      ' * resolvem caminhos de `public/` de forma confiável — data URI evita fetch,',
      ' * CORS e file tracing. Só o PDF e as OG images devem importar daqui; no HTML',
      ' * use `next/image` com os arquivos de `public/`.',
      ' */',
      '',
      '/** Proporção do lockup (largura / altura). */',
      `export const BRAND_LOCKUP_RATIO = ${(lw / lh).toFixed(4)};`,
      '',
      '/** Lockup com o wordmark em branco, para fundos escuros. */',
      `export const BRAND_LOCKUP_WHITE_DATA_URI =\n  '${lockupWhiteUri}';`,
      '',
    ].join('\n')
  )

  console.log(`lockup ${lw}x${lh} · ratio ${(lw / lh).toFixed(3)}`)
  console.log('assets de marca gerados.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
