import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { logActivity } from '@/lib/activity';
import { getNextInvoiceNumber } from '@/lib/invoiceNumber';
import { TVA_RATE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  status: z.enum(['SIGNE', 'REFUSE']),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  const quote = await prisma.quote.findUnique({ where: { id: params.id } });
  if (!quote) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });

  const now = new Date();
  const { status } = parsed.data;

  if (status === 'REFUSE') {
    const updated = await prisma.quote.update({
      where: { id: params.id },
      data: { status: 'REFUSE', refusedAt: now },
    });
    await logActivity('QUOTE_REFUSED', `Devis refusé par ${quote.clientName}`, quote.id);
    return NextResponse.json(updated);
  }

  // SIGNE — mark quote signed and auto-create an invoice in a single transaction
  const totalAmount = Number(quote.totalAmount ?? 0);
  const amountHT = totalAmount;
  const amountTTC = Math.round(amountHT * (1 + TVA_RATE / 100) * 100) / 100;

  const result = await prisma.$transaction(async (tx) => {
    const updatedQuote = await tx.quote.update({
      where: { id: params.id },
      data: { status: 'SIGNE', signedAt: now },
    });

    const existingInvoice = await tx.invoice.findUnique({ where: { quoteId: params.id } });
    if (existingInvoice) {
      return { quote: updatedQuote, invoice: existingInvoice };
    }

    const number = await getNextInvoiceNumber();

    const invoice = await tx.invoice.create({
      data: {
        number,
        quoteId: quote.id,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        clientAddress: quote.clientAddress,
        amountHT,
        tvaRate: TVA_RATE,
        amountTTC,
        status: 'EN_ATTENTE',
      },
    });

    return { quote: updatedQuote, invoice };
  });

  await logActivity('QUOTE_SIGNED', `Devis signé par ${quote.clientName}`, quote.id);
  await logActivity('INVOICE_CREATED', `Facture ${result.invoice.number} créée pour ${quote.clientName}`, quote.id);

  return NextResponse.json(result);
}
