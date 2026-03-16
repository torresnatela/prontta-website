import { Page, View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { LogoSVG } from '../components/LogoSVG'
import { PageFooter } from '../components/PageFooter'
import { formatDate } from '../utils'

interface CoverPageProps {
  totalSpecialties: number
  totalConsultations: number
}

export function CoverPage({ totalSpecialties, totalConsultations }: CoverPageProps) {
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={{ alignItems: 'center', marginTop: 80 }}>
        <LogoSVG size={80} />
        <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0D2137', marginTop: 12 }}>
          prontta saúde
        </Text>
      </View>

      <View style={{ marginTop: 60, alignItems: 'center' }}>
        <Text style={styles.coverTitle}>PROPOSTA COMERCIAL</Text>
        <Text style={styles.coverSubtitle}>
          Solução de Telessaúde Semipresencial Assistida
        </Text>
      </View>

      <View style={{ marginTop: 20, padding: 20, backgroundColor: '#E6F9FF', borderRadius: 6, alignItems: 'center' }}>
        <Text style={styles.coverSummary}>
          Agenda Dedicada — {totalSpecialties} Especialidade{totalSpecialties !== 1 ? 's' : ''} / {totalConsultations} consultas/mês
        </Text>
      </View>

      <Text style={styles.coverDate}>
        Simulação gerada em {formatDate()}
      </Text>
      <Text style={styles.coverValidity}>
        Proposta válida por 30 dias
      </Text>

      <PageFooter />
    </Page>
  )
}
