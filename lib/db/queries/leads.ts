import 'server-only';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leads, type Lead, type NewLead } from '@/lib/db/schema';

export async function insertLead(data: NewLead): Promise<{ id: string }> {
  const [row] = await db.insert(leads).values(data).returning({ id: leads.id });
  return row;
}

/** Mais recentes primeiro. `limit` evita carregar a tabela inteira no painel. */
export async function listLeads(limit = 200): Promise<Lead[]> {
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}
