import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(invoices);
}
