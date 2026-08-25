import 'server-only';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

/**
 * Cliente Drizzle único da aplicação (runtime Node — nunca importar em client
 * component nem no middleware). Um só driver `pg` serve tanto o Postgres local
 * (docker-compose) quanto o Neon em produção — o Neon aceita conexão TCP padrão;
 * em produção use o endpoint POOLED (`-pooler`) na DATABASE_URL.
 *
 * As migrations e o seed constroem o próprio pool (scripts standalone) e por
 * isso NÃO importam este módulo — mantendo o guard `server-only` intacto aqui.
 */
const globalForDb = globalThis as unknown as { __pronttaPool?: Pool };

const pool =
  globalForDb.__pronttaPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

if (process.env.NODE_ENV !== 'production') globalForDb.__pronttaPool = pool;

export const db = drizzle(pool, { schema });
export { schema };
