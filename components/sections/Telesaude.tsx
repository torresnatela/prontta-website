'use client'

import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Building2, 
  UserCheck, 
  Stethoscope,
  MonitorPlay,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CalendarCheck
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'

const telemedicina10 = [
  { text: '"Consulta de pijama". Fria.', negative: true },
  { text: 'Baixa resolutividade', negative: true },
  { text: 'Paciente sozinho em casa', negative: true },
  { text: 'Sem apoio presencial', negative: true },
]

const telesaudeHibrida = [
  { text: 'Paciente na clínica', positive: true },
  { text: 'Acolhimento presencial', positive: true },
  { text: 'Exames digitais em tempo real', positive: true },
  { text: 'Especialista na tela', positive: true },
]

export function Telesaude() {
  return (
    <section id="telesaude" className="relative section-padding overflow-hidden bg-gradient-to-br from-primary-navy via-primary-navy to-primary-navy/95">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid-telesaude" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00B4E6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid-telesaude)" />
        </svg>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-cyan/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="container-custom mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="inline-block px-5 py-2.5 bg-emerald-500/20 text-emerald-400 font-medium rounded-full text-base mb-4">
            Metodologia Exclusiva
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Telesaúde 2.0{' '}
            <span className="text-primary-cyan">(Híbrida)</span>
          </h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Uma metodologia inovadora criada pela Prontta Saúde que combina o melhor 
            do atendimento digital com a confiança do presencial.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Telemedicina 1.0 - Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-neutral-gray/20 rounded-xl">
                  <Smartphone className="w-10 h-10 text-neutral-gray" />
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-neutral-gray">
                    Telemedicina 1.0
                  </h3>
                  <p className="text-neutral-gray/60 text-base">Modelo tradicional</p>
                </div>
              </div>

              <ul className="space-y-4">
                {telemedicina10.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                    <span className="text-white/60 text-lg">{item.text}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Illustration */}
              <div className="mt-8 p-6 bg-white/5 rounded-2xl flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-40 bg-neutral-gray/30 rounded-xl flex items-center justify-center">
                    <div className="w-16 h-28 bg-neutral-gray/20 rounded-lg flex flex-col items-center justify-center">
                      <div className="w-8 h-8 bg-neutral-gray/40 rounded-full mb-2" />
                      <div className="w-10 h-1 bg-neutral-gray/40 rounded" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="flex gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-3 bg-neutral-gray/40 rounded-full" style={{ height: `${8 + i * 4}px` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Telesaúde Híbrida - New Way */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-emerald-500/20 to-primary-cyan/20 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-8 h-full relative overflow-hidden">
              {/* Highlight badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  RECOMENDADO
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-emerald-500/30 rounded-xl">
                  <HeartHandshake className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-emerald-400">
                    Telesaúde Híbrida
                  </h3>
                  <p className="text-emerald-400/60 text-base">Metodologia Prontta</p>
                </div>
              </div>

              <ul className="space-y-4">
                {telesaudeHibrida.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <span className="text-white font-medium text-lg">{item.text}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Illustration */}
              <div className="mt-8 p-6 bg-white/10 rounded-2xl">
                <div className="flex items-center justify-center gap-6">
                  {/* Clinic/Patient */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-500/30 rounded-xl flex items-center justify-center mb-2">
                      <Building2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <span className="text-xs text-white/60">Clínica</span>
                  </div>

                  {/* Connection */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-primary-cyan" />
                    <HeartHandshake className="w-6 h-6 text-primary-cyan" />
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary-cyan to-emerald-500" />
                  </div>

                  {/* Specialist on screen */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary-cyan/30 rounded-xl flex items-center justify-center mb-2 relative">
                      <MonitorPlay className="w-8 h-8 text-primary-cyan" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <span className="text-xs text-white/60">Especialista</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-10 py-8">
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              A escala do <span className="text-primary-cyan">digital</span> + A confiança do <span className="text-emerald-400">presencial</span>.
            </p>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white text-center mb-10">
            Como funciona a Telesaúde Híbrida?
          </h3>

          <div className="grid md:grid-cols-5 gap-5">
            {[
              {
                step: '01',
                icon: CalendarCheck,
                title: 'Agendamento',
                description: 'A clínica vende e agenda a consulta usando nosso sistema de agendamentos.',
              },
              {
                step: '02',
                icon: Building2,
                title: 'Paciente vai à clínica',
                description: 'O paciente é recebido na sua clínica com todo o acolhimento presencial.',
              },
              {
                step: '03',
                icon: UserCheck,
                title: 'Apoio profissional',
                description: 'Uma profissional de saúde acompanha o paciente durante toda a consulta.',
              },
              {
                step: '04',
                icon: MonitorPlay,
                title: 'Especialista online',
                description: 'O especialista realiza o atendimento pela tela, com apoio presencial.',
              },
              {
                step: '05',
                icon: Stethoscope,
                title: 'Exames em tempo real',
                description: 'A profissional auxilia na realização de exames e procedimentos.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-flex mb-4">
                  <div className="w-18 h-18 bg-primary-cyan/20 rounded-2xl flex items-center justify-center p-4">
                    <item.icon className="w-10 h-10 text-primary-cyan" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-2 text-lg">{item.title}</h4>
                <p className="text-white/60 text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/proposta">
              <Button variant="primary" size="lg" className="bg-emerald-500 hover:bg-emerald-600 group">
                Implementar na minha clínica
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

