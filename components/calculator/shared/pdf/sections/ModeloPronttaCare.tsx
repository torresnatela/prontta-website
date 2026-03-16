import { Page, View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { MODELO_PRONTTA_CARE } from '../content/static-text'

export function ModeloPronttaCare() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={3} title="O Modelo Prontta Care" />
      <Text style={styles.paragraph}>{MODELO_PRONTTA_CARE.intro}</Text>

      {MODELO_PRONTTA_CARE.pilares.map((pilar, i) => (
        <View key={i} style={styles.highlightBox}>
          <Text style={styles.sectionSubtitle}>{pilar.title}</Text>
          <Text style={styles.paragraph}>{pilar.text}</Text>
        </View>
      ))}
      <PageFooter />
    </Page>
  )
}
