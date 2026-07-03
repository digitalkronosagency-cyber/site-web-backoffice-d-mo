import { NextResponse } from 'next/server';
import { Prisma, QuoteStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export const dynamic = 'force-dynamic';

const SORTABLE_FIELDS = ['createdAt', 'clientName', 'totalAmount', 'status'] as const;

export async function GET(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status');
  const sortByParam = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

  const status =
    statusParam && (Object.values(QuoteStatus) as string[]).includes(statusParam)
      ? (statusParam as QuoteStatus)
      : undefined;

  const sortBy = (SORTABLE_FIELDS as readonly string[]).includes(sortByParam)
    ? (sortByParam as (typeof SORTABLE_FIELDS)[number])
    : 'createdAt';

  const orderBy: Prisma.QuoteOrderByWithRelationInput = { [sortBy]: sortDir };

  const quotes = await prisma.quote.findMany({
    where: status ? { status } : undefined,
    orderBy,
    include: { lineItems: true },
  });

  return NextResponse.json(quotes);
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();

  const quote = await prisma.quote.create({
    data: {
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      clientAddress: body.clientAddress || null,
      serviceType: body.serviceType,
      description: body.description || '',
      status: 'NOUVEAU',
    },
  });

  return NextResponse.json(quote, { status: 201 });
}
