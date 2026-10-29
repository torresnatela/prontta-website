import { lookup } from 'node:dns/promises'
import { BlockList, isIP } from 'node:net'
import { imageDir } from './post-input'
import type { ImageInput } from './post-input'

/**
 * Recebe uma imagem (URL ou base64) enviada pela IA e a prepara para commit em
 * public/blog/images/<slug>/. Valida o formato pelos bytes (não confia na
 * extensão nem no content-type) e limita o tamanho.
 */

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024

export interface PreparedImage {
  /** Caminho no repositório (ex.: public/blog/images/x/cover.webp). */
  repoPath: string
  /** Caminho público (ex.: /blog/images/x/cover.webp). */
  publicPath: string
  base64: string
  alt: string
}

type ImageType = 'png' | 'jpg' | 'webp' | 'avif'

/** Detecta o formato pelos "magic bytes". */
export function sniffImageType(bytes: Uint8Array): ImageType | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))
  if (bytes[0] === 0x89 && ascii(1, 4) === 'PNG') return 'png'
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg'
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp'
  if (ascii(4, 8) === 'ftyp' && /avi[fs]/.test(ascii(8, 12))) return 'avif'
  return null
}

/** Faixas que não são internet pública (loopback, privadas, link-local, CGNAT…). */
const blockedRanges = new BlockList()
for (const [net, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 3],
] as const) {
  blockedRanges.addSubnet(net, prefix, 'ipv4')
}
for (const [net, prefix] of [
  ['::', 127],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const) {
  blockedRanges.addSubnet(net, prefix, 'ipv6')
}

export function isPublicAddress(address: string): boolean {
  const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i)?.[1]
  if (mapped) return isPublicAddress(mapped)
  const family = isIP(address)
  if (family === 0) return false
  return !blockedRanges.check(address, family === 4 ? 'ipv4' : 'ipv6')
}

type Lookup = (hostname: string) => Promise<{ address: string; family: number }[]>

export interface FetchDeps {
  fetchFn?: typeof fetch
  lookup?: Lookup
}

const defaultLookup: Lookup = (hostname) => lookup(hostname, { all: true })

const MAX_REDIRECTS = 3

/**
 * A URL vem da IA: só baixamos de https em IP público (checado a cada
 * redirecionamento) e lemos o corpo em streaming até o limite, sem confiar no
 * content-length. Isso evita usar o servidor para acessar a rede interna
 * (SSRF) ou estourar a memória.
 */
async function assertPublicUrl(url: URL, lookupFn: Lookup): Promise<void> {
  if (url.protocol !== 'https:') throw new Error(`Use uma URL https para a imagem (${url}).`)
  const host = url.hostname.replace(/^\[|\]$/g, '')
  const addresses = isIP(host) ? [{ address: host }] : await lookupFn(host)
  if (!addresses.length || addresses.some((a) => !isPublicAddress(a.address))) {
    throw new Error(`A imagem ${url} aponta para um endereço interno — use uma URL pública.`)
  }
}

async function readCapped(res: Response, source: string): Promise<Uint8Array> {
  if (Number(res.headers.get('content-length') ?? 0) > MAX_IMAGE_BYTES) {
    throw new Error(`Imagem ${source} maior que 3 MB.`)
  }
  if (!res.body) return new Uint8Array(await res.arrayBuffer())
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > MAX_IMAGE_BYTES) {
      await reader.cancel()
      throw new Error(`Imagem ${source} maior que 3 MB.`)
    }
    chunks.push(value)
  }
  return new Uint8Array(Buffer.concat(chunks))
}

async function download(source: string, deps: FetchDeps): Promise<Uint8Array> {
  const fetchFn = deps.fetchFn ?? fetch
  const lookupFn = deps.lookup ?? defaultLookup
  const signal = AbortSignal.timeout(15_000)
  let url = new URL(source)
  for (let hop = 0; ; hop++) {
    await assertPublicUrl(url, lookupFn)
    const res = await fetchFn(url, { signal, redirect: 'manual' })
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      if (hop >= MAX_REDIRECTS) throw new Error(`Redirecionamentos demais em ${source}.`)
      url = new URL(location, url)
      continue
    }
    if (!res.ok) throw new Error(`Não consegui baixar a imagem ${source} (HTTP ${res.status}).`)
    return readCapped(res, source)
  }
}

async function loadBytes(image: ImageInput, deps: FetchDeps): Promise<Uint8Array> {
  if (image.base64) {
    const clean = image.base64.replace(/^data:[^,]+,/, '').replace(/\s/g, '')
    return new Uint8Array(Buffer.from(clean, 'base64'))
  }
  return download(image.url!, deps)
}

/**
 * @param baseName nome sem extensão (ex.: "cover") — se ausente, usa `filename`.
 */
export async function prepareImage(
  image: ImageInput,
  slug: string,
  baseName?: string,
  deps: FetchDeps = {},
): Promise<PreparedImage> {
  const source = image.url ?? 'base64'
  const bytes = await loadBytes(image, deps)
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(
      `Imagem ${source} tem ${(bytes.byteLength / 1048576).toFixed(1)} MB (máx. 3 MB).`,
    )
  }
  const type = sniffImageType(bytes)
  if (!type) throw new Error(`Imagem ${source} não é PNG, JPG, WebP nem AVIF.`)

  let fileName: string
  if (baseName) {
    fileName = `${baseName}.${type}`
  } else if (image.filename) {
    // Mantém o nome pedido (é o que o corpo referencia), mesmo que a extensão
    // declarada divirja do formato real — navegadores leem pelo conteúdo.
    fileName = image.filename
  } else {
    throw new Error('Imagens do corpo precisam de `filename`.')
  }

  const publicPath = `${imageDir(slug)}/${fileName}`
  return {
    repoPath: `public${publicPath}`,
    publicPath,
    base64: Buffer.from(bytes).toString('base64'),
    alt: image.alt,
  }
}
