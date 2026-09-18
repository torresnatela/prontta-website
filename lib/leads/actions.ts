'use server';

import { insertLead } from '@/lib/db/queries/leads';
import { gateLeadSchema } from './schemas';

export interface SaveLeadResult {
  ok: boolean;
  /** Mensagem de validação para mostrar no formulário. */
  error?: string;
}

/**
 * Grava o lead do gate do simulador. Pública (o visitante não está logado):
 * valida tudo no servidor e não devolve nada além de ok/erro.
 *
 * Falha de banco vira `ok: false` sem mensagem — o gate segue para o
 * simulador mesmo assim, porque perder o lead é melhor do que barrar o
 * visitante numa página que era só um passo intermediário.
 */
export async function saveGateLead(input: unknown): Promise<SaveLeadResult> {
  const parsed = gateLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' };
  }

  const { name, phone, cnpj, segment } = parsed.data;
  try {
    await insertLead({ name, phone, cnpj: cnpj ?? null, segment, consentAt: new Date() });
    return { ok: true };
  } catch (err) {
    console.error('[leads] falha ao gravar lead do gate:', err);
    return { ok: false };
  }
}
