import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const invoice = await prisma.invoice.update({
    where: { id: params.id },
    data: { status: 'PAYEE', paidAt: new Date() },
  });

  await logActivity('INVOICE_PAID', `Facture ${invoice.number} marquée payée`);

  return NextResponse.json(invoice);
}
