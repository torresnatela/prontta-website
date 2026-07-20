import type { Cycle, Program } from './types';

type CompositionSpec = Array<[string, number]>;

/**
 * Linha Prontta Saúde Assistida — 12 programas.
 * Fonte: HTML oficial "Prontta_Landing_Prontta_Oficial_10" (mesmo racional da planilha oficial).
 * Os números por ciclo são o CUSTO-BASE do programa (não o preço final). O preço ao paciente é
 * derivado pelo engine: ceil((custoBase + fee de plataforma) ÷ (1 − margem), 50).
 * Todos os ciclos incluem a IA Prontta de pré-triagem e o fee de plataforma.
 */
const program = (
  id: string,
  name: string,
  description: string,
  channels: string[],
  costs: [number, number, number],
  compositions: [CompositionSpec, CompositionSpec, CompositionSpec],
): Program => {
  const cycles: Cycle[] = [3, 6, 12];
  return {
    id,
    name,
    description,
    channels,
    costByCycle: { 3: costs[0], 6: costs[1], 12: costs[2] },
    compositionByCycle: cycles.reduce(
      (acc, cycle, i) => {
        acc[cycle] = compositions[i].map(([specialtyId, quantity]) => ({ specialtyId, quantity }));
        return acc;
      },
      {} as Program['compositionByCycle'],
    ),
  };
};

export const PROGRAMS: Program[] = [
  program(
    'performance',
    'Prontta Performance',
    'Para quem treina, quer treinar melhor ou está começando. Cuidado clínico, nutricional e emocional dentro do canal onde a pessoa já é cliente.',
    ['Academias e studios', 'Cross training e centros de performance', 'Clínicas de estética corporal'],
    [844, 1485, 2532],
    [
      [['cardiologia-adulto', 1], ['endocrinologia', 1], ['nutricao', 2], ['psicologia-adulto', 6]],
      [['cardiologia-adulto', 1], ['endocrinologia', 2], ['nutricao', 3], ['psicologia-adulto', 12]],
      [['cardiologia-adulto', 2], ['endocrinologia', 4], ['nutricao', 6], ['psicologia-adulto', 18]],
    ],
  ),
  program(
    'emagrecimento-inteligente',
    'Prontta Emagrecimento Inteligente',
    'Emagrecimento com acompanhamento médico, nutricional e emocional, sem improviso e sem abandono no meio do caminho.',
    ['Academias', 'Clínicas e farmácias', 'Empresas e centros de estética'],
    [714, 1355, 2272],
    [
      [['endocrinologia', 1], ['nutricao', 2], ['psicologia-adulto', 6]],
      [['endocrinologia', 2], ['nutricao', 3], ['psicologia-adulto', 12]],
      [['endocrinologia', 4], ['nutricao', 6], ['psicologia-adulto', 18]],
    ],
  ),
  program(
    'mente-em-equilibrio',
    'Prontta Mente em Equilíbrio',
    'Cuidado emocional acessível, contínuo e assistido para ansiedade, estresse, esgotamento e sobrecarga.',
    ['Empresas e saúde corporativa', 'Clínicas e academias', 'Farmácias'],
    [568, 1136, 1910],
    [
      [['psicologia-adulto', 6], ['psiquiatria-adulto', 1]],
      [['psicologia-adulto', 12], ['psiquiatria-adulto', 2]],
      [['psicologia-adulto', 18], ['psiquiatria-adulto', 4], ['medico-generalista', 1]],
    ],
  ),
  program(
    'desenvolvimento-infantil',
    'Prontta Desenvolvimento Infantil',
    'Jornada assistida para organizar a investigação, orientar os pais e acompanhar crianças com suspeitas ou diagnósticos de autismo, TDAH, atrasos de fala e alterações comportamentais.',
    ['Clínicas e escolas', 'Farmácias com sala clínica', 'Empresas com benefício familiar'],
    [1636, 3272, 5274],
    [
      [['pediatria', 1], ['neuropediatria', 1], ['psicologia-infantil', 6], ['fonoaudiologia', 3], ['psiquiatria-infantil', 1]],
      [['pediatria', 2], ['neuropediatria', 2], ['psicologia-infantil', 12], ['fonoaudiologia', 6], ['psiquiatria-infantil', 2]],
      [['pediatria', 3], ['neuropediatria', 3], ['psicologia-infantil', 18], ['fonoaudiologia', 12], ['psiquiatria-infantil', 3]],
    ],
  ),
  program(
    'desenvolvimento-adolescente',
    'Prontta Desenvolvimento Adolescente',
    'Apoio especializado para adolescentes com desafios emocionais, comportamentais, escolares, de atenção, autoestima e desenvolvimento.',
    ['Escolas e clínicas', 'Empresas com benefício familiar', 'Farmácias'],
    [1220, 2440, 3627],
    [
      [['pediatria', 1], ['psiquiatria-infantil', 1], ['psicologia-infantil', 6], ['endocrinologia', 1]],
      [['pediatria', 2], ['psiquiatria-infantil', 2], ['psicologia-infantil', 12], ['endocrinologia', 2]],
      [['pediatria', 2], ['psiquiatria-infantil', 3], ['psicologia-infantil', 18], ['endocrinologia', 4]],
    ],
  ),
  program(
    'mulher-plena',
    'Prontta Mulher Plena',
    'Equilíbrio hormonal, metabólico e emocional para a mulher viver melhor em cada fase da vida.',
    ['Clínicas ginecológicas e laboratórios', 'Farmácias e academias', 'Empresas'],
    [844, 1745, 2792],
    [
      [['ginecologia-obstetricia', 1], ['endocrinologia', 1], ['nutricao', 2], ['psicologia-adulto', 6]],
      [['cardiologia-adulto', 1], ['ginecologia-obstetricia', 2], ['endocrinologia', 2], ['nutricao', 3], ['psicologia-adulto', 12]],
      [['cardiologia-adulto', 1], ['ginecologia-obstetricia', 3], ['endocrinologia', 4], ['nutricao', 6], ['psicologia-adulto', 18]],
    ],
  ),
  program(
    'fertilidade-e-vida',
    'Prontta Fertilidade e Vida',
    'Preparação integrada para mulheres e casais que desejam cuidar da saúde antes e durante a jornada de fertilidade.',
    ['Clínicas ginecológicas e laboratórios', 'Farmácias e empresas', 'Clínicas populares e premium'],
    [974, 1745, 2792],
    [
      [['ginecologia-obstetricia', 2], ['endocrinologia', 1], ['nutricao', 2], ['psicologia-adulto', 6]],
      [['ginecologia-obstetricia', 3], ['endocrinologia', 2], ['nutricao', 3], ['psicologia-adulto', 12]],
      [['ginecologia-obstetricia', 4], ['endocrinologia', 4], ['nutricao', 6], ['psicologia-adulto', 18]],
    ],
  ),
  program(
    'respirar-livre',
    'Prontta Respirar Livre',
    'Parar de fumar com apoio médico, emocional e acompanhamento inteligente para reduzir recaídas.',
    ['Empresas e programas ocupacionais', 'Farmácias e clínicas', 'Cooperativas'],
    [877, 1681, 2631],
    [
      [['pneumologia', 1], ['psiquiatria-adulto', 1], ['psicologia-adulto', 6], ['nutricao', 2]],
      [['pneumologia', 2], ['psiquiatria-adulto', 2], ['psicologia-adulto', 12], ['nutricao', 3]],
      [['pneumologia', 3], ['psiquiatria-adulto', 3], ['psicologia-adulto', 18], ['nutricao', 6]],
    ],
  ),
  program(
    'saude-capilar',
    'Prontta Saúde Capilar',
    'Investigação, cuidado e autoestima: saúde dos fios de dentro para fora.',
    ['Clínicas dermatológicas e de estética', 'Hospitais de transplante capilar', 'Farmácias e laboratórios'],
    [536, 869, 1478],
    [
      [['dermatologia', 2], ['endocrinologia', 1], ['nutricao', 2]],
      [['dermatologia', 3], ['endocrinologia', 2], ['nutricao', 3]],
      [['dermatologia', 4], ['endocrinologia', 4], ['nutricao', 6]],
    ],
  ),
  program(
    'longevidade-ativa',
    'Prontta Longevidade Ativa',
    'Prevenção, vitalidade e acompanhamento para viver mais, melhor e com autonomia.',
    ['Academias e laboratórios', 'Clínicas e farmácias', 'Empresas e cooperativas'],
    [974, 1745, 2955],
    [
      [['geriatria', 1], ['cardiologia-adulto', 1], ['endocrinologia', 1], ['nutricao', 2], ['psicologia-adulto', 6]],
      [['geriatria', 2], ['cardiologia-adulto', 1], ['endocrinologia', 2], ['nutricao', 3], ['psicologia-adulto', 12]],
      [['geriatria', 3], ['cardiologia-adulto', 1], ['endocrinologia', 4], ['nutricao', 6], ['psicologia-adulto', 18], ['neurologia-adulto', 1]],
    ],
  ),
  program(
    'coracao-em-dia',
    'Prontta Coração em Dia',
    'Prevenção cardiovascular acessível e acompanhada: cuidar antes que a urgência apareça.',
    ['Academias e laboratórios', 'Farmácias e empresas', 'Clínicas'],
    [844, 1485, 2272],
    [
      [['cardiologia-adulto', 2], ['nutricao', 2], ['psicologia-adulto', 6]],
      [['cardiologia-adulto', 3], ['nutricao', 3], ['psicologia-adulto', 12]],
      [['cardiologia-adulto', 4], ['nutricao', 6], ['psicologia-adulto', 18]],
    ],
  ),
  program(
    'sono-e-energia',
    'Prontta Sono e Energia',
    'Cuidado integrado para recuperar disposição, foco, sono e equilíbrio.',
    ['Empresas e qualidade de vida', 'Academias e clínicas', 'Farmácias'],
    [790, 1507, 2663],
    [
      [['medico-generalista', 1], ['endocrinologia', 1], ['nutricao', 2], ['psicologia-adulto', 6]],
      [['medico-generalista', 2], ['endocrinologia', 2], ['nutricao', 3], ['psicologia-adulto', 12]],
      [['medico-generalista', 3], ['endocrinologia', 4], ['nutricao', 6], ['psicologia-adulto', 18], ['neurologia-adulto', 1]],
    ],
  ),
];

export function getProgram(programId: string): Program {
  const found = PROGRAMS.find((p) => p.id === programId);
  if (!found) {
    throw new Error(`Programa desconhecido: ${programId}`);
  }
  return found;
}
