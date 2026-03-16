import { View, Text } from '@react-pdf/renderer'
import { styles, COLORS } from '../styles'

interface Column {
  key: string
  label: string
  width: string | number
  align?: 'left' | 'right' | 'center'
  bold?: boolean
}

interface TableProps {
  columns: Column[]
  rows: Record<string, string>[]
  totals?: Record<string, string>
  totalsLabel?: string
}

export function Table({ columns, rows, totals, totalsLabel }: TableProps) {
  return (
    <View>
      {/* Header */}
      <View style={styles.tableHeader}>
        {columns.map((col) => (
          <Text
            key={col.key}
            style={[
              styles.tableHeaderCell,
              { width: col.width, textAlign: col.align || 'left' },
            ]}
          >
            {col.label}
          </Text>
        ))}
      </View>

      {/* Rows */}
      {rows.map((row, i) => (
        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
          {columns.map((col) => (
            <Text
              key={col.key}
              style={[
                col.bold ? styles.tableCellBold : styles.tableCell,
                { width: col.width, textAlign: col.align || 'left' },
              ]}
            >
              {row[col.key] ?? ''}
            </Text>
          ))}
        </View>
      ))}

      {/* Totals */}
      {totals && (
        <View style={styles.tableTotalRow}>
          {columns.map((col, i) => (
            <Text
              key={col.key}
              style={[
                styles.tableCellBold,
                {
                  width: col.width,
                  textAlign: col.align || 'left',
                  color: i === 0 ? COLORS.navy : COLORS.cyan,
                },
              ]}
            >
              {i === 0 ? (totalsLabel || 'TOTAL') : (totals[col.key] ?? '')}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}
