import { SectionHead } from '@/components/ui'

const is = [
  'Infraestrutura B2B de telessaúde assistida para parceiros físicos.',
  'Programas com número definido de consultas e prazo determinado.',
  'IA de pré-triagem que organiza a jornada e direciona ao especialista.',
  'Rede credenciada de médicos com autonomia técnica e ética plena.',
  'Responsabilidades da Prontta, do parceiro, do médico e do paciente definidas por escrito, em contrato.',
]

const isNot = [
  'Plano de saúde, seguro-saúde ou administradora de benefícios. Não é regulado pela ANS (Lei 9.656/1998).',
  'Marketplace de consulta avulsa barata.',
  'Diagnóstico por inteligência artificial. A IA da Prontta não emite diagnóstico.',
  'Promessa ou garantia de resultado de tratamento.',
  'Venda, revenda ou intermediação de medicamento, insumo ou produto de saúde.',
]

function Check() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-[3px] shrink-0"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="#00B3F0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Cross() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-[3px] shrink-0"
    >
      <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="#FFC64D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** "O que a Prontta é e o que ela não é" — a faixa de conformidade. */
export function Compliance() {
  return (
    <section id="conformidade" className="bg-band py-14 text-band-ink sm:py-[82px]">
      <div className="container-custom">
        <SectionHead
          title="O que a Prontta é e o que ela não é"
          lede="Publicamos isso na primeira página porque é a pergunta que todo decisor cauteloso faz antes de assinar. É melhor responder aqui do que na minuta."
          ledeClassName="text-band-ink-2"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-[15px] rounded-card bg-band-card p-7">
            <span className="font-display text-[15px] font-bold tracking-[0.05em] text-cyan-stroke">
              É
            </span>
            {is.map((item) => (
              <div key={item} className="flex gap-3 text-[15.5px] leading-[1.55] text-[#E8F1F8]">
                <Check />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[15px] rounded-card bg-band-card p-7">
            <span className="font-display text-[15px] font-bold tracking-[0.05em] text-amber">
              NÃO É
            </span>
            {isNot.map((item) => (
              <div key={item} className="flex gap-3 text-[15.5px] leading-[1.55] text-[#E8F1F8]">
                <Cross />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
