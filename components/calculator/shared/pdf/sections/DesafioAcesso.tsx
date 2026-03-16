import { Page, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { DESAFIO_ACESSO } from '../content/static-text'

export function DesafioAcesso() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={2} title="O Desafio do Acesso à Saúde Especializada" />
      {DESAFIO_ACESSO.paragraphs.map((p, i) => (
        <Text key={i} style={styles.paragraph}>{p}</Text>
      ))}
      <PageFooter />
    </Page>
  )
}
