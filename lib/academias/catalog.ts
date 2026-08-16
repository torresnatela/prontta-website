import { getProgram, type Cycle, type Program } from '@/lib/pricing';

/**
 * Catálogo curado para o nicho ACADEMIAS.
 *
 * São 4 dos 12 programas de `lib/pricing/programs.ts` — os de maior aderência ao
 * ambiente de academia. Este arquivo guarda apenas a camada COMERCIAL (tema,
 * copy, imagem); custo, composição e preço vêm sempre do engine oficial.
 *
 * ⚠️ Nunca declare valores aqui. Preço é derivado por `lib/academias/pricing.ts`.
 */

export type AcademiaProgramId =
  | 'performance'
  | 'emagrecimento-inteligente'
  | 'longevidade-ativa'
  | 'sono-e-energia';

/** Paleta do card e do tema da página (troca as custom properties do CSS). */
export type AcademiaTheme = 'blue' | 'lilac' | 'green' | 'gold';

export interface AcademiaProgramCard {
  id: AcademiaProgramId;
  /** Nome curto para chips e cards — `program.name` já traz o prefixo "Prontta". */
  shortName: string;
  /** Uma linha, voz do dono da academia. */
  tagline: string;
  /** Uma linha, voz do associado (usada na página pública). */
  publicDescription: string;
  theme: AcademiaTheme;
  /** Bullets do popover do catálogo ("O que este programa cobre"). */
  audience: readonly string[];
  /**
   * Capa 16:9 do programa. Hoje é um placeholder em SVG gerado na paleta do
   * tema — ver `public/academias/README.md` para trocar por foto real.
   */
  image: string;
  /** Fonte oficial (custos + composição). Leitura, nunca cópia. */
  readonly program: Program;
}

const card = (
  id: AcademiaProgramId,
  shortName: string,
  theme: AcademiaTheme,
  tagline: string,
  publicDescription: string,
  audience: readonly string[],
): AcademiaProgramCard => ({
  id,
  shortName,
  theme,
  tagline,
  publicDescription,
  audience,
  image: `/academias/programas/${id}.svg`,
  program: getProgram(id),
});

export const ACADEMIA_PROGRAMS: readonly AcademiaProgramCard[] = [
  card(
    'performance',
    'Performance',
    'blue',
    'Saúde clínica, nutricional e emocional para quem treina.',
    'Acompanhamento integrado para quem quer treinar melhor, melhorar a saúde e manter constância.',
    [
      'Alunos que treinam e querem evoluir com segurança',
      'Quem está voltando a treinar depois de uma pausa',
      'Times de cross training e centros de performance',
    ],
  ),
  card(
    'emagrecimento-inteligente',
    'Emagrecimento',
    'lilac',
    'Médico, nutrição e psicologia numa jornada de aderência.',
    'Uma jornada médica, nutricional e emocional para emagrecer com acompanhamento e sem abandono no meio do caminho.',
    [
      'Alunos com meta de emagrecimento',
      'Quem já tentou dieta sozinho e desistiu',
      'Público que precisa de acompanhamento contínuo',
    ],
  ),
  card(
    'longevidade-ativa',
    'Longevidade',
    'green',
    'Prevenção e vitalidade para alunos maduros e público 50+.',
    'Cuidado preventivo para envelhecer com vitalidade, autonomia e acompanhamento contínuo.',
    [
      'Alunos 50+ e turmas de musculação assistida',
      'Público de pilates e ginástica funcional',
      'Quem quer prevenção antes da urgência aparecer',
    ],
  ),
  card(
    'sono-e-energia',
    'Sono e Energia',
    'gold',
    'Recuperação, foco, sono e disposição para a rotina.',
    'Cuidado integrado para recuperar energia, melhorar o sono e retomar foco e disposição.',
    [
      'Alunos com rotina puxada e sono ruim',
      'Quem treina cedo ou tarde e vive cansado',
      'Público corporativo dentro da academia',
    ],
  ),
] as const;

export const DEFAULT_ACADEMIA_PROGRAM_ID: AcademiaProgramId = 'performance';

export const ACADEMIA_CYCLES: readonly Cycle[] = [3, 6, 12] as const;

export const DEFAULT_ACADEMIA_CYCLE: Cycle = 6;

/** Rótulo comercial de cada ciclo (mesmo vocabulário do material oficial). */
export const CYCLE_LABELS: Record<Cycle, string> = {
  3: 'Inicial',
  6: 'Evolução',
  12: 'Integral',
};

export function isAcademiaProgramId(value: unknown): value is AcademiaProgramId {
  return typeof value === 'string' && ACADEMIA_PROGRAMS.some((p) => p.id === value);
}

export function isAcademiaCycle(value: unknown): value is Cycle {
  return value === 3 || value === 6 || value === 12;
}

export function getAcademiaProgram(id: AcademiaProgramId): AcademiaProgramCard {
  const found = ACADEMIA_PROGRAMS.find((p) => p.id === id);
  if (!found) {
    throw new Error(`Programa fora do catálogo de academias: ${id}`);
  }
  return found;
}
