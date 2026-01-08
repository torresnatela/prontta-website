'use client'

import { motion } from 'framer-motion'
import { UserCheck, HeartPulse, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'

const services = [
  {
    id: 'retorno-implante',
    icon: UserCheck,
    title: 'Retorno Implante Capilar',
    description: 'Terceirização completa do retorno de pacientes de implante capilar. Avaliação especializada e relatórios detalhados para sua clínica.',
    features: [
      'Avaliação do resultado',
      'Orientações de cuidados',
      'Relatório para a clínica',
      'Suporte ao paciente',
    ],
    color: 'from-primary-cyan to-blue-400',
    bgColor: 'bg-primary-cyan/10',
  },
  {
    id: 'acompanhamento-pos-op',
    icon: HeartPulse,
    title: 'Acompanhamento Pós-Op',
    description: 'Pacote completo com psicólogo, nutricionista e endocrinologista para acompanhamento multidisciplinar do paciente.',
    features: [
      'Psicólogo',
      'Nutricionista',
      'Endocrinologista',
      'Relatório integrado',
    ],
    color: 'from-rose-500 to-pink-400',
    bgColor: 'bg-rose-500/10',
  },
  {
    id: 'pre-operatorio',
    icon: Activity,
    title: 'Pré-Operatório Cardiológico',
    description: 'Análise cardiológica completa para liberação cirúrgica. ECG e laudo profissional para segurança do procedimento.',
    features: [
      'Avaliação completa',
      'Eletrocardiograma',
      'Laudo de liberação',
      'Orientações',
    ],
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-500/10',
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
            Soluções completas em{' '}
            <span className="gradient-text">terceirização médica</span>
          </h2>
          <p className="text-neutral-gray text-lg">
            Oferecemos serviços especializados para clínicas e hospitais que buscam 
            excelência no atendimento e otimização de recursos.
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

