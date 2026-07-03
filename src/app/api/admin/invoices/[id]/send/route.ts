import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { generateInvoicePdf } from '@/lib/pdf/generate';
import { sendEmail } from '@/lib/resend';
import { invoiceSentTemplate } from '@/lib/email-templates/invoiceSent';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { quote: true },
  });
  if (!invoice) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });

  const company = await prisma.company.findFirst();
  if (!company) return NextResponse.json({ error: 'Informations entreprise manquantes' }, { status: 500 });

  let url: string;
  let buffer: Buffer;

  try {
    ({ url, buffer } = await generateInvoicePdf(
      {
        id: invoice.id,
        number: invoice.number,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        amountHT: Number(invoice.amountHT),
        tvaRate: Number(invoice.tvaRate),
        amountTTC: Number(invoice.amountTTC),
        createdAt: invoice.createdAt,
        serviceType: invoice.quote.serviceType,
      },
      company
    ));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: `Échec de la génération du PDF: ${message}` }, { status: 502 });
  }

  try {
    await sendEmail({
      to: invoice.clientEmail,
      subject: `Facture ${invoice.number} — ${company.name}`,
      html: invoiceSentTemplate({
        clientName: invoice.clientName,
        invoiceNumber: invoice.number,
        amountTTC: Number(invoice.amountTTC),
        companyName: company.name,
      }),
      attachments: [{ filename: `${invoice.number}.pdf`, content: buffer }],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: `Échec de l'envoi de l'email: ${message}` }, { status: 502 });
  }

  const updated = await prisma.invoice.update({ where: { id: invoice.id }, data: { pdfUrl: url } });

  await logActivity('INVOICE_SENT', `Facture ${invoice.number} envoyée à ${invoice.clientName}`);

  return NextResponse.json(updated);
}
