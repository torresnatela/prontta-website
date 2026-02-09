'use client'

import { useState } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { calculateEmployeeCost } from '@/lib/pricing-engine'
import { formatCurrency } from '@/lib/utils'

export function EmployeeForm() {
  const { state, dispatch } = useProposal()
  const [cargo, setCargo] = useState('')
  const [salario, setSalario] = useState('')

  const handleAdd = () => {
    if (!cargo || !salario) return
    const salarioBase = parseFloat(salario)
    if (isNaN(salarioBase) || salarioBase <= 0) return

    dispatch({
      type: 'ADD_EMPLOYEE',
      cargo,
      salarioBase,
      custoTotal: calculateEmployeeCost(salarioBase),
    })
    setCargo('')
    setSalario('')
  }

  const totalCost = state.employees.reduce((sum, e) => sum + e.custoTotal, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-primary-cyan" />
        <h4 className="font-display font-bold text-primary-navy">Funcionários (CLT)</h4>
      </div>

      <p className="text-sm text-neutral-gray">
        Custo total inclui encargos CLT (~70% sobre o salário base: INSS, FGTS, 13o, férias+1/3).
      </p>

      {/* List */}
      {state.employees.length > 0 && (
        <div className="space-y-2">
          {state.employees.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div>
                <span className="font-medium text-primary-navy text-sm">{emp.cargo}</span>
                <div className="text-xs text-neutral-gray">
                  Base: {formatCurrency(emp.salarioBase)} &rarr; Total: {formatCurrency(emp.custoTotal)}
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_EMPLOYEE', id: emp.id })}
                className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
            <span className="font-medium text-primary-navy">Total funcionários</span>
            <span className="font-bold text-primary-navy">{formatCurrency(totalCost)}/mês</span>
          </div>
        </div>
      )}

      {/* Add form */}
      <div className="flex gap-2">
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-accent-light text-sm focus:outline-none focus:border-primary-cyan"
          placeholder="Cargo (ex: Recepcionista)"
        />
        <input
          type="number"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          className="w-32 px-3 py-2.5 rounded-xl border-2 border-accent-light text-sm focus:outline-none focus:border-primary-cyan"
          placeholder="Salário (R$)"
          min={0}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={!cargo || !salario}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
