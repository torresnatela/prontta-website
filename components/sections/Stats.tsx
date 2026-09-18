import { Note } from '@/components/ui'

const stats = [
  { value: '+25', label: 'especialidades médicas na rede credenciada' },
  { value: '12', label: 'Programas de Saúde Assistida pré-estabelecidos' },
  { value: '3 · 6 · 12', label: 'meses de ciclo em cada programa' },
  { value: '~10 mil', label: 'atendimentos/mês na operação da Renovi' },
]

export function Stats() {
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="mb-[22px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value}>
              <b className="block font-display text-[38px] font-extrabold tracking-[-0.02em]">
                {stat.value}
              </b>
              <span className="text-[14.5px] text-ink-2">{stat.label}</span>
            </div>
          ))}
        </div>
        <Note>
          Rede credenciada formada por médicos com registro ativo no respectivo Conselho Regional de
          Medicina, atuando com autonomia técnica e ética plena. Volume de atendimentos referente à
          operação da Renovi, sócia operadora da Prontta, referência [MÊS/ANO].
        </Note>
      </div>
    </section>
  )
}
