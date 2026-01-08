'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'

const highlights = [
  'Profissionais qualificados',
  'Atendimento personalizado',
  'Custos otimizados',
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-bg geometric-pattern" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-primary-cyan/5 rounded-full blur-3xl" />
      
      {/* ECG Line Decoration */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-10"
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 60 L200 60 L240 20 L280 100 L320 40 L360 80 L400 60 L1440 60"
          stroke="#00B4E6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div className="container-custom mx-auto section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent-light px-4 py-2 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-primary-cyan rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-navy">
                Soluções em saúde corporativa
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-navy leading-tight text-balance"
            >
              Terceirização médica{' '}
              <span className="gradient-text">inteligente</span>{' '}
              para sua clínica
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-neutral-gray max-w-lg leading-relaxed"
            >
              Conectamos sua clínica aos melhores profissionais de saúde. 
              Reduza custos, aumente a qualidade do atendimento e foque no que importa: seus pacientes.
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary-cyan" />
                  <span className="text-primary-navy font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/proposta">
                <Button variant="primary" size="lg" className="group">
                  Solicitar Proposta
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#servicos">
                <Button variant="secondary" size="lg">
                  Conhecer Serviços
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main illustration card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/20 to-transparent rounded-3xl blur-2xl transform rotate-6" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-accent-light rounded-2xl p-6"
                  >
                    <div className="text-4xl font-display font-bold text-primary-cyan">98%</div>
                    <div className="text-sm text-neutral-gray mt-1">Satisfação</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-accent-light rounded-2xl p-6"
                  >
                    <div className="text-4xl font-display font-bold text-primary-navy">500+</div>
                    <div className="text-sm text-neutral-gray mt-1">Clínicas parceiras</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-accent-light rounded-2xl p-6"
                  >
                    <div className="text-4xl font-display font-bold text-primary-cyan">50k+</div>
                    <div className="text-sm text-neutral-gray mt-1">Atendimentos/mês</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-accent-light rounded-2xl p-6"
                  >
                    <div className="text-4xl font-display font-bold text-primary-navy">24h</div>
                    <div className="text-sm text-neutral-gray mt-1">Suporte</div>
                  </motion.div>
                </div>

                {/* ECG Animation */}
                <div className="mt-6 p-4 bg-primary-navy/5 rounded-xl">
                  <svg
                    className="w-full h-16"
                    viewBox="0 0 400 60"
                    fill="none"
                  >
                    <motion.path
                      d="M0 30 L80 30 L100 10 L120 50 L140 20 L160 40 L180 30 L400 30"
                      stroke="#00B4E6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-navy">Nova clínica</div>
                  <div className="text-xs text-neutral-gray">Parceria confirmada</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

