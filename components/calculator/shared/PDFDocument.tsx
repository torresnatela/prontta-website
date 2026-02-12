'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer'
import type { ProposalState, DREResult } from '@/lib/calculator-types'
import { CATEGORIES, INFRASTRUCTURE_OPTIONS, SOFTWARE_MONTHLY_COST } from '@/lib/pricing-data'
import {
  calculateDedicatedPackagesCost,
  calculateSharedConsultationsCost,
  calculateTotalMonthlyConsultations,
  calculateSoftwareCost,
  calculateTotalMonthlyCost,
  calculateOneTimeInvestment,
} from '@/lib/pricing-engine'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0D2137',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2pt solid #00B4E6',
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0D2137',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0D2137',
    marginTop: 20,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1pt solid #E5E7EB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  rowAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#F9FAFB',
  },
  rowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: '#F0F9FF',
    marginTop: 2,
  },
  rowLabel: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  rowValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0D2137',
    textAlign: 'right' as const,
  },
  rowLabelBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0D2137',
    flex: 1,
  },
  totalBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#0D2137',
    borderRadius: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#00B4E6',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dreHeader: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#6B7280',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#EFF6FF',
    marginTop: 4,
  },
  dreResultPositive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 4,
    marginTop: 4,
  },
  dreResultNegative: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 4,
    marginTop: 4,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center' as const,
    fontSize: 8,
    color: '#9CA3AF',
    borderTop: '1pt solid #E5E7EB',
    paddingTop: 8,
  },
  smallText: {
    fontSize: 8,
    color: '#6B7280',
  },
})

function formatBRL(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function ProposalPDF({ state, dre }: { state: ProposalState; dre: DREResult }) {
  const totalConsultations = calculateTotalMonthlyConsultations(state)
  const softwareCost = calculateSoftwareCost(totalConsultations)
  const totalMonthly = calculateTotalMonthlyCost(state)
  const oneTimeInvestment = calculateOneTimeInvestment(state)
  const infraData = state.infrastructure ? INFRASTRUCTURE_OPTIONS[state.infrastructure.option] : null
  const date = new Date().toLocaleDateString('pt-BR')

  return (
    <Document>
      {/* Page 1: Proposta Comercial */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Proposta Comercial</Text>
          <Text style={styles.subtitle}>Prontta Saúde — Simulação gerada em {date}</Text>
        </View>

        {/* Pacotes Dedicados */}
        {state.dedicatedPackages.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Pacotes — Agenda Dedicada</Text>
            {state.dedicatedPackages.map((pkg, i) => (
              <View key={i} style={i % 2 === 0 ? styles.row : styles.rowAlt}>
                <Text style={styles.rowLabel}>
                  {pkg.specialty} ({CATEGORIES[pkg.category]?.label ?? pkg.category}) — {pkg.quantity} pacote(s), {pkg.totalConsultations} consultas
                </Text>
                <Text style={styles.rowValue}>{formatBRL(pkg.totalCost)}/mês</Text>
              </View>
            ))}
            <View style={styles.rowBold}>
              <Text style={styles.rowLabelBold}>Subtotal Agenda Dedicada</Text>
              <Text style={styles.rowValue}>
                {formatBRL(calculateDedicatedPackagesCost(state.dedicatedPackages))}/mês
              </Text>
            </View>
          </View>
        ) : null}

        {/* Consultas Compartilhadas */}
        {state.sharedConsultations.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Consultas Avulsas — Agenda Compartilhada (preços Intermediários)</Text>
            {state.sharedConsultations.map((sc, i) => (
              <View key={i} style={i % 2 === 0 ? styles.row : styles.rowAlt}>
                <Text style={styles.rowLabel}>
                  {sc.specialty} — {sc.quantity} consultas × {formatBRL(sc.pricePerConsultation)}
                </Text>
                <Text style={styles.rowValue}>{formatBRL(sc.totalCost)}/mês</Text>
              </View>
            ))}
            <View style={styles.rowBold}>
              <Text style={styles.rowLabelBold}>Subtotal Consultas Avulsas</Text>
              <Text style={styles.rowValue}>
                {formatBRL(calculateSharedConsultationsCost(state.sharedConsultations))}/mês
              </Text>
            </View>
          </View>
        ) : null}

        {/* Infraestrutura */}
        <Text style={styles.sectionTitle}>Infraestrutura</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            {infraData ? infraData.label : ''}
            {state.infrastructure.option !== 'propria'
              ? ` (${state.infrastructure.paymentMode === 'compra' ? 'Compra' : 'Aluguel'})`
              : ''}
          </Text>
          <Text style={styles.rowValue}>
            {state.infrastructure.option === 'propria'
              ? 'Sem custo'
              : state.infrastructure.paymentMode === 'compra'
                ? `${formatBRL(state.infrastructure.oneTimeCost)} (à vista)`
                : `${formatBRL(state.infrastructure.monthlyCost)}/mês`}
          </Text>
        </View>

        {/* Software */}
        <Text style={styles.sectionTitle}>Software de Telemedicina</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Plataforma de Telemedicina ({totalConsultations} consultas/mês)
          </Text>
          <Text style={styles.rowValue}>
            {softwareCost === 0 ? 'ISENTO' : `${formatBRL(softwareCost)}/mês`}
          </Text>
        </View>

        {/* Implantação */}
        <Text style={styles.sectionTitle}>Implantação</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Projeto de implantação</Text>
          <Text style={styles.rowValue}>A combinar</Text>
        </View>
        {state.implantationNote ? (
          <View style={{ paddingHorizontal: 4, paddingTop: 4 }}>
            <Text style={styles.smallText}>Obs: {state.implantationNote}</Text>
          </View>
        ) : null}

        {/* Total */}
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total de consultas/mês</Text>
              <Text style={{ ...styles.totalValue, fontSize: 16, color: '#FFFFFF' }}>
                {totalConsultations}
              </Text>
            </View>
            {oneTimeInvestment > 0 ? (
              <View>
                <Text style={styles.totalLabel}>Investimento inicial</Text>
                <Text style={{ ...styles.totalValue, fontSize: 16, color: '#FFFFFF' }}>
                  {formatBRL(oneTimeInvestment)}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.totalLabel}>Custo mensal recorrente</Text>
            <Text style={styles.totalValue}>{formatBRL(totalMonthly)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Proposta válida por 30 dias. Prontta Saúde — contato@pronttasaude.com.br — (31) 99333-3245
        </Text>
      </Page>

      {/* Page 2: DRE - use ternary so Document never receives false as child (react-pdf may call hasOwnProperty on children) */}
      {dre.receitaBruta > 0 ? (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Simulação de Rentabilidade</Text>
            <Text style={styles.subtitle}>DRE Simplificada — Simulação baseada em 100% de ocupação</Text>
          </View>

          {/* Receita */}
          <Text style={styles.dreHeader}>RECEITA BRUTA</Text>
          {dre.receitaDedicada > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Consultas Agenda Dedicada</Text>
              <Text style={styles.rowValue}>{formatBRL(dre.receitaDedicada)}</Text>
            </View>
          ) : null}
          {dre.receitaCompartilhada > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Consultas Agenda Compartilhada</Text>
              <Text style={styles.rowValue}>{formatBRL(dre.receitaCompartilhada)}</Text>
            </View>
          ) : null}
          <View style={styles.rowBold}>
            <Text style={styles.rowLabelBold}>= Total Receita Bruta</Text>
            <Text style={styles.rowValue}>{formatBRL(dre.receitaBruta)}</Text>
          </View>

          {/* Impostos */}
          <Text style={styles.dreHeader}>(-) IMPOSTOS SOBRE VENDAS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Impostos ({state.taxPercentage}%)</Text>
            <Text style={styles.rowValue}>- {formatBRL(dre.impostos)}</Text>
          </View>
          <View style={styles.rowBold}>
            <Text style={styles.rowLabelBold}>= Receita Líquida</Text>
            <Text style={styles.rowValue}>{formatBRL(dre.receitaLiquida)}</Text>
          </View>

          {/* Custos */}
          <Text style={styles.dreHeader}>(-) CUSTOS DOS SERVIÇOS</Text>
          {dre.custoDedicada > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Pacotes Agenda Dedicada</Text>
              <Text style={styles.rowValue}>- {formatBRL(dre.custoDedicada)}</Text>
            </View>
          ) : null}
          {dre.custoCompartilhada > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Consultas Compartilhadas</Text>
              <Text style={styles.rowValue}>- {formatBRL(dre.custoCompartilhada)}</Text>
            </View>
          ) : null}
          {dre.custoSoftware > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Software de Telemedicina</Text>
              <Text style={styles.rowValue}>- {formatBRL(dre.custoSoftware)}</Text>
            </View>
          ) : null}
          {dre.custoInfraestrutura > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Infraestrutura</Text>
              <Text style={styles.rowValue}>- {formatBRL(dre.custoInfraestrutura)}</Text>
            </View>
          ) : null}

          {/* Lucro Bruto */}
          <View style={styles.rowBold}>
            <Text style={styles.rowLabelBold}>= Lucro Bruto ({dre.margemBruta.toFixed(1)}%)</Text>
            <Text style={styles.rowValue}>{formatBRL(dre.lucroBruto)}</Text>
          </View>

          {/* Despesas */}
          <Text style={styles.dreHeader}>(-) DESPESAS OPERACIONAIS</Text>
          {dre.custoFuncionarios > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Funcionários (CLT)</Text>
              <Text style={styles.rowValue}>- {formatBRL(dre.custoFuncionarios)}</Text>
            </View>
          ) : null}
          {dre.despesasFixas > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Despesas Fixas</Text>
              <Text style={styles.rowValue}>- {formatBRL(dre.despesasFixas)}</Text>
            </View>
          ) : null}

          {/* Resultado */}
          <View style={dre.resultadoOperacional >= 0 ? styles.dreResultPositive : styles.dreResultNegative}>
            <Text style={{
              ...styles.rowLabelBold,
              fontSize: 12,
              color: dre.resultadoOperacional >= 0 ? '#047857' : '#DC2626',
            }}>
              = RESULTADO OPERACIONAL
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: 'Helvetica-Bold',
              color: dre.resultadoOperacional >= 0 ? '#047857' : '#DC2626',
            }}>
              {formatBRL(dre.resultadoOperacional)} ({dre.margemOperacional.toFixed(1)}%)
            </Text>
          </View>

          <Text style={styles.footer}>
            Simulação válida por 30 dias. Prontta Saúde — contato@pronttasaude.com.br — (31) 99333-3245
          </Text>
        </Page>
      ) : null}
    </Document>
  )
}

export async function generateProposalPDF(state: ProposalState, dre: DREResult) {
  const blob = await pdf(<ProposalPDF state={state} dre={dre} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `proposta-prontta-saude-${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
