import { Page, View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { FLUXO_ATENDIMENTO } from '../content/static-text'

export function FluxoAtendimento() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={4} title="Fluxo de Atendimento" />
      <Text style={styles.paragraph}>{FLUXO_ATENDIMENTO.intro}</Text>

      {FLUXO_ATENDIMENTO.etapas.map((etapa, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Text style={styles.sectionSubtitle}>{etapa.title}</Text>
          <Text style={styles.paragraph}>{etapa.text}</Text>
        </View>
      ))}
      <PageFooter />
    </Page>
  )
}
