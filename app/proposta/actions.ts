'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/current-user';
import { PRICING_MODEL_VERSION } from '@/lib/pricing';
import {
  insertProposal,
  setProposalStatus,
} from '@/lib/db/queries/proposals';
import { companySchema, savePayloadSchema, statusUpdateSchema } from '@/lib/proposals/schemas';
import type { ProposalPDFPayload } from '@/components/proposta/pdf/types';
import type { ProposalState } from '@/components/proposta/state/reducer';

export interface SaveProposalResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function saveProposal(input: {
  payload: unknown;
  company: unknown;
}): Promise<SaveProposalResult> {
  const user = await requireUser();

  const companyParsed = companySchema.safeParse(input.company);
  if (!companyParsed.success) {
    return { ok: false, error: companyParsed.error.issues[0]?.message ?? 'Dados da empresa inválidos.' };
  }

  const payloadParsed = savePayloadSchema.safeParse(input.payload);
  if (!payloadParsed.success) {
    return { ok: false, error: 'Simulação inválida. Recarregue a página e tente novamente.' };
  }

  const company = companyParsed.data;
  const payload = input.payload as ProposalPDFPayload;

  const { id } = await insertProposal({
    userId: user.id,
    status: company.status,
    razaoSocial: company.razaoSocial,
    cnpj: company.cnpj,
    contatoNome: company.contatoNome ?? null,
    contatoEmail: company.contatoEmail ?? null,
    contatoTelefone: company.contatoTelefone ?? null,
    observacoes: company.observacoes ?? null,
    // Colunas projetadas derivadas do payload; versão vem do código (autoritativa).
    clientType: payload.state.clientType,
    totalContractValue: String(payload.totals.totalContractValue),
    resultadoLiquido: String(payload.dre.resultadoLiquido),
    pricingModelVersion: PRICING_MODEL_VERSION,
    inputs: payload.state as ProposalState,
    snapshot: payload,
  });

  revalidatePath('/painel');
  return { ok: true, id };
}

export interface StatusUpdateResult {
  ok: boolean;
  error?: string;
}

export async function changeProposalStatus(input: {
  id: string;
  status: string;
}): Promise<StatusUpdateResult> {
  const user = await requireUser();

  const parsed = statusUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Dados inválidos.' };

  // Parceiro só altera as próprias; admin altera qualquer uma.
  const ownerId = user.role === 'admin' ? undefined : user.id;
  const changed = await setProposalStatus({
    id: parsed.data.id,
    status: parsed.data.status,
    ownerId,
  });

  if (!changed) return { ok: false, error: 'Proposta não encontrada.' };

  revalidatePath('/painel');
  revalidatePath(`/painel/${parsed.data.id}`);
  return { ok: true };
}
