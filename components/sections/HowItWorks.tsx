'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Users, Rocket, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Solicite uma Proposta',
    description: 'Preencha o formulário com as necessidades da sua clínica. Nossa equipe analisa e prepara uma proposta personalizada.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Alinhamento de Expectativas',
    description: 'Realizamos uma reunião para entender sua operação e definir os melhores profissionais para sua demanda.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Início das Operações',
    description: 'Integramos nossos profissionais ao seu fluxo de trabalho. Treinamento e adaptação inclusos.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Acompanhamento Contínuo',
    description: 'Monitoramos a qualidade dos atendimentos e ajustamos processos para garantir excelência.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative section-padding bg-primary-navy overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00B4E6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary-cyan/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-cyan/10 rounded-full blur-3xl" />

      <div className="container-custom mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-cyan/20 text-primary-cyan font-medium rounded-full text-sm mb-4">
            Como Funciona
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Processo simples e{' '}
            <span className="text-primary-cyan">transparente</span>
          </h2>
          <p className="text-white/70 text-lg">
            Em apenas 4 passos, sua clínica estará conectada aos melhores 
            profissionais de saúde do mercado.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-cyan/30 to-transparent transform -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-colors">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-6">
                    <div className="bg-primary-cyan text-white font-display font-bold text-lg px-4 py-1 rounded-full">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-4 mb-6">
                    <div className="inline-flex p-4 bg-primary-cyan/20 rounded-xl">
                      <step.icon className="w-8 h-8 text-primary-cyan" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-primary-navy border-2 border-primary-cyan rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

