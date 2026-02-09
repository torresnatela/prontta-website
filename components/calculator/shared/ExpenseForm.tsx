'use client'

import { useState } from 'react'
import { Plus, Trash2, Receipt, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { DEFAULT_EXPENSE_CATEGORIES } from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'

export function ExpenseForm() {
  const { state, dispatch } = useProposal()
  const [categoria, setCategoria] = useState('')
  const [valor, setValor] = useState('')

  const handleAdd = () => {
    if (!categoria || !valor) return
    const valorNum = parseFloat(valor)
    if (isNaN(valorNum) || valorNum <= 0) return

    dispatch({
      type: 'ADD_FIXED_EXPENSE',
      categoria,
      valor: valorNum,
    })
    setCategoria('')
    setValor('')
  }

  const totalExpenses = state.fixedExpenses.reduce((sum, e) => sum + e.valor, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Receipt className="w-5 h-5 text-primary-cyan" />
        <h4 className="font-display font-bold text-primary-navy">Despesas Fixas Mensais</h4>
      </div>

      {/* List */}
      {state.fixedExpenses.length > 0 && (
        <div className="space-y-2">
          {state.fixedExpenses.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="font-medium text-primary-navy text-sm">{exp.categoria}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCurrency(exp.valor)}</span>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_FIXED_EXPENSE', id: exp.id })}
                  className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
            <span className="font-medium text-primary-navy">Total despesas fixas</span>
            <span className="font-bold text-primary-navy">{formatCurrency(totalExpenses)}/mês</span>
          </div>
        </div>
      )}

      {/* Add form */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-accent-light text-sm appearance-none cursor-pointer focus:outline-none focus:border-primary-cyan"
          >
            <option value="">Categoria</option>
            {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray pointer-events-none" />
        </div>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-32 px-3 py-2.5 rounded-xl border-2 border-accent-light text-sm focus:outline-none focus:border-primary-cyan"
          placeholder="Valor (R$)"
          min={0}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={!categoria || !valor}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
