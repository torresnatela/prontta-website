import { Page, View, Text } from '@react-pdf/renderer'
import { styles, COLORS } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { CONCLUSAO } from '../content/static-text'

export function Conclusao() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={11} title="Conclusão" />
      {CONCLUSAO.paragraphs.map((p, i) => (
        <Text key={i} style={styles.paragraph}>{p}</Text>
      ))}

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: COLORS.navy, lineHeight: 1.8 }}>
          {CONCLUSAO.fechamento}
        </Text>
      </View>

      <View style={{ marginTop: 40, padding: 16, backgroundColor: COLORS.lightBg, borderRadius: 6, alignItems: 'center' }}>
        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLORS.navy, marginBottom: 4 }}>
          Contato
        </Text>
        <Text style={{ fontSize: 10, color: COLORS.navy }}>
          leonardo.diniz@pronttasaude.com.br | (31) 98492-7635
        </Text>
      </View>
      <PageFooter />
    </Page>
  )
}
