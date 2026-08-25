/**
 * Capítulos da camada explicativa das páginas /academias.
 *
 * Camada de CONTEÚDO, no mesmo espírito de `lib/academias/catalog.ts`: só dados
 * declarativos, nenhuma regra. Quem renderiza é
 * `components/simulador/shared/ExplainerSection.tsx`.
 *
 * A forma (`ExplainerChapter`) e o id placeholder são compartilhados com
 * /proposta — moram em `lib/simulador/explainer.ts`.
 *
 * ⚠️ Os vídeos ainda são PLACEHOLDER. Para publicar os definitivos, troque o
 * `youtubeId` de cada capítulo — nenhum componente precisa mudar.
 * Ver `public/academias/README.md` para a lista de pendências de mídia.
 */

import { PLACEHOLDER_YOUTUBE_ID, type ExplainerChapter } from '@/lib/simulador/explainer';

export { PLACEHOLDER_YOUTUBE_ID };
export type { ExplainerChapter };

const poster = (id: string) => `/academias/capitulos/${id}.svg`;

/** Simulador do DONO — os quatro capítulos, incluindo a DRE. */
export const SIMULADOR_CHAPTERS: readonly ExplainerChapter[] = [
  {
    id: 'visao-geral',
    title: 'Como este simulador funciona',
    summary:
      'Em três passos você monta a oferta que sua academia vai vender e vê, ao vivo, quanto sobra para você a cada mês.',
    bullets: [
      'Escolha o programa, o ciclo e o preço — o resultado recalcula a cada ajuste',
      'O painel separa o que é custo Prontta, comissão do personal e lucro da academia',
      'Nada aqui é enviado para ninguém: é uma simulação sua, no seu navegador',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '2 min',
    poster: poster('visao-geral'),
    cta: { label: 'Começar a simular', href: '#simulador' },
  },
  {
    id: 'programas',
    title: 'O que são os Programas de Saúde Assistida',
    summary:
      'Cada programa é uma jornada fechada de acompanhamento por telessaúde: médico, nutrição e psicologia trabalhando juntos em torno de um objetivo do aluno.',
    bullets: [
      'Quatro programas curados para o ambiente de academia',
      'A composição de especialistas já vem definida por programa e por ciclo',
      'Você escolhe qual oferecer — a operação clínica é toda da Prontta',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '3 min',
    poster: poster('programas'),
    cta: { label: 'Escolher o programa', href: '#simulador' },
  },
  {
    id: 'ciclo',
    title: 'O que é o ciclo de 3, 6 ou 12 meses',
    summary:
      'O ciclo é por quanto tempo o aluno fica acompanhado. Ele define quantos atendimentos entram no pacote e, por consequência, o custo por mês.',
    bullets: [
      'Inicial (3 meses), Evolução (6 meses) e Integral (12 meses)',
      'Quanto mais longo o ciclo, menor o custo Prontta por mês',
      'O ciclo de 6 meses costuma equilibrar adesão do aluno e margem da academia',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '2 min',
    poster: poster('ciclo'),
    cta: { label: 'Definir o ciclo', href: '#simulador' },
  },
  {
    id: 'dre',
    title: 'Lendo a DRE do mês',
    summary:
      'A DRE mostra o caminho completo do dinheiro: da receita bruta até o que de fato sobra no caixa da academia depois de repasse, impostos e comissões.',
    bullets: [
      'Receita bruta → (−) repasse à Prontta → (=) margem bruta',
      'A comissão do personal é despesa de venda sua, nunca repasse à Prontta',
      'A taxa de implantação não entra no resultado mensal — aparece só como payback',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '4 min',
    poster: poster('dre'),
    cta: { label: 'Ver meu resultado', href: '#resultado' },
  },
] as const;

/**
 * Página do ASSOCIADO — sem o capítulo de DRE.
 *
 * Custo Prontta, comissão e margem são informação interna da academia: a página
 * pública esconde tudo isso de propósito (ver o disclaimer em `ResultPanel.tsx`),
 * e um vídeo sobre DRE contaria justamente o que ela omite.
 */
export const PROGRAMAS_CHAPTERS: readonly ExplainerChapter[] = [
  {
    id: 'visao-geral',
    title: 'Como funciona o acompanhamento',
    summary:
      'Você entra em um programa de saúde assistida e passa a ser acompanhado por uma equipe de especialistas por telessaúde, do começo ao fim do ciclo.',
    bullets: [
      'Avaliação inicial estruturada e prontuário integrado',
      'Consultas por telessaúde com médico, nutrição e psicologia',
      'Acompanhamento contínuo — não é consulta avulsa, é jornada',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '2 min',
    poster: poster('visao-geral'),
    cta: { label: 'Ver os programas', href: '#catalogo' },
  },
  {
    id: 'programas',
    title: 'Qual programa combina com o seu objetivo',
    summary:
      'Cada programa reúne os especialistas certos para um objetivo específico. Escolha pelo que você quer alcançar, não pela lista de consultas.',
    bullets: [
      'Performance, Emagrecimento, Longevidade e Sono e Energia',
      'A composição de especialistas muda conforme o programa',
      'Dá para aceitar o pacote recomendado ou montar o seu',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '3 min',
    poster: poster('programas'),
    cta: { label: 'Ver os programas', href: '#catalogo' },
  },
  {
    id: 'ciclo',
    title: 'Por quanto tempo dura o acompanhamento',
    summary:
      'O ciclo é a duração da sua jornada. Ciclos mais longos incluem mais atendimentos e saem mais em conta por mês.',
    bullets: [
      'Inicial (3 meses), Evolução (6 meses) e Integral (12 meses)',
      'O valor por mês cai conforme o ciclo aumenta',
      'Resultado em saúde precisa de tempo — por isso o ciclo mínimo é de 3 meses',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '2 min',
    poster: poster('ciclo'),
    cta: { label: 'Comparar os ciclos', href: '#pacote' },
  },
] as const;
