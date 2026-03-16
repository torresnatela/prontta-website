import { Page, View, Text } from '@react-pdf/renderer'
import { styles, COLORS } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { METODOLOGIA_IMPLEMENTACAO } from '../content/static-text'

function ResponsibilityTable({ prefeitura, prontta }: { prefeitura: string[]; prontta: string[] }) {
  return (
    <View style={{ marginTop: 6, marginBottom: 10 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.navy, paddingVertical: 5, paddingHorizontal: 8 }}>
        <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white }}>PREFEITURA</Text>
        <Text style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white }}>PRONTTA SAÚDE</Text>
      </View>
      {/* Rows */}
      {Array.from({ length: Math.max(prefeitura.length, prontta.length) }).map((_, i) => (
        <View key={i} style={{ flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 8, backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.rowAlt, borderBottom: `0.5pt solid ${COLORS.grayBorder}` }}>
          <Text style={{ flex: 1, fontSize: 8, color: COLORS.navy, paddingRight: 6 }}>
            {prefeitura[i] ? `• ${prefeitura[i]}` : ''}
          </Text>
          <Text style={{ flex: 1, fontSize: 8, color: COLORS.navy, paddingRight: 6 }}>
            {prontta[i] ? `• ${prontta[i]}` : ''}
          </Text>
        </View>
      ))}
    </View>
  )
}

export function MetodologiaImplementacao() {
  return (
    <Page size="A4" style={styles.page} wrap>
      <PageHeader />
      <SectionTitle number={7} title="Metodologia de Implementação" />
      <Text style={styles.paragraph}>{METODOLOGIA_IMPLEMENTACAO.intro}</Text>

      {METODOLOGIA_IMPLEMENTACAO.etapas.map((etapa) => (
        <View key={etapa.numero} wrap={false}>
          <Text style={styles.sectionSubtitle}>{etapa.numero} {etapa.title}</Text>
          <ResponsibilityTable prefeitura={etapa.prefeitura} prontta={etapa.prontta} />
        </View>
      ))}
      <PageFooter />
    </Page>
  )
}
