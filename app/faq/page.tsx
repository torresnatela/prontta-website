import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { CTA } from '@/components/sections'
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
      <main className="pt-28 md:pt-32">
        <section className="section-padding">
          <div className="container-custom mx-auto max-w-3xl">
            <Breadcrumbs items={breadcrumbs} />

            <div className="text-center mb-10">
              <span className="inline-block px-5 py-2.5 bg-primary-cyan/10 text-primary-cyan font-medium rounded-full text-base mb-4">
                Perguntas Frequentes
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-navy text-balance">
                Tudo o que você precisa saber
              </h1>
              <p className="mt-4 text-xl text-neutral-gray">
                Dúvidas comuns sobre nossos modelos de atendimento e como começar.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border-2 border-accent-light bg-white p-5 open:shadow-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <h2 className="font-display text-lg md:text-xl font-bold text-primary-navy">
                      {faq.question}
                    </h2>
                    <ChevronDown className="h-5 w-5 shrink-0 text-primary-cyan transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-primary-navy/80 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>

            <p className="mt-10 text-center text-neutral-gray">
              Não encontrou sua resposta?{' '}
              <Link href="/#contato" className="font-medium text-primary-cyan hover:underline">
                Fale com nosso time
              </Link>
              .
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />

      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(faqs)]} />
    </>
  )
}
