import { StyleSheet } from '@react-pdf/renderer'

// Cores da marca
export const COLORS = {
  cyan: '#00B4E6',
  navy: '#0D2137',
  lightBg: '#E6F9FF',
  gray: '#6B7280',
  grayLight: '#9CA3AF',
  grayBorder: '#E5E7EB',
  white: '#FFFFFF',
  rowAlt: '#F9FAFB',
  highlightBg: '#F0F9FF',
} as const

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 70,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.navy,
  },
  // Header
  header: {
    marginBottom: 20,
    borderBottom: `2pt solid ${COLORS.cyan}`,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.cyan,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  // Footer
  footer: {
    position: 'absolute' as const,
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderTop: `1pt solid ${COLORS.grayBorder}`,
    paddingTop: 8,
  },
  footerContact: {
    fontSize: 7,
    color: COLORS.grayLight,
  },
  footerPage: {
    fontSize: 7,
    color: COLORS.grayLight,
  },
  // Cover
  coverPage: {
    padding: 40,
    paddingBottom: 70,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  coverSubtitle: {
    fontSize: 14,
    color: COLORS.cyan,
    marginBottom: 40,
    textAlign: 'center' as const,
  },
  coverSummary: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  coverDate: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 30,
    textAlign: 'center' as const,
  },
  coverValidity: {
    fontSize: 9,
    color: COLORS.grayLight,
    marginTop: 8,
    textAlign: 'center' as const,
  },
  // Sections
  sectionNumber: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.cyan,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 10,
    color: COLORS.navy,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  paragraphGray: {
    fontSize: 10,
    color: COLORS.gray,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  // Tables
  tableHeader: {
    flexDirection: 'row' as const,
    backgroundColor: COLORS.navy,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    textTransform: 'uppercase' as const,
  },
  tableRow: {
    flexDirection: 'row' as const,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottom: `0.5pt solid ${COLORS.grayBorder}`,
  },
  tableRowAlt: {
    flexDirection: 'row' as const,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: COLORS.rowAlt,
    borderBottom: `0.5pt solid ${COLORS.grayBorder}`,
  },
  tableTotalRow: {
    flexDirection: 'row' as const,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: COLORS.highlightBg,
    borderTop: `1pt solid ${COLORS.cyan}`,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.navy,
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
  },
  // Bullet list
  bulletRow: {
    flexDirection: 'row' as const,
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
    color: COLORS.cyan,
    fontFamily: 'Helvetica-Bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.navy,
    lineHeight: 1.5,
  },
  // Highlight box
  highlightBox: {
    padding: 14,
    backgroundColor: COLORS.lightBg,
    borderRadius: 4,
    borderLeft: `3pt solid ${COLORS.cyan}`,
    marginVertical: 8,
  },
  // Total box (dark)
  totalBox: {
    padding: 16,
    backgroundColor: COLORS.navy,
    borderRadius: 6,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 9,
    color: COLORS.grayLight,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.cyan,
  },
  totalRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 8,
  },
  // Infrastructure cards
  infraCard: {
    padding: 12,
    borderRadius: 4,
    border: `1pt solid ${COLORS.grayBorder}`,
    marginBottom: 8,
  },
  infraCardSelected: {
    padding: 12,
    borderRadius: 4,
    border: `2pt solid ${COLORS.cyan}`,
    backgroundColor: COLORS.lightBg,
    marginBottom: 8,
  },
  // Responsibility table
  respCol: {
    flex: 1,
    paddingHorizontal: 6,
  },
  // Row styles (reusable)
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  rowAlt: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.rowAlt,
  },
  rowBold: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: COLORS.highlightBg,
    marginTop: 2,
  },
  rowLabel: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  rowValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    textAlign: 'right' as const,
  },
  rowLabelBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.navy,
    flex: 1,
  },
  smallText: {
    fontSize: 8,
    color: COLORS.gray,
  },
})
