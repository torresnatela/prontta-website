import { Page, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { BulletList } from '../components/BulletList'
import { CONECTIVIDADE } from '../content/static-text'

export function Conectividade() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={6} title="Conectividade e Interoperabilidade com o SUS" />
      {CONECTIVIDADE.paragraphs.map((p, i) => (
        <Text key={i} style={styles.paragraph}>{p}</Text>
      ))}
      <BulletList items={CONECTIVIDADE.itens} />
      <PageFooter />
    </Page>
  )
}
