import { Document, Page, View, Text } from '@react-pdf/renderer';
import { pdfStyles } from './styles';
import { CompanyInfoBlock, type PdfCompany } from './CompanyHeader';
import { formatCurrency, formatDateShort } from '@/lib/utils';

export interface PdfQuoteLineItem {
  label: string;
  quantity: number;
  unitPrice: number;
}

export interface PdfQuote {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string | null;
  serviceType: string;
  createdAt: Date;
  lineItems: PdfQuoteLineItem[];
}

export function QuoteDocument({ quote, company }: { quote: PdfQuote; company: PdfCompany }) {
  const total = quote.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
  const quoteNumber = `DEV-${quote.id.slice(-8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerRow}>
          <CompanyInfoBlock company={company} />
          <View>
            <Text style={pdfStyles.docTitle}>DEVIS</Text>
            <Text style={pdfStyles.docMeta}>N° {quoteNumber}</Text>
            <Text style={pdfStyles.docMeta}>Date : {formatDateShort(quote.createdAt)}</Text>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Client</Text>
          <Text style={pdfStyles.smallText}>{quote.clientName}</Text>
          {quote.clientAddress ? <Text style={pdfStyles.smallText}>{quote.clientAddress}</Text> : null}
          <Text style={pdfStyles.smallText}>{quote.clientPhone}</Text>
          <Text style={pdfStyles.smallText}>{quote.clientEmail}</Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Prestation : {quote.serviceType}</Text>
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeaderRow}>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colLabel]}>Désignation</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colQty]}>Qté</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colUnitPrice]}>PU HT</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colTotal]}>Total HT</Text>
            </View>
            {quote.lineItems.map((li, idx) => (
              <View style={pdfStyles.tableRow} key={idx}>
                <Text style={[pdfStyles.tableCell, pdfStyles.colLabel]}>{li.label}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.colQty]}>{li.quantity}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.colUnitPrice]}>{formatCurrency(li.unitPrice)}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.colTotal]}>
                  {formatCurrency(li.quantity * li.unitPrice)}
                </Text>
              </View>
            ))}
          </View>

          <View style={pdfStyles.totalsBlock}>
            <View style={pdfStyles.totalsRowFinal}>
              <Text style={pdfStyles.totalsLabelFinal}>Total HT</Text>
              <Text style={pdfStyles.totalsLabelFinal}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.smallText}>Devis valable 30 jours à compter de la date d&apos;émission.</Text>
        </View>

        <Text style={pdfStyles.footer}>
          {company.name} — {company.address}, {company.postalCode} {company.city} — SIRET {company.siret}
        </Text>
      </Page>
    </Document>
  );
}
