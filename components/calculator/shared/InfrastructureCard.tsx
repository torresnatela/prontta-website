'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import type { InfrastructureOption, PaymentMode } from '@/lib/calculator-types'

interface InfrastructureCardProps {
  option: InfrastructureOption
  label: string
  description: string
  icon: React.ReactNode
  purchasePrice: number
  monthlyRent: number
  isSelected: boolean
  paymentMode: PaymentMode
  onSelect: () => void
  onPaymentModeChange: (mode: PaymentMode) => void
}

export function InfrastructureCard({
  option,
  label,
  description,
  icon,
  purchasePrice,
  monthlyRent,
  isSelected,
  paymentMode,
  onSelect,
  onPaymentModeChange,
}: InfrastructureCardProps) {
  const hasPaymentToggle = purchasePrice > 0

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 relative',
        isSelected
          ? 'border-primary-cyan bg-primary-cyan/5 shadow-lg shadow-primary-cyan/10'
          : 'border-gray-200 bg-white hover:border-primary-cyan/30'
      )}
      onClick={onSelect}
    >
      {/* Selected Check */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-7 h-7 bg-primary-cyan rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Icon */}
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
        isSelected ? 'bg-primary-cyan/10' : 'bg-gray-100'
      )}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold text-primary-navy mb-2">{label}</h3>
      <p className="text-sm text-neutral-gray mb-4 leading-relaxed">{description}</p>

      {/* Pricing */}
      {hasPaymentToggle ? (
        <div className="space-y-3">
          {/* Payment Mode Toggle */}
          {isSelected && (
            <div
              className="flex bg-gray-100 rounded-lg p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onPaymentModeChange('compra')}
                className={cn(
                  'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all',
                  paymentMode === 'compra'
                    ? 'bg-white shadow-sm text-primary-navy'
                    : 'text-neutral-gray hover:text-primary-navy'
                )}
              >
                Compra
              </button>
              <button
                onClick={() => onPaymentModeChange('aluguel')}
                className={cn(
                  'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all',
                  paymentMode === 'aluguel'
                    ? 'bg-white shadow-sm text-primary-navy'
                    : 'text-neutral-gray hover:text-primary-navy'
                )}
              >
                Aluguel
              </button>
            </div>
          )}

          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-primary-navy">
              {paymentMode === 'compra'
                ? formatCurrency(purchasePrice)
                : formatCurrency(monthlyRent)}
            </span>
            <span className="text-sm text-neutral-gray">
              {paymentMode === 'compra' ? '(à vista)' : '/mês'}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="font-display text-2xl font-bold text-emerald-600">
            Sem custo
          </span>
        </div>
      )}
    </motion.div>
  )
}
