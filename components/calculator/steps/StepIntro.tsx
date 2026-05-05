'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  CalendarRange,
  MonitorPlay,
  Stethoscope,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'

const features = [
  {
    icon: MonitorPlay,
    title: 'Agenda Compartilhada',
    description: 'Compre consultas avulsas de diversas especialidades. Os preços são os mesmos da categoria Intermediária da agenda dedicada — equilíbrio entre volume e tempo por consulta.',
  },
  {
    icon: CalendarRange,
    title: 'Agenda Dedicada',
    description: 'Monte pacotes exclusivos com especialistas dedicados à sua operação em diferentes categorias.',
  },
  {
    icon: Building2,
    title: 'Infraestrutura',
    description: 'Escolha entre montar sua sala, adquirir nosso totem ou uma cabine completa com tecnologia integrada.',
  },
]

const audiences = [
  { icon: Stethoscope, label: 'Clínicas' },
  { icon: Building2, label: 'Hospitais' },
  { icon: TrendingUp, label: 'Laboratórios' },
]

export function StepIntro() {
  const { dispatch } = useProposal()

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="inline-flex items-center gap-2 bg-primary-cyan/10 px-5 py-2.5 rounded-full mb-6">
          <span className="w-2.5 h-2.5 bg-primary-cyan rounded-full animate-pulse" />
          <span className="text-base font-medium text-primary-cyan">
            Simulador de Proposta Comercial
          </span>
        </span>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-navy leading-tight mb-6">
          Monte sua operação de{' '}
          <span className="gradient-text">telemedicina</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-gray leading-relaxed max-w-2xl mx-auto">
          Simule sua proposta comercial personalizada e descubra como transformar
          sua estrutura em um centro de atendimento especializado com a tecnologia Prontta Saúde.
        </p>
      </motion.div>

      {/* Features Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-navy/5 border border-gray-100 hover:shadow-xl hover:border-primary-cyan/20 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-primary-cyan/10 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-primary-cyan" />
            </div>
            <h3 className="font-display text-xl font-bold text-primary-navy mb-2">
              {feature.title}
            </h3>
            <p className="text-neutral-gray leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Audience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-neutral-gray mb-6 text-lg">Para quem é esse simulador?</p>
        <div className="flex flex-wrap justify-center gap-4">
          {audiences.map((item) => (
            <div
              key={item.label}
              className="inline-flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-100"
            >
              <item.icon className="w-5 h-5 text-primary-cyan" />
              <span className="text-primary-navy font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Button
          variant="primary"
          size="lg"
          className="group text-lg px-10 py-5"
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
        >
          Iniciar Simulação
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-sm text-neutral-gray mt-4">
          Leva menos de 5 minutos. Sem compromisso.
        </p>
      </motion.div>
    </div>
  )
}
