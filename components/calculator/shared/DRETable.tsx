'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import type { DREResult } from '@/lib/calculator-types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DRETableProps {
  dre: DREResult
}

export function DRETable({ dre }: DRETableProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Receita Bruta"
          value={formatCurrency(dre.receitaBruta)}
          icon={<DollarSign className="w-5 h-5" />}
          color="cyan"
        />
        <KPICard
          label="Custos Totais"
          value={formatCurrency(dre.totalCustos + dre.impostos)}
          icon={<TrendingDown className="w-5 h-5" />}
          color="red"
        />
        <KPICard
          label="Resultado"
          value={formatCurrency(dre.resultadoOperacional)}
          icon={dre.resultadoOperacional >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          color={dre.resultadoOperacional >= 0 ? 'green' : 'red'}
        />
        <KPICard
          label="Margem Oper."
          value={`${dre.margemOperacional.toFixed(1)}%`}
          icon={<Percent className="w-5 h-5" />}
          color={dre.margemOperacional >= 20 ? 'green' : dre.margemOperacional >= 0 ? 'amber' : 'red'}
        />
      </div>

      {/* DRE Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h4 className="font-display font-bold text-primary-navy">
            Demonstrativo de Resultado (DRE Simplificada)
          </h4>
          <p className="text-xs text-neutral-gray mt-1">
            Simulação baseada em 100% de ocupação dos pacotes
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          {/* Receita */}
          <DRESection title="RECEITA BRUTA" isHeader>
            {dre.receitaDedicada > 0 && (
              <DRERow label="Consultas Agenda Dedicada" value={dre.receitaDedicada} />
            )}
            {dre.receitaCompartilhada > 0 && (
              <DRERow label="Consultas Agenda Compartilhada" value={dre.receitaCompartilhada} />
            )}
            <DRERow label="= Total Receita Bruta" value={dre.receitaBruta} isBold />
          </DRESection>

          {/* Impostos */}
          <DRESection title="(-) IMPOSTOS SOBRE VENDAS">
            <DRERow label="Impostos sobre faturamento" value={-dre.impostos} isNegative />
            <DRERow label="= Receita Líquida" value={dre.receitaLiquida} isBold />
          </DRESection>

          {/* Custos */}
          <DRESection title="(-) CUSTOS DOS SERVIÇOS">
            {dre.custoDedicada > 0 && (
              <DRERow label="Pacotes Agenda Dedicada" value={-dre.custoDedicada} isNegative />
            )}
            {dre.custoCompartilhada > 0 && (
              <DRERow label="Consultas Compartilhadas" value={-dre.custoCompartilhada} isNegative />
            )}
            {dre.custoSoftware > 0 && (
              <DRERow label="Software de Telemedicina" value={-dre.custoSoftware} isNegative />
            )}
            {dre.custoInfraestrutura > 0 && (
              <DRERow label="Infraestrutura (aluguel)" value={-dre.custoInfraestrutura} isNegative />
            )}
            <DRERow label="= Total Custos" value={-dre.totalCustos} isBold isNegative />
          </DRESection>

          {/* Lucro Bruto */}
          <DRESection title="">
            <DRERow
              label="= LUCRO BRUTO"
              value={dre.lucroBruto}
              isBold
              percentage={dre.margemBruta}
              highlight={dre.lucroBruto >= 0 ? 'green' : 'red'}
            />
          </DRESection>

          {/* Despesas */}
          <DRESection title="(-) DESPESAS OPERACIONAIS">
            {dre.custoFuncionarios > 0 && (
              <DRERow label="Funcionários (CLT)" value={-dre.custoFuncionarios} isNegative />
            )}
            {dre.despesasFixas > 0 && (
              <DRERow label="Despesas Fixas" value={-dre.despesasFixas} isNegative />
            )}
            <DRERow label="= Total Despesas" value={-(dre.totalDespesas)} isBold isNegative />
          </DRESection>

          {/* Resultado */}
          <div className={cn(
            'px-6 py-5',
            dre.resultadoOperacional >= 0 ? 'bg-emerald-50' : 'bg-red-50'
          )}>
            <div className="flex items-center justify-between">
              <span className={cn(
                'font-display text-lg font-bold',
                dre.resultadoOperacional >= 0 ? 'text-emerald-700' : 'text-red-700'
              )}>
                = RESULTADO OPERACIONAL
              </span>
              <div className="text-right">
                <span className={cn(
                  'font-display text-2xl font-bold',
                  dre.resultadoOperacional >= 0 ? 'text-emerald-700' : 'text-red-700'
                )}>
                  {formatCurrency(dre.resultadoOperacional)}
                </span>
                <span className={cn(
                  'text-sm ml-2',
                  dre.resultadoOperacional >= 0 ? 'text-emerald-600' : 'text-red-600'
                )}>
                  ({dre.margemOperacional.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: 'cyan' | 'green' | 'red' | 'amber'
}) {
  const colors = {
    cyan: 'bg-primary-cyan/10 text-primary-cyan',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 p-4"
    >
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', colors[color])}>
        {icon}
      </div>
      <p className="text-xs text-neutral-gray">{label}</p>
      <p className="font-display text-lg font-bold text-primary-navy mt-0.5">{value}</p>
    </motion.div>
  )
}

function DRESection({
  title,
  isHeader,
  children,
}: {
  title: string
  isHeader?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      {title && (
        <div className={cn('px-6 py-3', isHeader ? 'bg-primary-cyan/5' : 'bg-gray-50/50')}>
          <span className="text-xs font-bold text-neutral-gray uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  )
}

function DRERow({
  label,
  value,
  isBold,
  isNegative,
  percentage,
  highlight,
}: {
  label: string
  value: number
  isBold?: boolean
  isNegative?: boolean
  percentage?: number
  highlight?: 'green' | 'red'
}) {
  const highlightColors = {
    green: 'text-emerald-700',
    red: 'text-red-700',
  }

  return (
    <div className={cn(
      'px-6 py-2.5 flex items-center justify-between',
      isBold && 'bg-gray-50/30'
    )}>
      <span className={cn(
        'text-sm',
        isBold ? 'font-semibold text-primary-navy' : 'text-neutral-gray',
        highlight && highlightColors[highlight]
      )}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-sm',
          isBold ? 'font-bold text-primary-navy' : 'font-medium text-primary-navy',
          highlight && highlightColors[highlight]
        )}>
          {formatCurrency(value)}
        </span>
        {percentage !== undefined && (
          <span className="text-xs text-neutral-gray">({percentage.toFixed(1)}%)</span>
        )}
      </div>
    </div>
  )
}
