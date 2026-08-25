// @vitest-environment node
// jose assina com WebCrypto e o `instanceof Uint8Array` interno quebra sob
// jsdom (realms diferentes). Este arquivo roda no ambiente node.
import { beforeAll, describe, expect, it } from 'vitest';
import { SignJWT } from 'jose';
import { createSessionToken, verifySessionToken } from './session';

const SECRET = 'segredo-de-teste-com-mais-de-32-caracteres!!';

beforeAll(() => {
  process.env.SESSION_SECRET = SECRET;
});

function signWith(secret: string, claims: Record<string, unknown>, exp: string | number = '7d') {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('u9')
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(new TextEncoder().encode(secret));
}

describe('session', () => {
  it('assina e verifica um token válido', async () => {
    const token = await createSessionToken({ sub: 'u1', email: 'a@b.com', role: 'admin' });
    expect(await verifySessionToken(token)).toEqual({ sub: 'u1', email: 'a@b.com', role: 'admin' });
  });

  it('retorna null para token ausente', async () => {
    expect(await verifySessionToken(undefined)).toBeNull();
  });

  it('rejeita token adulterado', async () => {
    const token = await createSessionToken({ sub: 'u1', email: 'a@b.com', role: 'partner' });
    expect(await verifySessionToken(`${token}x`)).toBeNull();
  });

  it('rejeita token assinado com outro segredo', async () => {
    const foreign = await signWith('outro-segredo-com-mais-de-32-caracteres!!', { email: 'x', role: 'admin' });
    expect(await verifySessionToken(foreign)).toBeNull();
  });

  it('rejeita token expirado', async () => {
    const expired = await signWith(SECRET, { email: 'x', role: 'admin' }, Math.floor(Date.now() / 1000) - 60);
    expect(await verifySessionToken(expired)).toBeNull();
  });

  it('rejeita role desconhecida', async () => {
    const badRole = await signWith(SECRET, { email: 'x', role: 'superadmin' });
    expect(await verifySessionToken(badRole)).toBeNull();
  });
});
