import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { FinalCTA } from '@/components/sections'
import { Eyebrow } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { generateMetadata as buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqSchema, type FaqItem } from '@/lib/structured-data'

export const metadata: Metadata = buildMetadata({
  title: 'Perguntas Frequentes',
  description:
    'Tire suas dúvidas sobre a Prontta Saúde: telesaúde híbrida, modelos de agenda, prazos de implementação, redução de custos e como solicitar uma proposta.',
  path: '/faq',
})

/** Fonte única das perguntas: alimenta a UI e o FAQPage schema. */
const faqs: FaqItem[] = [
  {
    question: 'O que é a Prontta Saúde?',
    answer:
      'A Prontta Saúde é uma empresa de terceirização de serviços médicos para clínicas e hospitais. Conectamos instituições de saúde a especialistas e operamos modelos de atendimento — incluindo telesaúde híbrida — para ampliar a oferta de especialidades com qualidade e menor custo.',
  },
  {
    question: 'O que é telesaúde híbrida?',
    answer:
      'É um modelo em que o paciente é atendido presencialmente na clínica, com apoio de um profissional local, enquanto o médico especialista participa por vídeo em tempo real. Combina o exame físico e o vínculo do presencial com a conveniência e o alcance do digital.',
  },
  {
    question: 'Quais modelos de atendimento a Prontta oferece?',
    answer:
      'Três modelos: Agenda On Demand (especialistas sob demanda para picos e substituições), Agenda Dedicada (um especialista com agenda exclusiva para a clínica) e Pacotes de Atendimento (várias especialidades integradas para acompanhamento multidisciplinar).',
  },
  {
    question: 'Quanto tempo leva para implementar a operação?',
    answer:
      'A implementação costuma ser feita em poucas semanas. O processo envolve proposta, alinhamento do escopo, integração com a estrutura da clínica e acompanhamento contínuo após o início.',
  },
  {
    question: 'Como a terceirização médica reduz custos?',
    answer:
      'Você passa a oferecer especialidades sem o custo fixo de manter especialistas presenciais em tempo integral, aproveitando melhor a estrutura e a equipe que já existem. O modelo converte custo fixo em custo variável conforme a demanda.',
  },
  {
    question: 'A telesaúde é regulamentada no Brasil?',
    answer:
      'Sim. A telessaúde é reconhecida pela Lei nº 14.510/2022 e regulamentada pelo Conselho Federal de Medicina, que define as regras para o atendimento médico a distância, inclusive em modelos com apoio presencial.',
  },
  {
    question: 'Como solicitar uma proposta?',
    answer:
      'Você pode usar o simulador de proposta no site para estimar custos e rentabilidade, ou falar diretamente com nosso time pelos canais de contato. A partir daí montamos uma proposta personalizada para a sua operação.',
  },
]

const breadcrumbs = [
  { name: 'Início', path: '/' },
  { name: 'Perguntas Frequentes', path: '/faq' },
]

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container-custom pb-20 pt-10 lg:pt-14">
          <div className="max-w-3xl">
            <Breadcrumbs items={breadcrumbs} />

            <div className="mb-10 flex flex-col gap-4">
              <Eyebrow>Perguntas frequentes</Eyebrow>
              <h1 className="heading text-[clamp(34px,4.4vw,52px)] font-extrabold text-balance">
                Tudo o que você precisa saber
              </h1>
              <p className="text-[17px] text-ink-2">
                Dúvidas comuns sobre nossos modelos de atendimento e como começar.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-line bg-card p-5 open:border-cyan"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <h2 className="font-display text-[17px] font-bold md:text-[19px]">
                      {faq.question}
                    </h2>
                    <ChevronDown className="h-5 w-5 shrink-0 text-cyan transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-[15.5px] leading-[1.6] text-ink-2">{faq.answer}</p>
                </details>
              ))}
            </div>

            <p className="mt-10 text-[15px] text-ink-3">
              Não encontrou sua resposta?{' '}
              <Link href="/#contato" className="font-semibold text-cyan-ink hover:underline">
                Fale com nosso time
              </Link>
              .
            </p>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />

      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(faqs)]} />
    </>
  )
}
