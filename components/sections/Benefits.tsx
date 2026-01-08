'use client'

import { motion } from 'framer-motion'
import { 
  TrendingDown, 
  Award, 
  Clock, 
  Shield, 
  Zap, 
  Users,
  BarChart3,
  Headphones
} from 'lucide-react'

const benefits = [
  {
    icon: TrendingDown,
    title: 'Redução de Custos',
    description: 'Economize até 40% em custos operacionais com nossa estrutura otimizada.',
  },
  {
    icon: Award,
    title: 'Profissionais Qualificados',
    description: 'Equipe rigorosamente selecionada e treinada para excelência.',
  },
  {
    icon: Clock,
    title: 'Agilidade no Atendimento',
    description: 'Processos otimizados para atendimento rápido e eficiente.',
  },
  {
    icon: Shield,
    title: 'Conformidade Legal',
    description: 'Todos os processos em conformidade com normas de saúde.',
  },
  {
    icon: Zap,
    title: 'Implementação Rápida',
    description: 'Início das operações em até 15 dias após aprovação.',
  },
  {
    icon: Users,
    title: 'Equipe Dedicada',
    description: 'Profissionais exclusivos para atender sua clínica.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Detalhados',
    description: 'Dashboard completo com métricas de atendimento.',
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Equipe de suporte disponível a qualquer momento.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function Benefits() {
  return (
    <section id="beneficios" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-light via-white to-accent-light" />
      
      {/* Decorative shapes */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-navy/5 rounded-full blur-3xl" />

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
            Benefícios
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-navy mb-6">
            Por que escolher a{' '}
            <span className="gradient-text">Prontta Saúde</span>?
          </h2>
          <p className="text-neutral-gray text-lg">
            Oferecemos vantagens competitivas que transformam a gestão 
            de serviços médicos da sua clínica.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 h-full shadow-lg shadow-primary-navy/5 border border-transparent hover:border-primary-cyan/20 transition-all duration-300">
                {/* Icon */}
                <div className="mb-4 relative">
                  <div className="inline-flex p-3 bg-accent-light rounded-xl group-hover:bg-primary-cyan/10 transition-colors">
                    <benefit.icon className="w-6 h-6 text-primary-cyan" />
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-primary-cyan/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-bold text-primary-navy mb-2 group-hover:text-primary-cyan transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-neutral-gray text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-primary-navy rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#00B4E6" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#dots)" />
            </svg>
          </div>

          <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Clínicas Parceiras' },
              { value: '98%', label: 'Taxa de Satisfação' },
              { value: '50k+', label: 'Atendimentos/Mês' },
              { value: '40%', label: 'Redução de Custos' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-primary-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

