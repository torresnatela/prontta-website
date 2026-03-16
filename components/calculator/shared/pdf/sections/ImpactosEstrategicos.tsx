import { Page, View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { IMPACTOS_ESTRATEGICOS } from '../content/static-text'

export function ImpactosEstrategicos() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={10} title="Impactos Estratégicos Para o Município" />
      <Text style={styles.paragraph}>{IMPACTOS_ESTRATEGICOS.intro}</Text>

      {IMPACTOS_ESTRATEGICOS.impactos.map((impacto, i) => (
        <View key={i} style={{ marginBottom: 10 }} wrap={false}>
          <Text style={styles.sectionSubtitle}>{impacto.title}</Text>
          <Text style={styles.paragraph}>{impacto.text}</Text>
        </View>
      ))}
      <PageFooter />
    </Page>
  )
}
