'use client'

import { motion } from 'framer-motion'
import { SHARED_AGENDA_PRICES } from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'
import { useProposal } from '../ProposalContext'

export function SharedAgendaTable() {
  const { state, dispatch } = useProposal()
  const specialties = Object.entries(SHARED_AGENDA_PRICES)

  function getQuantityForSpecialty(specialty: string): number {
    const item = state.sharedConsultations.find((sc) => sc.specialty === specialty)
    return item?.quantity ?? 0
  }

  function getIdForSpecialty(specialty: string): string | null {
    const item = state.sharedConsultations.find((sc) => sc.specialty === specialty)
    return item?.id ?? null
  }

  function handleQuantityChange(specialty: string, price: number, value: number) {
    const id = getIdForSpecialty(specialty)
    if (value >= 1) {
      if (id) {
        dispatch({ type: 'UPDATE_SHARED_CONSULTATION', id, quantity: value })
      } else {
        dispatch({
          type: 'ADD_SHARED_CONSULTATION',
          specialty,
          quantity: value,
          pricePerConsultation: price,
        })
      }
    } else if (id) {
      dispatch({ type: 'REMOVE_SHARED_CONSULTATION', id })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-sm font-semibold text-primary-navy">
                Especialidade
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-primary-navy">
                Valor por Consulta
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-primary-navy w-28">
                Quantidade
              </th>
            </tr>
          </thead>
          <tbody>
            {specialties.map(([name, price], index) => {
              const qty = getQuantityForSpecialty(name)
              return (
                <motion.tr
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-50 hover:bg-accent-light/30 transition-colors"
                >
                  <td className="px-6 py-3.5 text-primary-navy font-medium">
                    {name}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="font-semibold text-primary-cyan">
                      {formatCurrency(price)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10)
                        const n = Number.isNaN(v) ? 0 : Math.max(0, v)
                        handleQuantityChange(name, price, n)
                      }}
                      className="w-16 text-right px-2 py-2 rounded-lg border-2 border-accent-light text-sm font-medium text-primary-navy focus:outline-none focus:border-primary-cyan"
                    />
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-blue-50/50 border-t border-blue-100/50">
        <p className="text-sm text-neutral-gray">
          Defina as quantidades aqui; elas já entram na proposta final. Você pode ajustá-las depois na etapa Proposta e no Simulador de Rentabilidade. Preços da categoria Popular.
        </p>
      </div>
    </div>
  )
}
