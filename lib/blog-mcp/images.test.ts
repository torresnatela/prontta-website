// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { isPublicAddress, MAX_IMAGE_BYTES, prepareImage } from './images'

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/** Resolve qualquer host para um IP público fixo (sem DNS de verdade). */
const publicDns = async () => [{ address: '93.184.216.34', family: 4 }]

describe('isPublicAddress', () => {
  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '192.168.1.1',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '::1',
    'fe80::1',
    'fd00::1',
    '::ffff:127.0.0.1',
  ])('bloqueia %s', (ip) => {
    expect(isPublicAddress(ip)).toBe(false)
  })

  it.each(['93.184.216.34', '8.8.8.8', '2606:4700::1111'])('libera %s', (ip) => {
    expect(isPublicAddress(ip)).toBe(true)
  })
})

describe('prepareImage com URL', () => {
  const image = { url: 'https://cdn.example.com/a.png', alt: 'imagem de teste' }

  it('baixa e prepara uma imagem pública', async () => {
    const fetchFn = vi.fn(async () => new Response(PNG))
    const out = await prepareImage(image, 'post', 'cover', { fetchFn, lookup: publicDns })
    expect(out.publicPath).toBe('/blog/images/post/cover.png')
    expect(fetchFn).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ redirect: 'manual' }),
    )
  })

  it('recusa host que resolve para IP interno', async () => {
    const fetchFn = vi.fn()
    const lookup = async () => [{ address: '169.254.169.254', family: 4 }]
    await expect(
      prepareImage(image, 'post', 'cover', { fetchFn: fetchFn as never, lookup }),
    ).rejects.toThrow(/endereço interno/)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('valida o destino de cada redirecionamento', async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(null, { status: 302, headers: { location: 'https://internal.local/x.png' } }),
    )
    const lookup = async (host: string) =>
      host === 'internal.local'
        ? [{ address: '10.0.0.5', family: 4 }]
        : [{ address: '93.184.216.34', family: 4 }]
    await expect(prepareImage(image, 'post', 'cover', { fetchFn, lookup })).rejects.toThrow(
      /endereço interno/,
    )
    expect(fetchFn).toHaveBeenCalledTimes(1)
  })

  it('recusa redirecionamento para http', async () => {
    const fetchFn = vi.fn(
      async () => new Response(null, { status: 301, headers: { location: 'http://x.com/a.png' } }),
    )
    await expect(
      prepareImage(image, 'post', 'cover', { fetchFn, lookup: publicDns }),
    ).rejects.toThrow(/https/)
  })

  it('interrompe o download acima do limite mesmo sem content-length', async () => {
    let pulled = 0
    const chunk = new Uint8Array(1024 * 1024)
    const body = new ReadableStream({
      pull(controller) {
        pulled++
        controller.enqueue(pulled === 1 ? new Uint8Array([...PNG, ...chunk]) : chunk)
        if (pulled > 10) controller.close()
      },
    })
    const fetchFn = vi.fn(async () => new Response(body))
    await expect(
      prepareImage(image, 'post', 'cover', { fetchFn, lookup: publicDns }),
    ).rejects.toThrow(/3 MB/)
    expect(pulled * chunk.byteLength).toBeLessThanOrEqual(MAX_IMAGE_BYTES + 2 * chunk.byteLength)
  })
})
