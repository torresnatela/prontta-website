import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, type User } from '@/lib/db/schema';
import { SESSION_COOKIE, verifySessionToken, type SessionClaims } from './session';

/** Lê a sessão do cookie e valida a assinatura. NÃO consulta o banco. */
export async function getSession(): Promise<SessionClaims | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * Usuário atual com dados FRESCOS do banco (role atual etc.). Retorna null se
 * não houver sessão válida ou se o usuário do token não existir mais.
 * Memoizado por request (React cache) para deduplicar a query entre layout+page.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session) return null;
  const [user] = await db.select().from(users).where(eq(users.id, session.sub)).limit(1);
  return user ?? null;
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/** Exige admin — relê a role do banco (não confia no claim do JWT). */
export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/painel');
  return user;
}
