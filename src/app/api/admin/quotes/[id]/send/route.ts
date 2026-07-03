import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { generateQuotePdf } from '@/lib/pdf/generate';
import { sendEmail } from '@/lib/resend';
import { quoteSentTemplate } from '@/lib/email-templates/quoteSent';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { lineItems: { orderBy: { order: 'asc' } } },
  });

  if (!quote) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });

  if (quote.lineItems.length === 0) {
    return NextResponse.json(
      { error: "Ajoutez au moins une ligne de prestation avant d'envoyer le devis" },
      { status: 400 }
    );
  }

  const company = await prisma.company.findFirst();
  if (!company) return NextResponse.json({ error: 'Informations entreprise manquantes' }, { status: 500 });

  const totalAmount = quote.lineItems.reduce(
    (sum, li) => sum + Number(li.quantity) * Number(li.unitPrice),
    0
  );

  const { url, buffer } = await generateQuotePdf(
    {
      id: quote.id,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      clientAddress: quote.clientAddress,
      serviceType: quote.serviceType,
      createdAt: quote.createdAt,
      lineItems: quote.lineItems.map((li) => ({
        label: li.label,
        quantity: Number(li.quantity),
        unitPrice: Number(li.unitPrice),
      })),
    },
    company
  );

  await sendEmail({
    to: quote.clientEmail,
    subject: `Votre devis — ${company.name}`,
    html: quoteSentTemplate({
      clientName: quote.clientName,
      serviceType: quote.serviceType,
      totalAmount,
      companyName: company.name,
    }),
    attachments: [{ filename: `devis-${quote.id.slice(-8)}.pdf`, content: buffer }],
  });

  const updated = await prisma.quote.update({
    where: { id: quote.id },
    data: {
      status: 'ENVOYE',
      sentAt: new Date(),
      totalAmount,
      pdfUrl: url,
    },
  });

  await logActivity('QUOTE_SENT', `Devis envoyé à ${quote.clientName}`, quote.id);

  return NextResponse.json(updated);
}
