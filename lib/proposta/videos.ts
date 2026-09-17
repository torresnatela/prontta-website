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
 * São três vídeos gravados de tela, na ordem em que a página é percorrida, e
 * eles são AUTO-HOSPEDADOS no Vercel Blob (store `prontta-website-midia`) — não
 * passam pelo YouTube. Para republicar um vídeo, suba o MP4 no mesmo pathname e
 * troque a URL aqui; ver `public/proposta-midia/README.md`.
 *
 * Os ids não mudaram de nome junto com os títulos de propósito: são o alvo dos
 * `<ChapterCue chapterId="…">` espalhados pelos passos, e `dre` continua sendo
 * o atalho de "Custos" e "DRE" — os dois passos que o terceiro vídeo cobre.
 */

import { ACADEMIA_HERO_IMAGE } from '@/lib/academias/catalog';
import type { ClientType } from '@/lib/pricing/types';
import type { ExplainerChapter, ExplainerVideo } from '@/lib/simulador/explainer';

/**
 * Foto de fundo do hero, por canal.
 *
 * Clínicas e academias usam a mesma foto real de /academias — decisão
 * deliberada até existir uma foto própria de clínica. Os demais canais seguem
 * com a arte gerada por script (`hero-proposta.svg`), que é o placeholder de
 * `/proposta/empresa`.
 */
const PLACEHOLDER_HERO_IMAGE = '/proposta-midia/hero-proposta.svg';

export function heroImageFor(clientType: ClientType): string {
  return clientType === 'clinica' || clientType === 'academia'
    ? ACADEMIA_HERO_IMAGE
    : PLACEHOLDER_HERO_IMAGE;
}

/** Host público do store `prontta-website-midia` (região gru1). */
const BLOB_HOST = 'https://5t8psvijsciqmqtm.public.blob.vercel-storage.com';

const video = (file: string): ExplainerVideo => ({
  kind: 'file',
  src: `${BLOB_HOST}/proposta/${file}.mp4`,
});

/** Capas: frames reais dos próprios vídeos, 16:9, sem a barra do navegador. */
const poster = (id: string) => `/proposta-midia/capitulos/${id}.jpg`;

export const PROPOSTA_CHAPTERS: readonly ExplainerChapter[] = [
  {
    id: 'visao-geral',
    title: 'Como fazer uma simulação',
    summary:
      'Do começo ao fim: você define a sua margem, monta a tabela de consultas linha a linha e vê o total ao paciente e o seu resultado recalcularem ao vivo no painel ao lado.',
    bullets: [
      'A margem sobre consultas e sobre programas é sua — o padrão é só um ponto de partida',
      'Cada linha é uma especialidade com plano e agenda próprios; agenda dedicada vem em plantões de 4 horas',
      'O painel separa o que é repasse à Prontta, software, impostos e o que sobra para você',
    ],
    video: video('como-fazer-uma-simulacao'),
    durationLabel: '3 min',
    poster: poster('visao-geral'),
    cta: { label: 'Começar a montar', href: '#simulador' },
  },
  {
    id: 'programas',
    title: 'Programas de Saúde Assistida',
    summary:
      'Como adicionar os programas à proposta: escolha o programa e o ciclo, informe a quantidade e veja custo, preço com a sua margem e subtotal por linha.',
    bullets: [
      'A composição de cada ciclo já vem pronta — você escolhe o programa e a quantidade',
      'Ciclos de 6 e 12 meses mudam o custo por paciente e a sua margem em R$',
      'Programas não pagam software mensal, só o fee de plataforma por ciclo',
    ],
    video: video('programas-de-saude'),
    durationLabel: '1 min',
    poster: poster('programas'),
    cta: { label: 'Ir para os programas', href: '#passo-programas' },
  },
  {
    id: 'dre',
    title: 'Resultado final da proposta',
    summary:
      'Informe seus custos e leia a DRE do mês: receita bruta, repasse à Prontta, margem bruta, despesas e o que fica de margem líquida — e o que entra no PDF que vai para o cliente.',
    bullets: [
      'Impostos, pessoal e despesas fixas são seus e editáveis — a DRE recalcula na hora',
      'Software mensal fica isento acima de 150 consultas/mês; programas já incluem a plataforma',
      'Seus dados de consultor entram na página de contato do PDF; em branco, sai com os dados da Prontta',
    ],
    video: video('resultado-final-da-proposta'),
    durationLabel: '2 min',
    poster: poster('dre'),
    cta: { label: 'Ver o resultado', href: '#resultado' },
  },
];
