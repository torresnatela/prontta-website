import { View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'

interface BulletListProps {
  items: string[]
}

export function BulletList({ items }: BulletListProps) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>{'\u2022'}</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}
