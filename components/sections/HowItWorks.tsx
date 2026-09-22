import Image from 'next/image'
import { Note, SectionHead } from '@/components/ui'
import clinica from '@/public/home/como-funciona-clinica.jpg'
import academia from '@/public/home/como-funciona-academia.jpg'
import empresa from '@/public/home/como-funciona-empresa.jpg'

const steps = [
  {
    title: 'Pré-triagem por IA',
    text: 'A pessoa responde a um roteiro estruturado. A IA organiza a jornada e indica a especialidade adequada. Ela não emite diagnóstico.',
  },
  {
    title: 'Acolhimento e acesso',
    text: 'No ponto parceiro, uma pessoa da equipe recepciona, organiza o acesso à sala e garante a privacidade do atendimento.',
  },
  {
    title: 'Consulta com o especialista',
    text: 'Atendimento por telessaúde com médico da rede credenciada. O ato médico é de responsabilidade exclusiva do profissional que o pratica.',
  },
  {
    title: 'Programa e continuidade',
    text: 'Consultas em sequência definida, retornos e acompanhamento ao longo de 3, 6 ou 12 meses, dentro do programa contratado.',
  },
]

/** Linhas da tabela "dois modos de operação": rótulo, ponto de acesso, estabelecimento parceiro. */
const modes = [
  [
    'Quem está no local',
    'Atendente treinado, sem função clínica',
    'A equipe do próprio parceiro, sob o RT dele',
  ],
  [
    'Ato de saúde presencial',
    'Não ocorre. O atendimento é integralmente por telessaúde',
    'Dentro do escopo da licença sanitária e do RT do parceiro',
  ],
  [
    'Remuneração do parceiro',
    'Valor fixo pela cessão do espaço, nunca comissão por consulta',
    'Margem de revenda dos pacotes, faturados sob o RT dele',
  ],
  [
    'Equipamento no espaço',
    'Somente terminal de acesso. Nada que meça o corpo',
    'O que a licença sanitária do parceiro já cobre',
  ],
]

const illustrations = [
  {
    src: clinica,
    alt: 'Paciente acolhida pela equipe do estabelecimento durante atendimento com especialista por telessaúde',
    caption:
      'Em clínica, a equipe do próprio estabelecimento acolhe o paciente, sob a responsabilidade técnica da clínica.',
  },
  {
    src: academia,
    alt: 'Aluna em sala reservada de academia durante atendimento com especialista por telessaúde',
    caption:
      'Em academia, uma sala reservada com terminal de acesso. Nenhum ato de saúde presencial acontece ali.',
  },
  {
    src: empresa,
    alt: 'Colaborador em atendimento com especialista por telessaúde dentro da empresa',
    caption:
      'Na empresa, o acesso acontece no espaço cedido pela companhia ou pelo próprio celular.',
  },
]

// Cabeçalhos das duas colunas de valor. No desktop ficam na linha de topo;
// abaixo de 1024px a linha some e cada célula repete o seu cabeçalho como
// rótulo, senão os valores empilhados perdem a referência de coluna.
const columnHeads = [
  'Ponto de acesso: academia, empresa',
  'Estabelecimento parceiro: clínica, laboratório',
]

// Células da tabela: padding e altura de linha são iguais; o que muda é peso,
// tamanho e cor — por isso cada variante monta a própria string.
const cellBase = 'px-5 py-3 leading-[1.5] lg:px-[22px] lg:py-4'
const cellBody = `${cellBase} text-[14.5px] text-ink-2`
const cellLabel = `${cellBase} text-[14.5px] font-semibold text-ink max-lg:bg-surface-2 max-lg:pt-[18px]`
const cellHead = `${cellBase} font-display text-[15px] font-bold text-ink`
const cellHeadLabel = `${cellBase} font-sans text-[12.5px] font-semibold tracking-[0.07em] text-ink-3`
const cellMobileHead = 'mb-1 block text-[12px] font-semibold tracking-[0.07em] text-ink-3 lg:hidden'

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section-padding">
      <div className="container-custom">
        <SectionHead
          title="Como funciona, em quatro passos"
          lede="O mesmo desenho em todos os canais. O que muda é quem está no local e quem responde pelo ato de saúde."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col gap-[9px] rounded-[14px] bg-surface-2 p-6"
            >
              <em className="font-display text-[12.5px] font-bold not-italic tracking-[0.08em] text-cyan-ink">
                PASSO {String(index + 1).padStart(2, '0')}
              </em>
              <b className="font-display text-[19px] font-bold">{step.title}</b>
              <span className="text-[14.5px] text-ink-2">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-card border border-line">
          <div className="grid grid-cols-1 bg-surface-2 lg:grid-cols-[1fr_1.25fr_1.25fr]">
            <div className={cellHeadLabel}>DOIS MODOS DE OPERAÇÃO</div>
            {columnHeads.map((head) => (
              <div key={head} className={`${cellHead} hidden lg:block`}>
                {head}
              </div>
            ))}
          </div>
          {modes.map(([label, ...values]) => (
            <div
              key={label}
              className="grid grid-cols-1 border-t border-line-2 lg:grid-cols-[1fr_1.25fr_1.25fr]"
            >
              <div className={cellLabel}>{label}</div>
              {values.map((value, index) => (
                <div key={columnHeads[index]} className={cellBody}>
                  <span className={cellMobileHead}>{columnHeads[index]}</span>
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {illustrations.map((figure) => (
            <figure key={figure.caption} className="m-0">
              <Image
                src={figure.src}
                alt={figure.alt}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                className="aspect-[4/3] h-auto w-full rounded-[14px] border border-line object-cover"
              />
              <figcaption className="mt-2.5 text-[13.5px] leading-[1.5] text-ink-3">
                {figure.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        <Note className="mt-5">
          Imagens ilustrativas, produzidas para demonstrar o formato de atendimento. Não retratam
          pacientes reais nem consultas reais.
        </Note>
      </div>
    </section>
  )
}
