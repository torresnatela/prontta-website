'use client';

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import {
  PLAN_LABELS,
  PRICING_MODEL_VERSION,
  getProgram,
  getSpecialty,
} from '@/lib/pricing';
import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { siteConfig } from '@/lib/site-config';
import { formatCurrency } from '@/lib/utils';
import type { ProposalPDFPayload } from './types';

const NAVY = '#0D2137';
const CYAN = '#00B4E6';
const GRAY = '#6B7280';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: NAVY },
  header: { marginBottom: 18, borderBottom: `2pt solid ${CYAN}`, paddingBottom: 12 },
  brand: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: NAVY },
  headline: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: NAVY, marginTop: 6 },
  subtitle: { fontSize: 9, color: GRAY, marginTop: 3 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginTop: 18,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: '1pt solid #E5E7EB',
  },
  tableHead: { flexDirection: 'row', backgroundColor: '#F0F9FF', paddingVertical: 4, paddingHorizontal: 4 },
  th: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GRAY, textTransform: 'uppercase' },
  row: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 4, borderBottom: '0.5pt solid #EEF2F6' },
  cell: { fontSize: 9, color: '#374151' },
  cellRight: { fontSize: 9, color: NAVY, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  dreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottom: '0.5pt solid #EEF2F6',
  },
  dreLabel: { fontSize: 9, color: '#374151', flex: 1 },
  dreValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: NAVY, textAlign: 'right' },
  totalBox: { marginTop: 14, padding: 14, backgroundColor: NAVY, borderRadius: 6 },
  totalLabel: { fontSize: 9, color: '#9CA3AF', marginBottom: 3 },
  totalValue: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: CYAN },
  note: { fontSize: 8, color: GRAY, marginTop: 4 },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: '0.5pt solid #E5E7EB',
    paddingTop: 8,
    fontSize: 7,
    color: GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const AGENDA_LABEL: Record<string, string> = { dedicada: 'Dedicada', compartilhada: 'Compartilhada' };

export function ProposalPDF({ payload }: { payload: ProposalPDFPayload }) {
  const { state, consultations, programs, totals, dre } = payload;
  const client = PROPOSAL_CONTENT.clientTypes[state.clientType];
  const percent = `${dre.margemLiquidaPct.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
  const operationalExpenses = dre.totalDespesas - dre.impostos - dre.software;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>{PROPOSAL_CONTENT.brand}</Text>
          <Text style={styles.headline}>{client.headline}</Text>
          <Text style={styles.subtitle}>
            {PROPOSAL_CONTENT.category} · Plano de referência: {PLAN_LABELS[state.referencePlan]}
          </Text>
        </View>

        {consultations.lines.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Consultas montadas</Text>
            <View style={styles.tableHead}>
              <Text style={[styles.th, { flex: 3 }]}>Especialidade</Text>
              <Text style={[styles.th, { flex: 2 }]}>Agenda</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Qtd.</Text>
              <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Unit.</Text>
              <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Subtotal</Text>
            </View>
            {state.consultationLines.map((line) => {
              const summarized = consultations.lines.find((l) => l.lineId === line.id);
              return (
                <View key={line.id} style={styles.row}>
                  <Text style={[styles.cell, { flex: 3 }]}>{getSpecialty(line.specialtyId).name}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{AGENDA_LABEL[line.agenda]}</Text>
                  <Text style={[styles.cellRight, { flex: 1 }]}>{line.quantity}</Text>
                  <Text style={[styles.cellRight, { flex: 2 }]}>
                    {summarized ? formatCurrency(summarized.unitPrice) : '—'}
                  </Text>
                  <Text style={[styles.cellRight, { flex: 2 }]}>
                    {summarized ? formatCurrency(summarized.lineTotal) : '—'}
                  </Text>
                </View>
              );
            })}
            <View style={styles.dreRow}>
              <Text style={styles.dreLabel}>Consultas na proposta ao paciente</Text>
              <Text style={styles.dreValue}>{formatCurrency(consultations.patientPrice)}</Text>
            </View>
          </View>
        )}

        {programs.items.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Programas de Saúde Assistida</Text>
            <View style={styles.tableHead}>
              <Text style={[styles.th, { flex: 4 }]}>Programa</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Ciclo</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Qtd.</Text>
              <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Subtotal</Text>
            </View>
            {state.programSelections.map((selection) => {
              const item = programs.items.find((i) => i.selectionId === selection.id);
              return (
                <View key={selection.id} style={styles.row}>
                  <Text style={[styles.cell, { flex: 4 }]}>{getProgram(selection.programId).name}</Text>
                  <Text style={[styles.cellRight, { flex: 1 }]}>{selection.cycle}m</Text>
                  <Text style={[styles.cellRight, { flex: 1 }]}>{selection.quantity}</Text>
                  <Text style={[styles.cellRight, { flex: 2 }]}>
                    {item ? formatCurrency(item.total) : '—'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total da proposta ao paciente</Text>
          <Text style={styles.totalValue}>{formatCurrency(totals.totalContractValue)}</Text>
          {totals.softwareMonthlyFee > 0 && (
            <Text style={[styles.totalLabel, { marginTop: 4 }]}>
              + Software mensal: {formatCurrency(totals.softwareMonthlyFee)}/mês
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Simulação de resultado mensal (estimativa)</Text>
        <View style={styles.dreRow}>
          <Text style={styles.dreLabel}>
            Propostas vendidas por mês: {state.dre.proposalsPerMonth}
          </Text>
          <Text style={styles.dreValue} />
        </View>
        <View style={styles.dreRow}>
          <Text style={styles.dreLabel}>(=) Receita bruta mensal</Text>
          <Text style={styles.dreValue}>{formatCurrency(dre.receitaBruta)}</Text>
        </View>
        <View style={styles.dreRow}>
          <Text style={styles.dreLabel}>(−) Custo Prontta (serviços médicos e plataforma)</Text>
          <Text style={styles.dreValue}>{formatCurrency(dre.custoProntta)}</Text>
        </View>
        <View style={styles.dreRow}>
          <Text style={styles.dreLabel}>(−) Impostos sobre a receita</Text>
          <Text style={styles.dreValue}>{formatCurrency(dre.impostos)}</Text>
        </View>
        <View style={styles.dreRow}>
          <Text style={styles.dreLabel}>(−) Despesas operacionais</Text>
          <Text style={styles.dreValue}>{formatCurrency(operationalExpenses)}</Text>
        </View>
        <View style={styles.dreRow}>
          <Text style={styles.dreLabel}>(−) Software mensal Prontta</Text>
          <Text style={styles.dreValue}>{formatCurrency(dre.software)}</Text>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Resultado líquido estimado / mês</Text>
          <Text style={styles.totalValue}>{formatCurrency(dre.resultadoLiquido)}</Text>
          <Text style={[styles.totalLabel, { marginTop: 4 }]}>
            Margem líquida sobre a receita: {percent}
          </Text>
        </View>

        <Text style={styles.note}>{PROPOSAL_CONTENT.softwareRule}</Text>
        <Text style={styles.note}>{PROPOSAL_CONTENT.implantationNote}</Text>
        <Text style={styles.note}>
          Simulação de caráter estimativo; não constitui promessa de resultado. {PROPOSAL_CONTENT.proposalValidity}
        </Text>

        <View style={styles.footer} fixed>
          <Text>
            {PROPOSAL_CONTENT.brand} · {siteConfig.contact.phoneDisplay} · {siteConfig.contact.email}
          </Text>
          <Text>Modelo {PRICING_MODEL_VERSION}</Text>
        </View>
      </Page>
    </Document>
  );
}
