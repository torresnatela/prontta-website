import { timingSafeEqual } from 'node:crypto'

/**
 * Autenticação do MCP do blog por token compartilhado (BLOG_MCP_TOKEN).
 *
 * Aceita o token de duas formas:
 * - header `Authorization: Bearer <token>` (Claude Code, Cursor, mcp-remote);
 * - query string `?key=<token>` — para conectores que só recebem uma URL
 *   (claude.ai, Claude Desktop e ChatGPT sem OAuth).
 */

export type AuthResult = { ok: true } | { ok: false; status: 401 | 503; message: string }

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export function extractToken(req: Request): string | undefined {
  const header = req.headers.get('authorization')
  const bearer = header?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()
  if (bearer) return bearer
  return new URL(req.url).searchParams.get('key')?.trim() || undefined
}

export function checkAuth(req: Request, expected = process.env.BLOG_MCP_TOKEN): AuthResult {
  // Falha fechada: sem token configurado, ninguém entra.
  if (!expected || expected.length < 24) {
    return {
      ok: false,
      status: 503,
      message: 'MCP do blog desativado: configure BLOG_MCP_TOKEN (mín. 24 caracteres).',
    }
  }
  const token = extractToken(req)
  if (!token || !safeEqual(token, expected)) {
    return { ok: false, status: 401, message: 'Token inválido ou ausente.' }
  }
  return { ok: true }
}
