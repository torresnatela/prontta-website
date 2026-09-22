import { ButtonLink, Eyebrow } from '@/components/ui'
import { OpenSimulatorButton } from '@/components/simulator-gate'

const journey = [
  {
    title: 'Pré-triagem por IA',
    text: 'Organiza a jornada e direciona à especialidade certa. Não emite diagnóstico.',
  },
  {
    title: 'Acesso no ponto parceiro',
    text: 'A pessoa é recebida onde já é cliente, ou acessa pelo próprio celular.',
  },
  {
    title: 'Consulta com o especialista',
    text: 'Médico da rede credenciada, com autonomia técnica plena.',
  },
  {
    title: 'Programa e acompanhamento',
    text: 'Consultas em sequência definida, com retornos em ciclos de 3, 6 ou 12 meses.',
  },
]

export function Hero() {
  return (
    // A partir de 1280px o hero ocupa os 1200px inteiros (sem o respiro lateral
    // das demais seções), como no layout aprovado; entre 1024 e 1279px o
    // container ainda não tem margem própria e o padding continua.
    <section
      id="topo"
      className="container-custom grid grid-cols-1 items-start gap-10 pb-12 pt-14 lg:grid-cols-[1.32fr_1fr] lg:gap-16 lg:pb-[72px] lg:pt-20 xl:px-0"
    >
      <div className="flex flex-col gap-6">
        <Eyebrow>Healthtech B2B e B2C · Telessaúde assistida</Eyebrow>
        <h1 className="heading text-[clamp(34px,4.4vw,58px)] font-extrabold">
          Saúde especializada dentro do lugar que as pessoas já frequentam.
        </h1>
        <p className="max-w-[600px] text-[19px] text-ink-2">
          A Prontta é a infraestrutura que leva atendimento com médicos especialistas para dentro de
          clínicas, academias e empresas, em Programas de Saúde Assistida de 3, 6 e 12 meses, com
          receita recorrente para o parceiro.
        </p>
        <p className="text-[16px] text-ink-3">
          Sem contratar médico. Sem obra. Sem virar plano de saúde.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <OpenSimulatorButton className="w-full sm:w-auto">
            Simular a minha proposta
          </OpenSimulatorButton>
          <ButtonLink href="#como-funciona" variant="ghost" className="w-full sm:w-auto">
            Ver como funciona
          </ButtonLink>
        </div>
      </div>

      <div className="flex flex-col gap-[18px] rounded-[18px] bg-band px-7 py-[30px]">
        <div className="flex items-center justify-between">
          <span className="font-display text-[15px] font-bold text-white">A jornada Prontta</span>
          <svg width="78" height="20" viewBox="0 0 78 20" fill="none" aria-hidden="true">
            <path
              d="M0 10h16l4-8 6 16 5-12 4 6 5-3 4 1h34"
              stroke="#00B3F0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {journey.map((item, index) => (
          <div
            key={item.title}
            className="flex gap-3.5 rounded-[11px] bg-band-card px-[17px] py-[15px]"
          >
            <span className="min-w-[20px] font-display text-[13px] font-bold text-cyan">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <b className="mb-[3px] block text-[15px] font-semibold text-band-ink">{item.title}</b>
              <span className="text-[13.5px] leading-[1.5] text-band-ink-2">{item.text}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
