import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { generateInvoicePdf } from '@/lib/pdf/generate';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { quote: true },
  });
  if (!invoice) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });

  const company = await prisma.company.findFirst();
  if (!company) return NextResponse.json({ error: 'Informations entreprise manquantes' }, { status: 500 });

  const { url } = await generateInvoicePdf(
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
  );

  await prisma.invoice.update({ where: { id: invoice.id }, data: { pdfUrl: url } });

  return NextResponse.redirect(url);
}
