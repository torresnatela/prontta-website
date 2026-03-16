import { View, Text } from '@react-pdf/renderer'
import { styles } from '../styles'

export function PageFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerContact}>
        leonardo.diniz@pronttasaude.com.br | (31) 98492-7635
      </Text>
      <Text
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  )
}
