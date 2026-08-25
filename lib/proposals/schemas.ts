import { z } from 'zod';
import { isValidCnpj, onlyDigits } from './cnpj';

export const PROPOSAL_STATUSES = ['lead', 'em_andamento', 'fechado', 'perdido'] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const STATUS_LABELS: Record<ProposalStatus, string> = {
  lead: 'Lead',
  em_andamento: 'Em andamento',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

/** Rótulos dos tipos de cliente (espelhados de lib/pricing ClientType). */
export const CLIENT_TYPE_LABELS: Record<string, string> = {
  academia: 'Academia',
  clinica: 'Clínica',
  farmacia: 'Farmácia',
  laboratorio: 'Laboratório',
  empresa: 'Empresa',
};

/** Transforma string vazia/whitespace em undefined (campos opcionais). */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

/** Dados da empresa-alvo capturados ao salvar a proposta. */
export const companySchema = z.object({
  razaoSocial: z.string().trim().min(2, 'Informe a razão social.'),
  cnpj: z
    .string()
    .transform(onlyDigits)
    .refine(isValidCnpj, 'CNPJ inválido.'),
  contatoNome: optionalText,
  contatoEmail: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, 'E-mail inválido.'),
  contatoTelefone: optionalText,
  observacoes: optionalText,
  status: z.enum(PROPOSAL_STATUSES).default('lead'),
});

export type CompanyInput = z.infer<typeof companySchema>;

/** Valores brutos do formulário (todos string) — validados no servidor. */
export interface CompanyFormValues {
  razaoSocial: string;
  cnpj: string;
  contatoNome: string;
  contatoEmail: string;
  contatoTelefone: string;
  observacoes: string;
  status: ProposalStatus;
}

/**
 * Validação MÍNIMA do payload do PDF que chega do cliente — só os campos que a
 * gente lê para as colunas projetadas. `passthrough` preserva o resto do
 * documento (que é gravado íntegro no `snapshot`).
 */
export const savePayloadSchema = z
  .object({
    state: z.object({ clientType: z.string() }).passthrough(),
    totals: z.object({ totalContractValue: z.number() }).passthrough(),
    dre: z.object({ resultadoLiquido: z.number() }).passthrough(),
  })
  .passthrough();

export const statusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(PROPOSAL_STATUSES),
});
