import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Carrega segredos locais (.env.local tem precedência; .env como fallback).
config({ path: '.env.local' });
config();

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  // DDL deve rodar na conexão DIRETA/UNPOOLED (PgBouncer transaction pooling
  // quebra migrations). Localmente é igual à DATABASE_URL.
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '',
  },
});
