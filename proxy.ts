import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

/**
 * Guarda as rotas privadas verificando APENAS a assinatura/expiração do JWT
 * (edge-safe, sem banco). A autorização real (role, ownership) acontece nas
 * pages e server actions via getCurrentUser()/requireAdmin(). Este proxy é
 * UX (redirect rápido), não a garantia de segurança.
 *
 * `proxy` é a convenção do Next 16 (substitui o antigo `middleware`).
 */
export async function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const claims = await verifySessionToken(token);

  if (!claims) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // ⚠️ `/proposta` e `/proposta/:path*` estão FORA do matcher de propósito: as
  // propostas são públicas por enquanto (o simulador e o PDF rodam sem login).
  // O que exige sessão é só a área logada — /painel e /admin. Ao fechar as
  // propostas de novo, basta devolver as duas linhas aqui.
  matcher: [
    '/painel',
    '/painel/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
