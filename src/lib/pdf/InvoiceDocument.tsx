import { Document, Page, View, Text } from '@react-pdf/renderer';
import { pdfStyles } from './styles';
import { CompanyInfoBlock, type PdfCompany } from './CompanyHeader';
import { formatCurrency, formatDateShort } from '@/lib/utils';

export interface PdfInvoice {
  number: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string | null;
  amountHT: number;
  tvaRate: number;
  amountTTC: number;
  createdAt: Date;
  serviceType: string;
}

export function InvoiceDocument({ invoice, company }: { invoice: PdfInvoice; company: PdfCompany }) {
  const tvaAmount = invoice.amountTTC - invoice.amountHT;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerRow}>
          <CompanyInfoBlock company={company} />
          <View>
            <Text style={pdfStyles.docTitle}>FACTURE</Text>
            <Text style={pdfStyles.docMeta}>N° {invoice.number}</Text>
            <Text style={pdfStyles.docMeta}>Date : {formatDateShort(invoice.createdAt)}</Text>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Facturé à</Text>
          <Text style={pdfStyles.smallText}>{invoice.clientName}</Text>
          {invoice.clientAddress ? <Text style={pdfStyles.smallText}>{invoice.clientAddress}</Text> : null}
          <Text style={pdfStyles.smallText}>{invoice.clientEmail}</Text>
        </View>

        <View style={pdfStyles.section}>
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeaderRow}>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colLabel]}>Désignation</Text>
              <Text style={[pdfStyles.tableHeaderCell, { width: '50%', textAlign: 'right' }]}>Montant HT</Text>
            </View>
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, pdfStyles.colLabel]}>{invoice.serviceType}</Text>
              <Text style={[pdfStyles.tableCell, { width: '50%', textAlign: 'right' }]}>
                {formatCurrency(invoice.amountHT)}
              </Text>
            </View>
          </View>

          <View style={pdfStyles.totalsBlock}>
            <View style={pdfStyles.totalsRow}>
              <Text style={pdfStyles.totalsLabel}>Total HT</Text>
              <Text style={pdfStyles.totalsLabel}>{formatCurrency(invoice.amountHT)}</Text>
            </View>
            <View style={pdfStyles.totalsRow}>
              <Text style={pdfStyles.totalsLabel}>TVA ({invoice.tvaRate}%)</Text>
              <Text style={pdfStyles.totalsLabel}>{formatCurrency(tvaAmount)}</Text>
            </View>
            <View style={pdfStyles.totalsRowFinal}>
              <Text style={pdfStyles.totalsLabelFinal}>Total TTC</Text>
              <Text style={pdfStyles.totalsLabelFinal}>{formatCurrency(invoice.amountTTC)}</Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.smallText}>Paiement à réception de facture. Aucun escompte pour paiement anticipé.</Text>
          <Text style={pdfStyles.smallText}>
            En cas de retard de paiement, une pénalité de 3 fois le taux d&apos;intérêt légal sera appliquée, ainsi qu&apos;une
            indemnité forfaitaire de 40€ pour frais de recouvrement (art. L441-10 du Code de commerce).
          </Text>
        </View>

        <Text style={pdfStyles.footer}>
          {company.name} — {company.address}, {company.postalCode} {company.city} — SIRET {company.siret} — TVA{' '}
          {company.tvaNumber}
        </Text>
      </Page>
    </Document>
  );
}
