import type { ReactNode } from 'react'
import { SectionHead, Tag } from '@/components/ui'
import { OpenSimulatorButton, type GateSegment } from '@/components/simulator-gate'

interface Door {
  segment: GateSegment
  tag: { label: string; tone: 'cyan' | 'amber' }
  icon: ReactNode
  title: string
  text: string
  bullets: { label: string; text: string }[]
  cta: string
}

const doors: Door[] = [
  {
    segment: 'clinicas',
    tag: { label: 'SIMULADOR NO AR', tone: 'cyan' },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20V9l8-5 8 5v11"
          stroke="#00B3F0"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 20v-6h6v6M12 10.5v3M10.5 12h3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Clínicas e laboratórios',
    text: 'Amplie especialidades e crie receita recorrente sobre a base de pacientes que você já atende, sem contratar médico e sem ampliar estrutura.',
    bullets: [
      { label: 'Seu ganho:', text: 'margem de revenda dos pacotes, definida por você.' },
      { label: 'No local:', text: 'a equipe do próprio estabelecimento, sob o RT dele.' },
      { label: 'Contrato:', text: 'fornecimento de tecnologia e rede.' },
    ],
    cta: 'Simular a minha margem',
  },
  {
    segment: 'academias',
    tag: { label: 'SIMULADOR NO AR', tone: 'cyan' },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 9v6M21 9v6M6.5 6.5v11M17.5 6.5v11"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path d="M6.5 12h11" stroke="#00B3F0" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: 'Academias e studios',
    text: 'Uma nova linha de receita recorrente vinda do público que já treina com você. Sem obra, sem contratar médico e sem virar estabelecimento de saúde.',
    bullets: [
      { label: 'Seu ganho:', text: 'valor fixo pela cessão do espaço.' },
      { label: 'No local:', text: 'atendente treinado, sem função clínica.' },
      { label: 'Atendimento:', text: 'integralmente por telessaúde.' },
    ],
    cta: 'Simular a minha receita',
  },
  {
    segment: 'empresas',
    tag: { label: 'GATILHO NR-1', tone: 'amber' },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 21V5.5l7-2.5v18M11 21h9V10h-9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14.5 14h2.5" stroke="#00B3F0" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: 'Empresas',
    text: 'Acesso organizado a especialista para o seu time, com registro documentável para a gestão de riscos psicossociais exigida pela nova redação da NR-1.',
    bullets: [
      { label: 'Seu ganho:', text: 'custo previsível por consulta realizada.' },
      { label: 'No local:', text: 'acesso no espaço da empresa ou pelo próprio celular.' },
      { label: 'Contrato:', text: 'empresa consumidora, com anexo de LGPD.' },
    ],
    cta: 'Calcular custo por consulta',
  },
]

export function Doors() {
  return (
    <section id="portas" className="section-padding border-t border-line bg-surface">
      <div className="container-custom">
        <SectionHead
          title="Entre pela porta do seu negócio"
          lede="Cada canal tem contrato, responsabilidade técnica e economia próprias. A página do seu segmento mostra exatamente o que muda no seu caso."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doors.map((door) => (
            <div
              key={door.segment}
              className="flex flex-col gap-4 rounded-card border border-line bg-card px-[26px] py-7"
            >
              <div className="flex items-center justify-between">
                <Tag tone={door.tag.tone}>{door.tag.label}</Tag>
                {door.icon}
              </div>
              <h3 className="heading text-2xl font-bold">{door.title}</h3>
              <p className="text-[15.5px] text-ink-2">{door.text}</p>
              <div className="h-px bg-line-2" />
              <div className="flex flex-col gap-2.5 text-sm leading-[1.5] text-ink-2">
                {door.bullets.map((bullet) => (
                  <div key={bullet.label} className="flex gap-[9px]">
                    <i className="font-bold not-italic text-cyan">·</i>
                    <span>
                      <b className="font-semibold text-ink">{bullet.label}</b> {bullet.text}
                    </span>
                  </div>
                ))}
              </div>
              <OpenSimulatorButton
                segment={door.segment}
                size="sm"
                className="mt-auto w-full sm:w-auto"
              >
                {door.cta}
              </OpenSimulatorButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
