import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { relanceQuote } from '@/lib/relance';

export const dynamic = 'force-dynamic';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const quote = await prisma.quote.findUnique({ where: { id: params.id } });
  if (!quote) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });

  const company = await prisma.company.findFirst();

  try {
    const updated = await relanceQuote(quote, company?.name ?? 'Électricité Dumont');
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur lors de la relance';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
