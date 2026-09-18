import { Eyebrow, Note, SectionHead } from '@/components/ui'

const programs = [
  { name: 'Performance', text: 'Quem treina e quer resultado com segurança' },
  { name: 'Emagrecimento Inteligente', text: 'Acompanhamento médico, nutricional e emocional' },
  { name: 'Mente em Equilíbrio', text: 'Cuidado emocional contínuo e assistido' },
  { name: 'Desenvolvimento Infantil', text: 'Acompanhamento da criança e orientação parental' },
  { name: 'Desenvolvimento Adolescente', text: 'Saúde física e emocional na adolescência' },
  { name: 'Mulher Plena', text: 'Cuidado integral em cada fase da vida' },
  { name: 'Fertilidade e Vida', text: 'Acompanhamento de quem planeja engravidar' },
  { name: 'Respirar Livre', text: 'Acompanhamento respiratório continuado' },
  { name: 'Saúde Capilar', text: 'Jornada especializada com retornos programados' },
  { name: 'Longevidade Ativa', text: 'Acompanhamento para a vida adulta madura' },
  { name: 'Coração em Dia', text: 'Acompanhamento cardiológico programado' },
  { name: 'Sono e Energia', text: 'Rotina, sono e disposição sob acompanhamento' },
]

const tailored = [
  {
    title: 'Nasce da sua base',
    text: 'A composição parte da demanda que você já observa no seu público, não de um catálogo pronto.',
  },
  {
    title: 'Leva a sua bandeira',
    text: 'O programa é apresentado dentro da sua marca e do seu posicionamento, com suporte técnico e operacional da Prontta.',
  },
  {
    title: 'Constrói autoridade',
    text: 'Concentrar em uma dor específica cria referência local muito mais rápido do que oferecer tudo para todos.',
  },
]

export function Programs() {
  return (
    <section id="programas" className="section-padding border-t border-line bg-surface">
      <div className="container-custom">
        <SectionHead
          title="Doze Programas de Saúde Assistida pré-estabelecidos"
          lede="Cada programa reúne as especialidades certas na sequência certa, em ciclos de 3, 6 e 12 meses. O parceiro escolhe quais fazem sentido para o público dele. E quando nenhum serve, a gente constrói o dele."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program) => (
            <div
              key={program.name}
              className="flex flex-col gap-[5px] rounded-xl border border-line bg-card p-[18px]"
            >
              <b className="font-display text-[16.5px] font-bold">{program.name}</b>
              <span className="text-[13.5px] leading-[1.45] text-ink-3">{program.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-9 grid grid-cols-1 gap-7 rounded-card border border-line bg-card p-7 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:p-9">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>Programa sob medida</Eyebrow>
            <h3 className="heading text-[clamp(24px,2.6vw,31px)] font-extrabold">
              Doze prontos. E o décimo terceiro, que é o seu.
            </h3>
            <p className="text-[16px] text-ink-2">
              Os doze programas pré-estabelecidos cobrem as demandas mais frequentes. Quando a dor
              do seu público não cabe em nenhum deles, a Prontta monta um programa próprio: define
              quais especialidades entram, com que frequência e em qual ciclo, a partir do perfil
              real da sua base.
            </p>
            <p className="text-[16px] text-ink-2">
              O resultado sai com o recorte do seu negócio e vira bandeira sua. É assim que uma
              clínica deixa de ser mais uma que oferece consulta e passa a ser a referência local em
              uma linha de cuidado.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            {tailored.map((item, index) => (
              <div key={item.title} className="flex gap-3.5 rounded-xl bg-surface-2 p-[18px]">
                <span className="min-w-[20px] font-display text-[13px] font-bold text-cyan-ink">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <b className="mb-1 block font-display text-[16.5px] font-bold">{item.title}</b>
                  <span className="text-[14px] leading-[1.5] text-ink-2">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Note className="mt-7 max-w-[920px]">
          A composição de um programa define especialidades, frequência e duração do acompanhamento.
          Conduta clínica, prescrição e indicação terapêutica permanecem exclusivamente do médico
          que realiza o atendimento. Os Programas de Saúde Assistida, pré-estabelecidos ou montados
          sob medida, são pacotes de serviços de telessaúde com número definido de consultas e prazo
          determinado. Não constituem plano privado de assistência à saúde nem seguro de saúde nos
          termos da Lei nº 9.656/1998 e não estão sujeitos à regulamentação da ANS.
        </Note>
      </div>
    </section>
  )
}
