/**
 * Capítulos da camada explicativa de /proposta/empresa.
 *
 * Camada de CONTEÚDO, no mesmo espírito de `lib/proposta/videos.ts`: só dados
 * declarativos, nenhuma regra.
 *
 * O público aqui é o consultor montando uma proposta de BENEFÍCIO com o RH — e
 * por isso a lista não tem o capítulo `dre`: quem compra benefício não tem P&L
 * para ler. No lugar entram `beneficio` (custeio) e `retorno`. `ChapterCue`
 * some sozinho quando o `chapterId` não existe na lista, então nenhum
 * componente precisou mudar por causa dessa ausência.
 *
 * ⚠️ Os vídeos ainda são PLACEHOLDER. Para publicar os definitivos, troque o
 * `youtubeId` de cada capítulo — nenhum componente precisa mudar.
 */

import { PLACEHOLDER_YOUTUBE_ID, type ExplainerChapter } from '@/lib/simulador/explainer';

export const EMPRESA_HERO_IMAGE = '/proposta-midia/hero-proposta.svg';

const poster = (id: string) => `/proposta-midia/capitulos/${id}.svg`;

export const EMPRESA_CHAPTERS: readonly ExplainerChapter[] = [
  {
    id: 'visao-geral',
    title: 'Como montar uma proposta de benefício',
    summary:
      'Você descreve a empresa, monta o mix de consultas e programas, define quem paga o quê e sai com a proposta pronta em PDF.',
    bullets: [
      'A empresa compra pelo preço Prontta ao contratante — não há margem de intermediação',
      'Cada ajuste recalcula o custo por colaborador no painel ao lado',
      'Nada é enviado para ninguém: a simulação roda no seu navegador',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '2 min',
    poster: poster('visao-geral'),
    cta: { label: 'Começar a montar', href: '#simulador' },
  },
  {
    id: 'consultas',
    title: 'Consultas: plano, agenda e plantão',
    summary:
      'A bolsa de consultas que a empresa contrata por mês. O plano define quantas consultas cabem numa hora médica — e, por consequência, o preço.',
    bullets: [
      'Popular, Intermediário e Premium mudam o tempo de consulta, não o médico',
      'Agenda dedicada é comprada em plantões fechados de 4 horas médicas',
      'Acima de 150 consultas/mês o software mensal fica isento',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '3 min',
    poster: poster('consultas'),
    cta: { label: 'Ir para as consultas', href: '#passo-consultas' },
  },
  {
    id: 'programas',
    title: 'Programas de Saúde Assistida',
    summary:
      'Jornadas fechadas de acompanhamento por telessaúde, em ciclos de 3, 6 ou 12 meses, com a composição de especialistas já definida.',
    bullets: [
      'A composição de cada ciclo já vem pronta — você escolhe o programa e a quantidade',
      'O contrato é o ciclo cheio; a coluna mensal é o rateio dele no orçamento',
      'Programas não pagam software mensal, só o fee de plataforma por ciclo',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '3 min',
    poster: poster('programas'),
    cta: { label: 'Ir para os programas', href: '#passo-programas' },
  },
  {
    id: 'beneficio',
    title: 'Adesão e custeio',
    summary:
      'Quantos colaboradores podem aderir, quantos devem aderir de fato e como o custo se divide entre empresa e colaborador.',
    bullets: [
      'A adesão não muda o quanto se contrata: muda por quantas pessoas o custo se reparte',
      'Três modelos de custeio: integral pela empresa, compartilhado ou pelo colaborador',
      'Desconto em folha da parte do colaborador exige autorização dele (CLT, art. 462)',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '3 min',
    poster: poster('beneficio'),
    cta: { label: 'Ir para o custeio', href: '#passo-custeio' },
  },
  {
    id: 'retorno',
    title: 'Lendo o custo e o retorno',
    summary:
      'O custo por colaborador é o número que o RH leva para aprovação. O retorno é estimativa construída sobre as premissas da própria empresa.',
    bullets: [
      'Custo por elegível e custo por aderente respondem a perguntas diferentes',
      'Nenhuma premissa de retorno é da Prontta — todas são digitadas com o cliente',
      'A redução necessária para o benefício se pagar é aritmética, não promessa',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '4 min',
    poster: poster('retorno'),
    cta: { label: 'Ver o retorno', href: '#passo-retorno' },
  },
  {
    id: 'pdf',
    title: 'Gerando a proposta em PDF',
    summary:
      'O PDF sai com a sua marca de consultor, as tabelas de preço ao contratante, o custo do benefício e o bloco de segurança jurídica.',
    bullets: [
      'Preencha seus dados de consultor antes de gerar — eles entram na página de contato',
      'As tabelas mostram preço unitário e total, sem coluna de margem',
      'O PDF congela os preços do momento: uma proposta gerada não muda depois',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '2 min',
    poster: poster('pdf'),
    cta: { label: 'Ir para os seus dados', href: '#passo-vendedor' },
  },
];
