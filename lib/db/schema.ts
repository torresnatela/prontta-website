import {
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import type { ProposalState } from '@/components/proposta/state/reducer';
import type { ProposalPDFPayload } from '@/components/proposta/pdf/types';

/** Papéis de acesso. `partner` vê só as próprias propostas; `admin` vê todas. */
export const userRole = pgEnum('user_role', ['admin', 'partner']);

/** Status do funil de uma proposta. */
export const proposalStatus = pgEnum('proposal_status', [
  'lead',
  'em_andamento',
  'fechado',
  'perdido',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Guardado sempre em minúsculas (normalizado na aplicação). */
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    role: userRole('role').notNull().default('partner'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex('users_email_idx').on(t.email),
  }),
);

export const proposals = pgTable(
  'proposals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Dono/vendedor da proposta. */
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    status: proposalStatus('status').notNull().default('lead'),

    // ── Empresa-alvo (lead) ──────────────────────────────────────────────
    razaoSocial: text('razao_social').notNull(),
    /** Só dígitos (14). */
    cnpj: text('cnpj').notNull(),
    contatoNome: text('contato_nome'),
    contatoEmail: text('contato_email'),
    contatoTelefone: text('contato_telefone'),
    observacoes: text('observacoes'),

    // ── Colunas projetadas (listagem/filtros, sem parse de jsonb) ─────────
    /** Espelho de inputs.clientType. */
    clientType: text('client_type').notNull(),
    /** Espelho de snapshot.totals.totalContractValue. */
    totalContractValue: numeric('total_contract_value', { precision: 12, scale: 2 }).notNull(),
    /** Espelho de snapshot.dre.resultadoLiquido. */
    resultadoLiquido: numeric('resultado_liquido', { precision: 12, scale: 2 }).notNull(),

    // ── Documento + reprodutibilidade ────────────────────────────────────
    /** PRICING_MODEL_VERSION no momento em que a proposta foi salva. */
    pricingModelVersion: text('pricing_model_version').notNull(),
    /** ProposalState — os inputs normalizados (permite reabrir/editar). */
    inputs: jsonb('inputs').$type<ProposalState>().notNull(),
    /** ProposalPDFPayload — snapshot dos números derivados (congela o PDF). */
    snapshot: jsonb('snapshot').$type<ProposalPDFPayload>().notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userCreatedIdx: index('proposals_user_created_idx').on(t.userId, t.createdAt.desc()),
    statusIdx: index('proposals_status_idx').on(t.status),
    createdIdx: index('proposals_created_idx').on(t.createdAt.desc()),
  }),
);

/**
 * Leads capturados pelo gate do simulador no site público (nome, WhatsApp e
 * CNPJ antes de abrir /proposta/*). Sem vínculo com usuário: quem preenche é
 * o visitante, não um parceiro logado.
 */
export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    /** Só dígitos (DDD + número). */
    phone: text('phone').notNull(),
    /** Só dígitos (14) — opcional: quem ainda não tem CNPJ segue pelo WhatsApp. */
    cnpj: text('cnpj'),
    /** Segmento escolhido no gate: clinicas, academias, empresas, outros, parceiro. */
    segment: text('segment').notNull(),
    /** De onde veio o lead (hoje só 'site-gate'; deixa espaço para outras origens). */
    source: text('source').notNull().default('site-gate'),
    /** Momento em que o visitante marcou a autorização de contato (LGPD). */
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdIdx: index('leads_created_idx').on(t.createdAt.desc()),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Proposal = typeof proposals.$inferSelect;
export type NewProposal = typeof proposals.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type UserRole = (typeof userRole.enumValues)[number];
export type ProposalStatusValue = (typeof proposalStatus.enumValues)[number];
