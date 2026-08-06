import { getProgramRepasse, type Cycle } from '@/lib/pricing';
import { siteConfig } from '@/lib/site-config';
import {
  DEFAULT_ACADEMIA_CYCLE,
  DEFAULT_ACADEMIA_PROGRAM_ID,
  getAcademiaProgram,
  isAcademiaCycle,
  isAcademiaProgramId,
  type AcademiaProgramId,
} from './catalog';

/**
 * Query params de `/academias/programas` — o link que a academia distribui.
 *
 * ⚠️ Estes valores vêm de uma URL PÚBLICA e controlável por qualquer visitante.
 * `getProgram`/`getSpecialty` LANÇAM em id desconhecido, e um ciclo inválido
 * viraria `PLATFORM_FEE_BY_CYCLE[c] === undefined` → "R$ NaN" na tela.
 * Por isso `parseOfferParams` é TOTAL: nunca lança, sempre devolve algo válido.
 */

export interface AcademiaOfferParams {
  programa: AcademiaProgramId;
  ciclo: Cycle;
  /** Mensalidade definida pela academia. `null` = usar o preço sugerido pelo engine. */
  preco: number | null;
}

/** Teto defensivo: acima disso o layout quebra e o valor é claramente lixo. */
export const MAX_OFFER_MONTHLY_PRICE = 20_000;

export const DEFAULT_OFFER_PARAMS: AcademiaOfferParams = {
  programa: DEFAULT_ACADEMIA_PROGRAM_ID,
  ciclo: DEFAULT_ACADEMIA_CYCLE,
  preco: null,
};

type RawSearchParams = Record<string, string | string[] | undefined>;

/** `?ciclo=6&ciclo=12` chega como array — fica com o primeiro. */
function firstValue(raw: string | string[] | undefined): string | undefined {
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

/** Mensalidade mínima aceitável: nunca anunciar abaixo do repasse à Prontta. */
export function minMonthlyPrice(programa: AcademiaProgramId, ciclo: Cycle): number {
  return getProgramRepasse(programa, ciclo) / ciclo;
}

function parsePrice(
  raw: string | undefined,
  programa: AcademiaProgramId,
  ciclo: Cycle,
): number | null {
  if (raw === undefined || raw.trim() === '') return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  const clamped = Math.min(MAX_OFFER_MONTHLY_PRICE, Math.max(minMonthlyPrice(programa, ciclo), parsed));
  return Math.round(clamped * 100) / 100;
}

/** Nunca lança. Qualquer entrada inválida cai no default. */
export function parseOfferParams(searchParams: RawSearchParams): AcademiaOfferParams {
  const rawPrograma = firstValue(searchParams.programa);
  const programa = isAcademiaProgramId(rawPrograma) ? rawPrograma : DEFAULT_ACADEMIA_PROGRAM_ID;

  const rawCiclo = firstValue(searchParams.ciclo);
  const cicloNumber = rawCiclo === undefined ? NaN : Number(rawCiclo);
  const ciclo = isAcademiaCycle(cicloNumber) ? cicloNumber : DEFAULT_ACADEMIA_CYCLE;

  return { programa, ciclo, preco: parsePrice(firstValue(searchParams.preco), programa, ciclo) };
}

/** `true` quando a URL trouxe algum parâmetro nosso (usado para decidir noindex). */
export function hasOfferParams(searchParams: RawSearchParams): boolean {
  return ['programa', 'ciclo', 'preco'].some((key) => firstValue(searchParams[key]) !== undefined);
}

export function buildOfferPath(params: AcademiaOfferParams): string {
  const query = new URLSearchParams({
    programa: params.programa,
    ciclo: String(params.ciclo),
  });
  if (params.preco !== null) {
    query.set('preco', String(Math.round(params.preco * 100) / 100));
  }
  return `/academias/programas?${query.toString()}`;
}

/**
 * URL absoluta da oferta.
 *
 * Passe `origin` (`window.location.origin`) no cliente — `siteConfig.url` aponta
 * para produção e entregaria o link errado num preview da Vercel.
 */
export function buildOfferAbsoluteUrl(params: AcademiaOfferParams, origin?: string): string {
  const base = (origin ?? siteConfig.url).replace(/\/$/, '');
  return `${base}${buildOfferPath(params)}`;
}

/** Mensagem pré-preenchida do WhatsApp na página do associado. */
export function buildAssociadoWhatsAppMessage(
  params: AcademiaOfferParams,
  monthlyPrice: number,
): string {
  const { program } = getAcademiaProgram(params.programa);
  const preco = monthlyPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
  return `Olá! Quero participar do ${program.name} (ciclo de ${params.ciclo} meses, ${preco}/mês).`;
}
