import { Page, View, Text } from '@react-pdf/renderer'
import { styles, COLORS } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { RESUMO_RESPONSABILIDADES } from '../content/static-text'

export function ResumoResponsabilidades() {
  const maxRows = Math.max(
    RESUMO_RESPONSABILIDADES.prefeitura.length,
    RESUMO_RESPONSABILIDADES.prontta.length
  )

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={8} title="Resumo de Responsabilidades" />
      <Text style={styles.paragraph}>{RESUMO_RESPONSABILIDADES.intro}</Text>

      <View>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.navy, paddingVertical: 6, paddingHorizontal: 10 }}>
          <Text style={{ flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.white }}>
            PREFEITURA
          </Text>
          <Text style={{ flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.white }}>
            PRONTTA SAÚDE
          </Text>
        </View>
        {/* Rows */}
        {Array.from({ length: maxRows }).map((_, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              paddingVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.rowAlt,
              borderBottom: `0.5pt solid ${COLORS.grayBorder}`,
            }}
          >
            <Text style={{ flex: 1, fontSize: 9, color: COLORS.navy, paddingRight: 8 }}>
              {RESUMO_RESPONSABILIDADES.prefeitura[i] ? `• ${RESUMO_RESPONSABILIDADES.prefeitura[i]}` : ''}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: COLORS.navy, paddingRight: 8 }}>
              {RESUMO_RESPONSABILIDADES.prontta[i] ? `• ${RESUMO_RESPONSABILIDADES.prontta[i]}` : ''}
            </Text>
          </View>
        ))}
      </View>
      <PageFooter />
    </Page>
  )
}
