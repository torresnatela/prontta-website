import { Page, View, Text } from '@react-pdf/renderer'
import { styles, COLORS } from '../styles'
import { PageHeader } from '../components/PageHeader'
import { PageFooter } from '../components/PageFooter'
import { SectionTitle } from '../components/SectionTitle'
import { INFRAESTRUTURA_ADAPTAVEL } from '../content/static-text'
import type { InfrastructureOption } from '@/lib/calculator-types'

interface InfraestruturaAdaptavelProps {
  selectedOption: InfrastructureOption
}

export function InfraestruturaAdaptavel({ selectedOption }: InfraestruturaAdaptavelProps) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <SectionTitle number={5} title="Infraestrutura Adaptável" />
      <Text style={styles.paragraph}>{INFRAESTRUTURA_ADAPTAVEL.intro}</Text>

      {INFRAESTRUTURA_ADAPTAVEL.opcoes.map((opcao) => {
        const isSelected = opcao.key === selectedOption
        return (
          <View key={opcao.key} style={isSelected ? styles.infraCardSelected : styles.infraCard}>
            {isSelected && (
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: COLORS.cyan, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                OPÇÃO SELECIONADA
              </Text>
            )}
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: COLORS.navy, marginBottom: 4 }}>
              {opcao.title}
            </Text>
            <Text style={styles.paragraph}>{opcao.description}</Text>
          </View>
        )
      })}
      <PageFooter />
    </Page>
  )
}
