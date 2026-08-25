/**
 * Capítulos da camada explicativa de /proposta.
 *
 * Camada de CONTEÚDO, no mesmo espírito de `lib/proposal-content.ts`: só dados
 * declarativos, nenhuma regra. Quem renderiza é
 * `components/simulador/shared/ExplainerSection.tsx`.
 *
 * O público aqui é o PARCEIRO COMERCIAL montando uma proposta — não o dono da
 * academia (`lib/academias/videos.ts`). Por isso os capítulos falam de consulta
 * avulsa, plantão, margem e PDF, vocabulário que não existe do outro lado.
 *
 * ⚠️ Os vídeos ainda são PLACEHOLDER. Para publicar os definitivos, troque o
 * `youtubeId` de cada capítulo — nenhum componente precisa mudar.
 * Ver `public/proposta-midia/README.md` para a lista de pendências de mídia.
 */

import { PLACEHOLDER_YOUTUBE_ID, type ExplainerChapter } from '@/lib/simulador/explainer';

/**
 * Foto de fundo do hero. Ainda PLACEHOLDER — ver `public/proposta/README.md`.
 * Trocar por foto real é editar esta linha e a extensão do arquivo.
 */
export const PROPOSTA_HERO_IMAGE = '/proposta-midia/hero-proposta.svg';

const poster = (id: string) => `/proposta-midia/capitulos/${id}.svg`;

export const PROPOSTA_CHAPTERS: readonly ExplainerChapter[] = [
  {
    id: 'visao-geral',
    title: 'Como montar uma proposta aqui',
    summary:
      'Você escolhe sua margem, monta o mix de consultas e programas, ajusta seus custos e sai com a proposta pronta em PDF.',
    bullets: [
      'O mesmo racional da planilha oficial de precificação — nada é estimado por fora',
      'Cada ajuste recalcula o total e o seu resultado no painel ao lado',
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
      'Cada linha da tabela é uma especialidade com plano e agenda próprios. O plano define quantas consultas cabem numa hora médica — e, por consequência, o custo.',
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
      'O preço sugerido ao paciente é o de tabela; o que você cobra vem da sua margem',
      'Programas não pagam software mensal, só o fee de plataforma por ciclo',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '3 min',
    poster: poster('programas'),
    cta: { label: 'Ir para os programas', href: '#passo-programas' },
  },
  {
    id: 'dre',
    title: 'Lendo o seu resultado',
    summary:
      'A DRE parte do total da simulação, tira o repasse à Prontta, seus impostos e suas despesas, e mostra o que sobra no mês.',
    bullets: [
      'Repasse à Prontta é a soma do custo de todas as linhas, consultas e programas',
      'Impostos e despesas são seus e editáveis — os padrões são só um ponto de partida',
      'A margem líquida some ou aparece conforme você mexe na margem lá em cima',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '4 min',
    poster: poster('dre'),
    cta: { label: 'Ver o resultado', href: '#resultado' },
  },
  {
    id: 'pdf',
    title: 'Gerando a proposta em PDF',
    summary:
      'O PDF sai com a sua marca de consultor, as tabelas completas de custo e margem, a simulação de resultado e o bloco de segurança jurídica.',
    bullets: [
      'Preencha seus dados de consultor antes de gerar — eles entram na página de contato',
      'As tabelas mostram custo unitário, custo total e a sua margem em R$ e %',
      'O PDF congela os preços do momento: uma proposta salva não muda depois',
    ],
    youtubeId: PLACEHOLDER_YOUTUBE_ID,
    durationLabel: '2 min',
    poster: poster('pdf'),
    cta: { label: 'Ir para os seus dados', href: '#passo-vendedor' },
  },
];
