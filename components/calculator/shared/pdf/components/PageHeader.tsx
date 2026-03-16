import { View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'
import { LogoSVG } from './LogoSVG'

export function PageHeader() {
  return (
    <View style={styles.header} fixed>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <LogoSVG size={28} />
        <Text style={styles.headerTitle}>Proposta Comercial — Prontta Saúde</Text>
      </View>
    </View>
  )
}
