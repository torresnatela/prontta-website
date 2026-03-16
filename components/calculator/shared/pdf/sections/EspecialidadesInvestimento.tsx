import { Page, View, Text } from '@react-pdf/renderer'
import { styles, COLORS } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { Table } from '../components/Table'
import { formatBRL } from '../utils'
import type { ProposalState } from '@/lib/calculator-types'
import { CATEGORIES, INFRASTRUCTURE_OPTIONS } from '@/lib/pricing-data'
import {
  calculateDedicatedPackagesCost,
  calculateTotalMonthlyConsultations,
  calculateSoftwareCost,
  calculateTotalMonthlyCost,
} from '@/lib/pricing-engine'

interface EspecialidadesInvestimentoProps {
  state: ProposalState
}

export function EspecialidadesInvestimento({ state }: EspecialidadesInvestimentoProps) {
  const totalConsultations = calculateTotalMonthlyConsultations(state)
  const dedicatedCost = calculateDedicatedPackagesCost(state.dedicatedPackages)
  const softwareCost = calculateSoftwareCost(totalConsultations)
  const totalMonthly = calculateTotalMonthlyCost(state)
  const infraData = state.infrastructure ? INFRASTRUCTURE_OPTIONS[state.infrastructure.option] : null

  const columns = [
    { key: 'specialty', label: 'Especialidade', width: '35%' },
    { key: 'category', label: 'Categoria', width: '18%' },
    { key: 'packages', label: 'Pacotes', width: '12%', align: 'center' as const },
    { key: 'consultations', label: 'Consultas/mês', width: '17%', align: 'right' as const },
    { key: 'value', label: 'Valor Mensal', width: '18%', align: 'right' as const, bold: true },
  ]

  const rows = state.dedicatedPackages.map((pkg) => ({
    specialty: pkg.specialty,
    category: CATEGORIES[pkg.category]?.label ?? pkg.category,
    packages: String(pkg.quantity),
    consultations: String(pkg.totalConsultations),
    value: formatBRL(pkg.totalCost),
  }))

  const totalDedicatedConsultations = state.dedicatedPackages.reduce(
    (sum, pkg) => sum + pkg.totalConsultations,
    0
  )

  const totals = {
    consultations: String(totalDedicatedConsultations),
    value: formatBRL(dedicatedCost),
  }

  // Infrastructure display
  const infraLabel = infraData ? infraData.label : 'Infraestrutura Própria'
  let infraValue = 'Sem custo'
  if (state.infrastructure.option !== 'propria') {
    infraValue =
      state.infrastructure.paymentMode === 'compra'
        ? `${formatBRL(state.infrastructure.oneTimeCost)} (à vista)`
        : `${formatBRL(state.infrastructure.monthlyCost)}/mês`
  }

  return (
    <Page size="A4" style={styles.page} wrap>
      <PageHeader />
      <SectionTitle number={9} title="Especialidades Médicas e Investimento" />

      {state.dedicatedPackages.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Table columns={columns} rows={rows} totals={totals} totalsLabel="SUBTOTAL" />
        </View>
      )}

      {/* 9.1 Resumo Financeiro */}
      <Text style={styles.sectionSubtitle}>9.1 Resumo Financeiro</Text>

      <View style={styles.highlightBox}>
        {/* Agenda Dedicada */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Agenda Dedicada ({state.dedicatedPackages.length} especialidade{state.dedicatedPackages.length !== 1 ? 's' : ''})</Text>
          <Text style={styles.rowValue}>{formatBRL(dedicatedCost)}/mês</Text>
        </View>

        {/* Infraestrutura */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{infraLabel}</Text>
          <Text style={styles.rowValue}>{infraValue}</Text>
        </View>

        {/* Software */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Software de Telemedicina ({totalConsultations} consultas/mês)</Text>
          <Text style={styles.rowValue}>{softwareCost === 0 ? 'ISENTO' : `${formatBRL(softwareCost)}/mês`}</Text>
        </View>

        {/* Implantação */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Projeto de Implantação</Text>
          <Text style={styles.rowValue}>
            {state.implantationNote || 'R$ 10.000,00 (único)'}
          </Text>
        </View>
      </View>

      {/* Total box */}
      <View style={styles.totalBox}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total de consultas/mês</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: COLORS.white }}>
              {totalConsultations}
            </Text>
          </View>
          <View>
            <Text style={styles.totalLabel}>Custo mensal recorrente</Text>
            <Text style={styles.totalValue}>{formatBRL(totalMonthly)}</Text>
          </View>
        </View>
      </View>

      <PageFooter />
    </Page>
  )
}
