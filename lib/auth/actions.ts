'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginSchema } from './schemas';
import { findUserByEmail } from '@/lib/db/queries/users';
import { DUMMY_PASSWORD_HASH, verifyPassword } from './password';
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from './session';

export interface LoginResult {
  error?: string;
}

/** Garante que o destino pós-login é um caminho interno (evita open redirect). */
function sanitizeNext(next?: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  return '/painel';
}

export async function login(input: {
  email: string;
  password: string;
  next?: string;
}): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({ email: input.email, password: input.password });
  if (!parsed.success) return { error: 'Credenciais inválidas.' };

  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);

  // Sempre roda um compare (dummy quando o usuário não existe) para achatar o
  // tempo de resposta e evitar enumeração de e-mails.
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!user || !ok) return { error: 'Credenciais inválidas.' };

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());

  redirect(sanitizeNext(input.next));
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}
