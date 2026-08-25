import bcrypt from 'bcryptjs';

/**
 * Hashing de senha com bcrypt (JS puro — sem binário nativo, ideal para o
 * bundling da Vercel). Roda apenas em server action / script de seed, nunca no
 * middleware. Sem `server-only` de propósito: o script de seed (standalone via
 * tsx) importa `hashPassword`.
 */
const BCRYPT_COST = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Hash descartável usado para achatar o tempo de resposta quando o e-mail não
 * existe (anti-timing / anti-enumeração no login). É um bcrypt válido de uma
 * senha aleatória fixa — o `compare` gasta ~o mesmo tempo de um usuário real.
 */
export const DUMMY_PASSWORD_HASH =
  '$2b$12$Mw6/sDF2MFi2B0XvYhKxBuQ8uETb6iztxw82FEPE5Y/6my5v3f6Em';
