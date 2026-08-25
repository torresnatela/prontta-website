import { config } from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

// Script standalone (roda via tsx, fora do Next). Carrega env manualmente.
config({ path: '.env.local' });
config();

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL(_UNPOOLED) não definida — veja .env.example.');

  const pool = new Pool({ connectionString: url, max: 1 });
  const db = drizzle(pool);

  console.log('[db] aplicando migrations…');
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  console.log('[db] migrations aplicadas com sucesso.');

  await pool.end();
}

main().catch((err) => {
  console.error('[db] falha ao migrar:', err);
  process.exit(1);
});
