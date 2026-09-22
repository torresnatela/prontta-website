import { OpenSimulatorButton } from '@/components/simulator-gate'

const formats = [
  {
    title: 'Hospitais e programas pós-alta',
    text: 'Continuidade de cuidado para quem recebe alta e precisa de acompanhamento em sequência.',
  },
  {
    title: 'Pré e pós-cirúrgico',
    text: 'Preparo e acompanhamento programado dentro do estabelecimento responsável pelo procedimento.',
  },
  {
    title: 'Associações, federações e cooperativas',
    text: 'Programas para grupos fechados de associados, com condição negociada por volume.',
  },
  {
    title: 'Avaliação clínica independente',
    text: 'Para empresas que comercializam produtos sujeitos a prescrição médica e precisam de avaliação por rede sem qualquer interesse econômico no produto.',
  },
]

export function OtherFormats() {
  return (
    <section className="section-padding">
      <div className="container-custom grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-14">
        <div className="flex flex-col gap-3.5">
          <h2 className="heading text-[clamp(26px,3vw,34px)] font-extrabold">
            Outros formatos, sob análise caso a caso
          </h2>
          <p className="text-[16px] text-ink-2">
            Três canais concentram o nosso esforço hoje. Estes outros já foram estruturados ou estão
            em avaliação. Cada um exige contrato e checagem regulatória próprios antes de operar.
          </p>
          <OpenSimulatorButton
            segment="outros"
            variant="ghost"
            size="sm"
            className="mt-1.5 w-full self-start sm:w-auto"
          >
            Falar sobre um formato específico
          </OpenSimulatorButton>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {formats.map((format) => (
            <div
              key={format.title}
              className="flex flex-col gap-1.5 rounded-xl border border-line p-5"
            >
              <b className="text-[16px] font-semibold">{format.title}</b>
              <span className="text-[14px] leading-[1.5] text-ink-3">{format.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
