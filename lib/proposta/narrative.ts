import type { ClientType } from '@/lib/pricing';
import type { ServiceModel } from '@/lib/empresa/pricing';
import type { ProposalMode } from './mode';

/**
 * O contrato de CONTEÚDO das seções institucionais da proposta.
 *
 * As seções (escopo, responsabilidades, compliance, riscos, hero) deixaram de
 * importar `PROPOSAL_CONTENT` direto para consumir esta forma — é o que permite
 * uma árvore de componentes só servindo revenda e benefício.
 *
 * O modo benefício não é um dialeto do modo revenda: metade dos itens de
 * compliance da revenda (dicotomia CFM, canal de vendas com MEI/CNPJ) não faz
 * sentido para uma empresa que compra benefício, e o que a empresa precisa
 * (não é plano de saúde, RH não vê dado clínico, não substitui ocupacional)
 * não existe do outro lado. Por isso são dois corpos de texto, um contrato.
 */

export interface NarrativeParty {
  party: string;
  description: string;
}

export interface NarrativeComplianceItem {
  title: string;
  description: string;
}

export interface NarrativeStat {
  label: string;
  value: string;
}

/**
 * Card de exemplo do hero.
 *
 * As estatísticas vêm PRÉ-FORMATADAS porque os dois modos mostram grandezas
 * diferentes — a revenda fala em receita e margem líquida, o benefício em
 * investimento e custo por colaborador. Formatar aqui evita que o componente
 * precise saber de qual modo veio o número.
 */
export interface NarrativeHeroExample {
  title: string;
  note: string;
  stats: readonly NarrativeStat[];
  disclaimer: string;
}

export interface NarrativeLegalNotes {
  /** Legenda das tabelas: o que é preço unitário nesta proposta. */
  precoUnitario: string;
  /** Ressalva do total simulado. */
  totalSimulado: string;
  /** Ressalva do bloco que fecha a conta (DRE na revenda, retorno no benefício). */
  fechamento: string;
}

export interface ProposalNarrative {
  brand: string;
  category: string;
  headline: string;
  subheadline: string;
  numEspecialistas: string;
  numEspecialidades: string;
  ciclos: string;
  positioningNotIs: string;
  aiDisclaimer: string;
  modelDescription: string;
  implantationSteps: readonly string[];
  /** Título e subtítulo da capa do PDF. */
  cover: { eyebrow: string; title: string };
  scope: { included: readonly string[]; notIncluded: readonly string[] };
  responsibilities: readonly NarrativeParty[];
  compliance: readonly NarrativeComplianceItem[];
  legalFramework: string;
  risks: string;
  holdHarmless: string;
  /** Título do bloco de hold harmless — "infraestrutura" só existe onde há sala. */
  holdHarmlessTitle: string;
  addonsNote: string;
  heroExample: NarrativeHeroExample;
  legalNotes: NarrativeLegalNotes;
  softwareRule: string;
  implantation: { label: string; note: string };
  proposalValidity: string;
  /** Cabeçalho da seção de contato — o "próximo passo" é outro em cada modo. */
  contact: { title: string; lead: string };
  cta: { primary: string; secondary: string };
  footerNote: string;
}

export interface NarrativeContext {
  mode: ProposalMode;
  clientType: ClientType;
  /** Só usado no modo benefício; a revenda ignora. */
  serviceModel: ServiceModel;
}

/* ------------------------------------------------------------------ *
 *  Resolução
 * ------------------------------------------------------------------ */

import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { getEmpresaNarrative } from '@/lib/empresa/content';
import { formatCurrency, formatPercent } from '@/lib/utils';

/**
 * Adapta o conteúdo de revenda ao contrato comum.
 *
 * `PROPOSAL_CONTENT` fica intacto — é `as const`, travado por
 * `lib/proposal-content.test.ts`, e continua sendo a fonte da revenda. Aqui só
 * damos a ele a forma que as seções passaram a consumir.
 */
function revendaNarrative(clientType: ClientType): ProposalNarrative {
  const c = PROPOSAL_CONTENT;
  const example = c.heroExample;

  return {
    brand: c.brand,
    category: c.category,
    headline: c.clientTypes[clientType].headline,
    subheadline: c.subheadline,
    numEspecialistas: c.numEspecialistas,
    numEspecialidades: c.numEspecialidades,
    ciclos: c.ciclos,
    positioningNotIs: c.positioningNotIs,
    aiDisclaimer: c.aiDisclaimer,
    modelDescription: c.modelDescription,
    implantationSteps: c.implantationSteps,
    cover: {
      eyebrow: 'Proposta Comercial',
      title: 'Programas de Saúde Assistida\ne Consultas Especializadas',
    },
    scope: c.scope,
    responsibilities: c.responsibilities,
    compliance: c.compliance,
    legalFramework: c.legalFramework,
    risks: c.risks,
    holdHarmless: c.holdHarmless,
    holdHarmlessTitle: 'Responsabilidade por infraestrutura',
    addonsNote: c.addonsNote,
    heroExample: {
      title: example.title,
      note: example.note,
      stats: [
        { label: 'Receita estimada / mês', value: formatCurrency(example.receita) },
        { label: 'Resultado líquido / mês', value: formatCurrency(example.resultadoLiquido) },
        { label: 'Margem líquida', value: formatPercent(example.margemLiquida) },
      ],
      disclaimer: example.disclaimer,
    },
    legalNotes: {
      precoUnitario: c.legalNotes.custoRepasse,
      totalSimulado: c.legalNotes.totalSimulado,
      fechamento: c.legalNotes.resultadoParceiro,
    },
    softwareRule: c.softwareRule,
    implantation: c.implantation,
    proposalValidity: c.proposalValidity,
    contact: {
      title: 'Vamos abrir o seu ponto Prontta?',
      lead: 'Responda a esta proposta para agendarmos o alinhamento, formalizar o contrato e iniciar a implantação do seu ponto de acesso.',
    },
    cta: c.cta,
    footerNote: 'Proposta comercial · válida por 30 dias',
  };
}

/** Ponto único de resolução: dado o modo, entrega o texto certo já pronto. */
export function resolveNarrative(ctx: NarrativeContext): ProposalNarrative {
  return ctx.mode === 'beneficio'
    ? getEmpresaNarrative(ctx.serviceModel)
    : revendaNarrative(ctx.clientType);
}
