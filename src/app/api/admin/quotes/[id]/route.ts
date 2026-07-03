import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { quoteUpdateSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { lineItems: { orderBy: { order: 'asc' } }, invoice: true },
  });

  if (!quote) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });

  return NextResponse.json(quote);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = quoteUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', issues: parsed.error.flatten() }, { status: 400 });
  }

  const { lineItems, ...clientFields } = parsed.data;

  const totalAmount = lineItems
    ? lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0)
    : undefined;

  const quote = await prisma.$transaction(async (tx) => {
    if (lineItems) {
      await tx.quoteLineItem.deleteMany({ where: { quoteId: params.id } });
      await tx.quoteLineItem.createMany({
        data: lineItems.map((li, idx) => ({
          quoteId: params.id,
          label: li.label,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          order: idx,
        })),
      });
    }

    return tx.quote.update({
      where: { id: params.id },
      data: {
        ...clientFields,
        ...(totalAmount !== undefined ? { totalAmount } : {}),
      },
      include: { lineItems: { orderBy: { order: 'asc' } } },
    });
  });

  return NextResponse.json(quote);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const quote = await prisma.quote.findUnique({ where: { id: params.id } });
  if (!quote) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });

  if (quote.status === 'SIGNE') {
    return NextResponse.json({ error: 'Impossible de supprimer un devis signé' }, { status: 400 });
  }

  await prisma.quote.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
