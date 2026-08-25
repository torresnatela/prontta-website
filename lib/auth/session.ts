import { SignJWT, jwtVerify } from 'jose';

/**
 * Sessão baseada em JWT assinado (HS256) guardado num cookie httpOnly.
 *
 * Este módulo é EDGE-SAFE de propósito — importa apenas `jose` (WebCrypto) e é
 * usado pelo middleware. Não importe banco, bcrypt nem `next/headers` aqui.
 */
export const SESSION_COOKIE = 'prontta_session';
const ALG = 'HS256';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias (em segundos)

export type SessionRole = 'admin' | 'partner';

export interface SessionClaims {
  /** id do usuário */
  sub: string;
  email: string;
  role: SessionRole;
}

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET ausente ou com menos de 32 caracteres.');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(claims: SessionClaims): Promise<string> {
  return new SignJWT({ email: claims.email, role: claims.role })
    .setProtectedHeader({ alg: ALG })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

/** Verifica apenas assinatura + expiração. Retorna null em qualquer falha. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: [ALG] });
    const role = payload.role;
    if (typeof payload.sub !== 'string') return null;
    if (role !== 'admin' && role !== 'partner') return null;
    return { sub: payload.sub, email: String(payload.email ?? ''), role };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}
