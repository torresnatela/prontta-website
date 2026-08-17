'use client';

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { getMargin, getProgram, getSpecialty, PLAN_LABELS, PRICING_MODEL_VERSION } from '@/lib/pricing';
import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { siteConfig } from '@/lib/site-config';
import { formatCurrency, formatPercent } from '@/lib/utils';
import type { ProposalPDFPayload } from './types';

const NAVY = '#00204D';
const CYAN = '#00B3F0';
const MUT = '#5F6B7A';
const LINE = '#EEF3F7';
const INK = '#00204D';

const c = PROPOSAL_CONTENT;

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: INK, lineHeight: 1.5 },
  cover: {
    padding: 44,
    fontFamily: 'Helvetica',
    color: '#FFFFFF',
    backgroundColor: NAVY,
    justifyContent: 'space-between',
  },
  logoChip: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: CYAN,
    fontFamily: 'Helvetica-Bold',
  },
  coverTitle: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', marginTop: 10, lineHeight: 1.2 },
  coverSub: { fontSize: 12, color: '#CDE3F0', marginTop: 12, maxWidth: 380 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  chip: {
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 9,
    color: '#E8F4FA',
  },
  coverFoot: { fontSize: 9, color: '#9FC0D3' },

  h2: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: NAVY, marginTop: 16, marginBottom: 6 },
  p: { fontSize: 10, color: '#374151', marginBottom: 5 },
  strong: { fontFamily: 'Helvetica-Bold', color: NAVY },
  step: { fontSize: 10, color: '#374151', marginBottom: 3 },

  twoCol: { flexDirection: 'row', gap: 16, marginTop: 6 },
  col: { flex: 1 },
  colTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 4 },

  tableHead: { flexDirection: 'row', backgroundColor: '#F4FAFC', paddingVertical: 5, paddingHorizontal: 5 },
  th: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: MUT, textTransform: 'uppercase' },
  row: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5, borderBottomWidth: 0.5, borderBottomColor: LINE },
  cell: { fontSize: 9, color: '#374151' },
  cellRight: { fontSize: 9, color: NAVY, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  totRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5, backgroundColor: '#F4FAFC' },
  totRowLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: NAVY },

  /* Variantes compactas — só as tabelas de 9 colunas da página "Sua proposta" usam.
     O paddingLeft garante a calha entre colunas numéricas: sem ele, um subtotal de 6
     dígitos encosta no valor da coluna seguinte. */
  thSm: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: MUT, textTransform: 'uppercase', paddingLeft: 4 },
  cellSm: { fontSize: 7.5, color: '#374151' },
  cellRightSm: {
    fontSize: 7.5,
    color: NAVY,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    paddingLeft: 4,
  },
  cellRightMut: { fontSize: 7.5, color: '#374151', textAlign: 'right', paddingLeft: 4 },
  /* A margem é o texto mais longo da linha (`R$ 39.020,00 · 30,3%`) e é info secundária. */
  cellMargin: { fontSize: 7, color: '#374151', textAlign: 'right', paddingLeft: 4 },
  totRowLabelSm: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: NAVY },

  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: LINE,
  },
  kvLabel: { fontSize: 9, color: '#374151', flex: 1 },
  kvValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: NAVY, textAlign: 'right' },
  kvTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#F4FAFC',
  },

  totalBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: NAVY,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 9, color: '#9FC0D3', textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: CYAN },
  legal: { fontSize: 7.5, color: MUT, marginTop: 5, lineHeight: 1.45 },

  contactBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#F4FAFC',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: NAVY },
  contactMeta: { fontSize: 9, color: MUT, marginTop: 2 },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: LINE,
    paddingTop: 8,
    fontSize: 7,
    color: MUT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

/** Curtos de propósito: a coluna é estreita e a legenda sob a tabela explica cada um. */
const AGENDA_LABEL: Record<string, string> = {
  dedicada: 'dedicada',
  compartilhada: 'avulsa',
};

/** Pesos de coluna compartilhados pelas duas tabelas, para alinharem na página. */
const COL = {
  nome: 2.3,
  meio: 1.25,
  agenda: 1.1,
  qtd: 0.6,
  custoUnit: 1.25,
  custoTotal: 1.35,
  precoUnit: 1.25,
  subtotal: 1.45,
  margem: 1.85,
} as const;

/** Rótulo das linhas de total: tudo à esquerda da coluna de subtotal. */
const TOT_LABEL_FLEX =
  COL.nome + COL.meio + COL.agenda + COL.qtd + COL.custoUnit + COL.custoTotal + COL.precoUnit;

/** Célula de margem: `R$ 90,00 · 60,0%`. */
function marginLabel(sell: number, cost: number): string {
  const margin = getMargin(sell, cost);
  return `${formatCurrency(margin.amount)} · ${formatPercent(margin.percent)}`;
}

function implantationText(payload: ProposalPDFPayload): string {
  const { implantation } = payload.state;
  if (implantation.mode === 'isento') return 'Isenta';
  if (implantation.mode === 'valor') return formatCurrency(implantation.value);
  return 'A combinar';
}

export function ProposalPDF({ payload }: { payload: ProposalPDFPayload }) {
  const { state, consultations, programs, totals, dre, dateLabel } = payload;
  const percent = formatPercent(dre.margemLiquidaPct);
  const softwareText =
    totals.softwareMonthlyFee === 0 && consultations.totalQuantity > 0
      ? 'ISENTO'
      : formatCurrency(totals.softwareMonthlyFee);

  const sellerName = state.seller.name.trim() || siteConfig.name;
  const sellerEmail = state.seller.email.trim() || siteConfig.contact.email;
  const sellerPhone = state.seller.phone.trim() || siteConfig.contact.phoneDisplay;

  return (
    <Document>
      {/* Capa */}
      <Page size="A4" style={styles.cover}>
        <Text style={styles.logoChip}>{c.brand}</Text>
        <View>
          <Text style={styles.eyebrow}>Proposta Comercial</Text>
          <Text style={styles.coverTitle}>Programas de Saúde Assistida{'\n'}e Consultas Especializadas</Text>
          <Text style={styles.coverSub}>{c.subheadline}</Text>
          <View style={styles.chipRow}>
            <Text style={styles.chip}>{c.numEspecialistas}</Text>
            <Text style={styles.chip}>{c.numEspecialidades}</Text>
            <Text style={styles.chip}>Ciclos de {c.ciclos}</Text>
          </View>
        </View>
        <Text style={styles.coverFoot}>
          Emitida em {dateLabel} · {c.proposalValidity}
        </Text>
      </Page>

      {/* Quem somos */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Quem somos</Text>
        <Text style={styles.h2}>A Prontta Saúde</Text>
        <Text style={styles.p}>
          {c.category}. {c.modelDescription}
        </Text>
        <Text style={styles.p}>{c.aiDisclaimer}</Text>
        <Text style={styles.p}>
          <Text style={styles.strong}>{c.positioningNotIs}</Text>
        </Text>

        <Text style={styles.h2}>Como funciona a implantação</Text>
        {c.implantationSteps.map((step, i) => (
          <Text key={step} style={styles.step}>
            {i + 1}. {step}
          </Text>
        ))}

        <Text style={styles.h2}>O que está incluso e o que não está</Text>
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.colTitle}>Incluso</Text>
            {c.scope.included.map((item) => (
              <Text key={item} style={styles.p}>
                • {item}
              </Text>
            ))}
          </View>
          <View style={styles.col}>
            <Text style={styles.colTitle}>Não incluso</Text>
            {c.scope.notIncluded.map((item) => (
              <Text key={item} style={styles.p}>
                • {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {c.brand} · Programas de Saúde Assistida
          </Text>
          <Text>Emitida em {dateLabel}</Text>
        </View>
      </Page>

      {/* Sua proposta */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Sua proposta</Text>

        {consultations.lines.length > 0 && (
          <View>
            <Text style={styles.h2}>Consultas especializadas</Text>
            <View style={styles.tableHead}>
              <Text style={[styles.thSm, { flex: COL.nome }]}>Especialidade</Text>
              <Text style={[styles.thSm, { flex: COL.meio }]}>Plano</Text>
              <Text style={[styles.thSm, { flex: COL.agenda }]}>Agenda</Text>
              <Text style={[styles.thSm, { flex: COL.qtd, textAlign: 'right' }]}>Qtd.</Text>
              <Text style={[styles.thSm, { flex: COL.custoUnit, textAlign: 'right' }]}>
                Custo unit. (Prontta)
              </Text>
              <Text style={[styles.thSm, { flex: COL.custoTotal, textAlign: 'right' }]}>
                Custo total
              </Text>
              <Text style={[styles.thSm, { flex: COL.precoUnit, textAlign: 'right' }]}>
                Preço unit.
              </Text>
              <Text style={[styles.thSm, { flex: COL.subtotal, textAlign: 'right' }]}>Subtotal</Text>
              <Text style={[styles.thSm, { flex: COL.margem, textAlign: 'right' }]}>Sua margem</Text>
            </View>
            {state.consultationLines.map((line) => {
              const detail = consultations.lines.find((l) => l.lineId === line.id);
              return (
                <View key={line.id} style={styles.row}>
                  <Text style={[styles.cellSm, { flex: COL.nome }]}>
                    {getSpecialty(line.specialtyId).name}
                  </Text>
                  <Text style={[styles.cellSm, { flex: COL.meio }]}>{PLAN_LABELS[line.plan]}</Text>
                  <Text style={[styles.cellSm, { flex: COL.agenda }]}>{AGENDA_LABEL[line.agenda]}</Text>
                  <Text style={[styles.cellRightSm, { flex: COL.qtd }]}>{line.quantity}</Text>
                  <Text style={[styles.cellRightMut, { flex: COL.custoUnit }]}>
                    {detail ? formatCurrency(detail.unitCost) : '—'}
                  </Text>
                  <Text style={[styles.cellRightMut, { flex: COL.custoTotal }]}>
                    {detail ? formatCurrency(detail.lineCost) : '—'}
                  </Text>
                  <Text style={[styles.cellRightSm, { flex: COL.precoUnit }]}>
                    {detail ? formatCurrency(detail.unitSell) : '—'}
                  </Text>
                  <Text style={[styles.cellRightSm, { flex: COL.subtotal }]}>
                    {detail ? formatCurrency(detail.lineSell) : '—'}
                  </Text>
                  <Text style={[styles.cellMargin, { flex: COL.margem }]}>
                    {detail ? marginLabel(detail.unitSell, detail.unitCost) : '—'}
                  </Text>
                </View>
              );
            })}
            <View style={styles.totRow}>
              <Text style={[styles.totRowLabelSm, { flex: TOT_LABEL_FLEX }]}>
                Custo das consultas (repasse à Prontta)
              </Text>
              <Text style={[styles.cellRightMut, { flex: COL.subtotal }]}>
                {formatCurrency(consultations.subtotalCost)}
              </Text>
              <Text style={[styles.cellMargin, { flex: COL.margem }]}>
                {marginLabel(consultations.patientPrice, consultations.subtotalCost)}
              </Text>
            </View>
            <View style={styles.totRow}>
              <Text style={[styles.totRowLabelSm, { flex: TOT_LABEL_FLEX }]}>
                Preço das consultas ao paciente
              </Text>
              <Text style={[styles.cellRightSm, { flex: COL.subtotal }]}>
                {formatCurrency(consultations.patientPrice)}
              </Text>
              <Text style={[styles.cellRightSm, { flex: COL.margem }]} />
            </View>
          </View>
        )}

        {programs.items.length > 0 && (
          <View>
            <Text style={styles.h2}>Programas de Saúde Assistida</Text>
            <View style={styles.tableHead}>
              <Text style={[styles.thSm, { flex: COL.nome + COL.agenda }]}>Programa</Text>
              <Text style={[styles.thSm, { flex: COL.meio, textAlign: 'right' }]}>Ciclo</Text>
              <Text style={[styles.thSm, { flex: COL.qtd, textAlign: 'right' }]}>Qtd.</Text>
              <Text style={[styles.thSm, { flex: COL.custoUnit, textAlign: 'right' }]}>
                Custo unit. (Prontta)
              </Text>
              <Text style={[styles.thSm, { flex: COL.custoTotal, textAlign: 'right' }]}>
                Custo total
              </Text>
              <Text style={[styles.thSm, { flex: COL.precoUnit, textAlign: 'right' }]}>Preço</Text>
              <Text style={[styles.thSm, { flex: COL.subtotal, textAlign: 'right' }]}>Subtotal</Text>
              <Text style={[styles.thSm, { flex: COL.margem, textAlign: 'right' }]}>Sua margem</Text>
            </View>
            {state.programSelections.map((selection) => {
              const item = programs.items.find((i) => i.selectionId === selection.id);
              return (
                <View key={selection.id} style={styles.row}>
                  <Text style={[styles.cellSm, { flex: COL.nome + COL.agenda }]}>
                    {getProgram(selection.programId).name}
                  </Text>
                  <Text style={[styles.cellRightSm, { flex: COL.meio }]}>{selection.cycle} meses</Text>
                  <Text style={[styles.cellRightSm, { flex: COL.qtd }]}>{selection.quantity}</Text>
                  <Text style={[styles.cellRightMut, { flex: COL.custoUnit }]}>
                    {item ? formatCurrency(item.unitRepasse) : '—'}
                  </Text>
                  <Text style={[styles.cellRightMut, { flex: COL.custoTotal }]}>
                    {item ? formatCurrency(item.totalRepasse) : '—'}
                  </Text>
                  <Text style={[styles.cellRightSm, { flex: COL.precoUnit }]}>
                    {item ? formatCurrency(item.unitSell) : '—'}
                  </Text>
                  <Text style={[styles.cellRightSm, { flex: COL.subtotal }]}>
                    {item ? formatCurrency(item.totalSell) : '—'}
                  </Text>
                  <Text style={[styles.cellMargin, { flex: COL.margem }]}>
                    {item ? marginLabel(item.unitSell, item.unitRepasse) : '—'}
                  </Text>
                </View>
              );
            })}
            <View style={styles.totRow}>
              <Text style={[styles.totRowLabelSm, { flex: TOT_LABEL_FLEX }]}>
                Custo dos programas (repasse à Prontta)
              </Text>
              <Text style={[styles.cellRightMut, { flex: COL.subtotal }]}>
                {formatCurrency(programs.subtotalRepasse)}
              </Text>
              <Text style={[styles.cellMargin, { flex: COL.margem }]}>
                {marginLabel(programs.subtotalSell, programs.subtotalRepasse)}
              </Text>
            </View>
            <View style={styles.totRow}>
              <Text style={[styles.totRowLabelSm, { flex: TOT_LABEL_FLEX }]}>Subtotal programas</Text>
              <Text style={[styles.cellRightSm, { flex: COL.subtotal }]}>
                {formatCurrency(programs.subtotalSell)}
              </Text>
              <Text style={[styles.cellRightSm, { flex: COL.margem }]} />
            </View>
          </View>
        )}

        {(consultations.lines.length > 0 || programs.items.length > 0) && (
          <Text style={styles.legal}>{c.legalNotes.custoRepasse}</Text>
        )}

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Valor total simulado ao paciente</Text>
          <Text style={styles.totalValue}>{formatCurrency(totals.totalContractValue)}</Text>
        </View>
        <Text style={styles.legal}>{c.legalNotes.totalSimulado}</Text>

        <View style={[styles.kvRow, { marginTop: 8 }]}>
          <Text style={styles.kvLabel}>
            Software mensal (compra de consultas; isento a partir de 150 consultas/mês)
          </Text>
          <Text style={styles.kvValue}>{softwareText}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabel}>Investimento de implantação (único)</Text>
          <Text style={styles.kvValue}>{implantationText(payload)}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>{c.brand} · Programas de Saúde Assistida</Text>
          <Text>Emitida em {dateLabel}</Text>
        </View>
      </Page>

      {/* Resultado do parceiro — página própria: com as colunas de custo, as tabelas de
          "Sua proposta" ocupam a folha inteira e este bloco não cabe mais junto. */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Seu resultado</Text>
        <Text style={styles.h2}>Simulação de resultado do parceiro</Text>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabel}>Receita estimada no mês (com este mix)</Text>
          <Text style={styles.kvValue}>{formatCurrency(dre.receitaBruta)}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabel}>Repasse à Prontta</Text>
          <Text style={styles.kvValue}>{formatCurrency(dre.repasse)}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabel}>Despesas operacionais estimadas</Text>
          <Text style={styles.kvValue}>{formatCurrency(dre.totalDespesas)}</Text>
        </View>
        <View style={styles.kvTotal}>
          <Text style={styles.totRowLabel}>Resultado líquido estimado no mês ({percent})</Text>
          <Text style={styles.kvValue}>{formatCurrency(dre.resultadoLiquido)}</Text>
        </View>
        <Text style={styles.legal}>
          <Text style={styles.strong}>Sobre os valores desta proposta: </Text>
          {c.legalNotes.resultadoParceiro}
        </Text>

        <View style={styles.footer} fixed>
          <Text>{c.brand} · Programas de Saúde Assistida</Text>
          <Text>Emitida em {dateLabel}</Text>
        </View>
      </Page>

      {/* Segurança jurídica */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Segurança jurídica</Text>
        <Text style={styles.h2}>Responsabilidades de cada parte</Text>
        {c.responsibilities.map((item) => (
          <Text key={item.party} style={styles.p}>
            <Text style={styles.strong}>{item.party}: </Text>
            {item.description}
          </Text>
        ))}

        <Text style={styles.h2}>Compliance e limites regulatórios</Text>
        <Text style={styles.p}>
          <Text style={styles.strong}>Marco legal: </Text>
          {c.legalFramework}
        </Text>
        {c.compliance.map((item) => (
          <Text key={item.title} style={styles.legal}>
            • <Text style={styles.strong}>{item.title}.</Text> {item.description}
          </Text>
        ))}

        <Text style={styles.h2}>Próximos passos</Text>
        <Text style={styles.p}>
          Para avançar, basta responder esta proposta. Agendamos o alinhamento, formalizamos o
          contrato e iniciamos a implantação do seu ponto Prontta.
        </Text>

        <View style={styles.contactBox}>
          <View>
            <Text style={styles.contactName}>{sellerName}</Text>
            <Text style={styles.contactMeta}>
              {sellerEmail} · {sellerPhone}
            </Text>
          </View>
          <Text style={styles.contactMeta}>{c.proposalValidity}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {c.brand} · {siteConfig.contact.phoneDisplay} · {siteConfig.contact.email}
          </Text>
          <Text>Modelo {PRICING_MODEL_VERSION}</Text>
        </View>
      </Page>
    </Document>
  );
}
