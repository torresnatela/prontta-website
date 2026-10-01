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

async function loadBytes(image: ImageInput): Promise<Uint8Array> {
  if (image.base64) {
    const clean = image.base64.replace(/^data:[^,]+,/, '').replace(/\s/g, '')
    return new Uint8Array(Buffer.from(clean, 'base64'))
  }
  const url = new URL(image.url!)
  if (url.protocol !== 'https:') throw new Error(`Use uma URL https para a imagem (${image.url}).`)
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000), redirect: 'follow' })
  if (!res.ok) throw new Error(`Não consegui baixar a imagem ${image.url} (HTTP ${res.status}).`)
  const length = Number(res.headers.get('content-length') ?? 0)
  if (length > MAX_IMAGE_BYTES) throw new Error(`Imagem ${image.url} maior que 3 MB.`)
  return new Uint8Array(await res.arrayBuffer())
}

/**
 * @param baseName nome sem extensão (ex.: "cover") — se ausente, usa `filename`.
 */
export async function prepareImage(
  image: ImageInput,
  slug: string,
  baseName?: string,
): Promise<PreparedImage> {
  const source = image.url ?? 'base64'
  const bytes = await loadBytes(image)
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
