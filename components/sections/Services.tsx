'use client'

import { motion } from 'framer-motion'
import { CalendarClock, CalendarRange, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'

const services = [
  {
    id: 'agenda-on-demand',
    icon: CalendarClock,
    title: 'Agenda On Demand',
    description: 'Profissionais de saúde disponíveis sob demanda para sua clínica. Flexibilidade total para atender picos de demanda ou substituições.',
    features: [
      'Profissionais qualificados',
      'Disponibilidade imediata',
      'Sem compromisso fixo',
      'Ideal para demandas pontuais',
    ],
    color: 'from-primary-cyan to-blue-400',
    bgColor: 'bg-primary-cyan/10',
  },
  {
    id: 'agenda-compartilhada',
    icon: CalendarRange,
    title: 'Agenda Compartilhada',
    description: 'Compartilhe profissionais especializados com outras clínicas. Reduza custos mantendo acesso a especialistas de alta qualidade.',
    features: [
      'Custo otimizado',
      'Especialistas compartilhados',
      'Agenda flexível',
      'Escala inteligente',
    ],
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'pacotes-atendimento',
    icon: Package,
    title: 'Pacotes de Atendimento',
    description: 'Pacotes personalizados com múltiplas especialidades. Solução completa para acompanhamento multidisciplinar dos seus pacientes.',
    features: [
      'Múltiplas especialidades',
      'Preço fechado',
      'Relatórios integrados',
      'Gestão simplificada',
    ],
    color: 'from-violet-500 to-purple-400',
    bgColor: 'bg-violet-500/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export function Services() {
  return (
    <section id="servicos" className="relative section-padding overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent-light/30 to-white" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-cyan/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
      
      <div className="container-custom mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-cyan/10 text-primary-cyan font-medium rounded-full text-sm mb-4">
            Nossos Serviços
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-navy mb-6">
            Modelos flexíveis de{' '}
            <span className="gradient-text">terceirização médica</span>
          </h2>
          <p className="text-neutral-gray text-lg">
            Escolha o modelo que melhor se adapta às necessidades da sua clínica. 
            Flexibilidade e qualidade para otimizar seus atendimentos.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="h-full group" variant="default">
                <CardHeader>
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl ${service.bgColor} mb-4`}>
                    <service.icon className="w-8 h-8 text-primary-navy" />
                  </div>
                  
                  <CardTitle className="text-2xl group-hover:text-primary-cyan transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`} />
                        <span className="text-neutral-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Link */}
                  <Link
                    href={`/proposta?servico=${service.id}`}
                    className="inline-flex items-center gap-2 text-primary-cyan font-semibold group/link"
                  >
                    Solicitar proposta
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
