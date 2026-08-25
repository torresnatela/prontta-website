import { config } from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from './schema';
import { hashPassword } from '../auth/password';

// Script standalone (roda via tsx, fora do Next). Carrega env manualmente.
config({ path: '.env.local' });
config();

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || 'Administrador Prontta';

  if (!url) throw new Error('DATABASE_URL não definida — veja .env.example.');
  if (!email || !password) {
    throw new Error('Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD no .env.local.');
  }
  if (password.length < 10) {
    throw new Error('SEED_ADMIN_PASSWORD deve ter no mínimo 10 caracteres.');
  }

  const pool = new Pool({ connectionString: url, max: 1 });
  const db = drizzle(pool);

  const passwordHash = await hashPassword(password);
  const inserted = await db
    .insert(users)
    .values({ email, name, passwordHash, role: 'admin' })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id, email: users.email });

  if (inserted.length) {
    console.log(`[db] admin criado: ${inserted[0].email}`);
  } else {
    console.log(`[db] admin já existia (${email}) — nada a fazer.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error('[db] falha ao rodar seed:', err);
  process.exit(1);
});
