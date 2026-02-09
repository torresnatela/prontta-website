'use client'

import { motion } from 'framer-motion'
import { SHARED_AGENDA_PRICES } from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'

export function SharedAgendaTable() {
  const specialties = Object.entries(SHARED_AGENDA_PRICES)

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
            </tr>
          </thead>
          <tbody>
            {specialties.map(([name, price], index) => (
              <motion.tr
                key={name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
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
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-blue-50/50 border-t border-blue-100/50">
        <p className="text-sm text-neutral-gray">
          Consultas avulsas em agenda compartilhada. Você poderá definir a quantidade
          na etapa de proposta final.
        </p>
      </div>
    </div>
  )
}
