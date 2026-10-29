import { createMcpHandler } from 'mcp-handler'
import { checkAuth } from '@/lib/blog-mcp/auth'
import { registerBlogTools, SERVER_INSTRUCTIONS } from '@/lib/blog-mcp/server'

/**
 * MCP (Model Context Protocol) de publicação do blog.
 *
 * URL: https://pronttasaude.com.br/api/blog/mcp — Streamable HTTP, stateless.
 * Autenticação por BLOG_MCP_TOKEN (Bearer ou ?key=). Cada publicação abre um
 * PR no GitHub. Como conectar e usar: docs/BLOG-MCP.md.
 */

export const maxDuration = 60

const mcpHandler = createMcpHandler(registerBlogTools, {
  serverInfo: { name: 'prontta-blog', version: '1.0.0' },
  instructions: SERVER_INSTRUCTIONS,
})

async function handler(req: Request): Promise<Response> {
  const auth = checkAuth(req)
  if (!auth.ok) {
    return Response.json(
      { error: auth.message },
      {
        status: auth.status,
        headers: auth.status === 401 ? { 'WWW-Authenticate': 'Bearer realm="prontta-blog"' } : {},
      },
    )
  }
  return mcpHandler(req)
}

export { handler as GET, handler as POST, handler as DELETE }
