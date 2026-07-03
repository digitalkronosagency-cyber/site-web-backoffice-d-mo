import { renderToBuffer } from '@react-pdf/renderer';
import { QuoteDocument, type PdfQuote } from './QuoteDocument';
import { InvoiceDocument, type PdfInvoice } from './InvoiceDocument';
import type { PdfCompany } from './CompanyHeader';
import { uploadFile } from '@/lib/blob';

export async function generateQuotePdf(quote: PdfQuote, company: PdfCompany) {
  const buffer = await renderToBuffer(QuoteDocument({ quote, company }));
  const url = await uploadFile(`devis/${quote.id}.pdf`, buffer, 'application/pdf');
  return { buffer, url };
}

export async function generateInvoicePdf(invoice: PdfInvoice & { id: string }, company: PdfCompany) {
  const buffer = await renderToBuffer(InvoiceDocument({ invoice, company }));
  const url = await uploadFile(`factures/${invoice.id}.pdf`, buffer, 'application/pdf');
  return { buffer, url };
}
