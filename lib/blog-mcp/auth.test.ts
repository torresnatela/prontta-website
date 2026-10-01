// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { checkAuth } from './auth'

const TOKEN = 'a'.repeat(32)
const url = 'https://pronttasaude.com.br/api/blog/mcp'

describe('checkAuth', () => {
  it('fecha quando o token não está configurado', () => {
    expect(checkAuth(new Request(url), undefined)).toMatchObject({ ok: false, status: 503 })
  })

  it('aceita Bearer', () => {
    const req = new Request(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
    expect(checkAuth(req, TOKEN)).toEqual({ ok: true })
  })

  it('aceita ?key=', () => {
    expect(checkAuth(new Request(`${url}?key=${TOKEN}`), TOKEN)).toEqual({ ok: true })
  })

  it('recusa token errado ou ausente', () => {
    expect(checkAuth(new Request(`${url}?key=errado`), TOKEN)).toMatchObject({ status: 401 })
    expect(checkAuth(new Request(url), TOKEN)).toMatchObject({ status: 401 })
  })
})
