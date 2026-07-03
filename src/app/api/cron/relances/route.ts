import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { relanceQuote } from '@/lib/relance';
import { RELANCE_DELAY_DAYS } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const threshold = new Date(Date.now() - RELANCE_DELAY_DAYS * 24 * 60 * 60 * 1000);

  const quotesToRelance = await prisma.quote.findMany({
    where: {
      status: 'ENVOYE',
      sentAt: { lte: threshold },
    },
  });

  const company = await prisma.company.findFirst();
  const companyName = company?.name ?? 'Électricité Dumont';

  let processed = 0;
  const errors: string[] = [];

  for (const quote of quotesToRelance) {
    try {
      await relanceQuote(quote, companyName);
      processed += 1;
    } catch (err) {
      errors.push(`${quote.id}: ${err instanceof Error ? err.message : 'erreur inconnue'}`);
    }
  }

  return NextResponse.json({ processed, total: quotesToRelance.length, errors });
}
