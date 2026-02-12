'use client'

import { motion } from 'framer-motion'
import { Building2, Stethoscope, Users } from 'lucide-react'
import { useProposal } from '../ProposalContext'
import type { ClientCategory } from '@/lib/calculator-types'
import { cn } from '@/lib/utils'

const categories: {
  id: ClientCategory
  icon: typeof Building2
  title: string
  description: string
}[] = [
  {
    id: 'municipio',
    icon: Building2,
    title: 'Municípios',
    description: 'Municípios que querem levar telemedicina para a população.',
  },
  {
    id: 'estabelecimento',
    icon: Stethoscope,
    title: 'Laboratórios / Clínicas / Academias / Farmácias',
    description: 'Estabelecimentos que vão revender consultas para clientes e parceiros.',
  },
  {
    id: 'empresa',
    icon: Users,
    title: 'Empresas',
    description: 'Empresas que querem oferecer consultas para seus colaboradores.',
  },
]

export function StepClientCategory() {
  const { state, dispatch } = useProposal()

  const handleSelect = (category: ClientCategory) => {
    dispatch({ type: 'SET_CLIENT_CATEGORY', category })
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Qual é o seu perfil?
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Selecione a opção que melhor descreve sua situação para personalizar a simulação.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-1 gap-6">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const isSelected = state.clientCategory === cat.id
          return (
            <motion.button
              key={cat.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(cat.id)}
              className={cn(
                'w-full text-left rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300',
                'bg-white shadow-lg shadow-primary-navy/5 hover:shadow-xl hover:border-primary-cyan/30',
                isSelected ? 'border-primary-cyan ring-2 ring-primary-cyan/20' : 'border-gray-100'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
                    isSelected ? 'bg-primary-cyan/10' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn('w-7 h-7', isSelected ? 'text-primary-cyan' : 'text-primary-navy')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-bold text-primary-navy mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-neutral-gray text-sm sm:text-base">{cat.description}</p>
                </div>
                <span className="text-primary-cyan font-semibold text-sm shrink-0">
                  Selecionar →
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
