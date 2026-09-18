import { z } from 'zod';
import { isValidCnpj, onlyDigits } from '@/lib/proposals/cnpj';

/** Segmentos do gate do simulador — espelho de GateSegment em components/simulator-gate. */
export const LEAD_SEGMENTS = ['clinicas', 'academias', 'empresas', 'outros', 'parceiro'] as const;
export type LeadSegment = (typeof LEAD_SEGMENTS)[number];

export const LEAD_SEGMENT_LABELS: Record<LeadSegment, string> = {
  clinicas: 'Clínica / laboratório',
  academias: 'Academia / studio',
  empresas: 'Empresa',
  outros: 'Outro formato',
  parceiro: 'Parceiro de vendas',
};

/**
 * O que o gate envia. Telefone e CNPJ chegam formatados e são reduzidos a
 * dígitos; CNPJ é opcional (quem ainda não tem segue pelo WhatsApp), mas se
 * vier precisa ser válido. O consentimento é obrigatório — sem ele não há
 * base para o contato comercial.
 */
export const gateLeadSchema = z.object({
  name: z.string().trim().min(2, 'Informe o seu nome.').max(120),
  phone: z
    .string()
    .transform(onlyDigits)
    .refine((v) => v.length >= 10 && v.length <= 13, 'Informe um WhatsApp com DDD.'),
  cnpj: z
    .string()
    .optional()
    .transform((v) => (v ? onlyDigits(v) : undefined))
    .refine((v) => v === undefined || isValidCnpj(v), 'CNPJ inválido.'),
  segment: z.enum(LEAD_SEGMENTS),
  consent: z.literal(true, { errorMap: () => ({ message: 'Marque a autorização.' }) }),
});

export type GateLeadInput = z.infer<typeof gateLeadSchema>;
