import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '2 solid #0b2545',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0b2545',
    marginBottom: 4,
  },
  smallText: {
    fontSize: 9,
    color: '#555',
    marginBottom: 2,
  },
  docTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0b2545',
    textAlign: 'right',
  },
  docMeta: {
    fontSize: 9,
    color: '#555',
    textAlign: 'right',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0b2545',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    marginTop: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#0b2545',
    padding: 6,
  },
  tableHeaderCell: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottom: '1 solid #e5e5e5',
  },
  tableCell: {
    fontSize: 9,
  },
  colLabel: { width: '50%' },
  colQty: { width: '15%', textAlign: 'right' },
  colUnitPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  totalsBlock: {
    marginTop: 16,
    alignSelf: 'flex-end',
    width: '50%',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalsRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTop: '1 solid #0b2545',
    marginTop: 4,
  },
  totalsLabel: {
    fontSize: 10,
  },
  totalsLabelFinal: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0b2545',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#888',
    textAlign: 'center',
    borderTop: '1 solid #e5e5e5',
    paddingTop: 8,
  },
});
