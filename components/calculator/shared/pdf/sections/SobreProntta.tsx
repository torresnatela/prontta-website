import { Page, View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { SOBRE_PRONTTA } from '../content/static-text'

export function SobreProntta() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={1} title="Sobre a Prontta Saúde" />
      <Text style={styles.paragraph}>{SOBRE_PRONTTA.intro}</Text>

      <Text style={styles.sectionSubtitle}>{SOBRE_PRONTTA.naturezaJuridica.title}</Text>
      <Text style={styles.paragraph}>{SOBRE_PRONTTA.naturezaJuridica.text}</Text>
      <PageFooter />
    </Page>
  )
}
