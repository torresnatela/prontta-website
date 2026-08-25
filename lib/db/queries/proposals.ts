import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  proposals,
  users,
  type NewProposal,
  type Proposal,
  type ProposalStatusValue,
} from '@/lib/db/schema';

/** Colunas exibidas na listagem (sem parse de jsonb). */
const listColumns = {
  id: proposals.id,
  razaoSocial: proposals.razaoSocial,
  cnpj: proposals.cnpj,
  clientType: proposals.clientType,
  status: proposals.status,
  totalContractValue: proposals.totalContractValue,
  resultadoLiquido: proposals.resultadoLiquido,
  createdAt: proposals.createdAt,
  ownerName: users.name,
};

export type ProposalListItem = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  clientType: string;
  status: ProposalStatusValue;
  totalContractValue: string;
  resultadoLiquido: string;
  createdAt: Date;
  ownerName: string;
};

export async function insertProposal(data: NewProposal): Promise<{ id: string }> {
  const [row] = await db.insert(proposals).values(data).returning({ id: proposals.id });
  return row;
}

export async function listProposalsByUser(userId: string): Promise<ProposalListItem[]> {
  return db
    .select(listColumns)
    .from(proposals)
    .innerJoin(users, eq(users.id, proposals.userId))
    .where(eq(proposals.userId, userId))
    .orderBy(desc(proposals.createdAt));
}

export async function listAllProposals(): Promise<ProposalListItem[]> {
  return db
    .select(listColumns)
    .from(proposals)
    .innerJoin(users, eq(users.id, proposals.userId))
    .orderBy(desc(proposals.createdAt));
}

/** Proposta completa + nome do dono. Retorna null se não existir. */
export async function getProposalById(
  id: string,
): Promise<(Proposal & { ownerName: string }) | null> {
  const [row] = await db
    .select({ proposal: proposals, ownerName: users.name })
    .from(proposals)
    .innerJoin(users, eq(users.id, proposals.userId))
    .where(eq(proposals.id, id))
    .limit(1);
  return row ? { ...row.proposal, ownerName: row.ownerName } : null;
}

/**
 * Atualiza o status. Se `ownerId` for informado (parceiro), a atualização é
 * escopada ao dono — admin passa undefined e pode alterar qualquer uma.
 * Retorna true se alguma linha foi afetada.
 */
export async function setProposalStatus(params: {
  id: string;
  status: ProposalStatusValue;
  ownerId?: string;
}): Promise<boolean> {
  const where = params.ownerId
    ? and(eq(proposals.id, params.id), eq(proposals.userId, params.ownerId))
    : eq(proposals.id, params.id);

  const res = await db
    .update(proposals)
    .set({ status: params.status, updatedAt: new Date() })
    .where(where)
    .returning({ id: proposals.id });

  return res.length > 0;
}
