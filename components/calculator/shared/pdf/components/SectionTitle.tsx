import { View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'

interface SectionTitleProps {
  number: number | string
  title: string
}

export function SectionTitle({ number, title }: SectionTitleProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.sectionNumber}>SEÇÃO {number}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  )
}
