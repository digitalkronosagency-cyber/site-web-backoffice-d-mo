import { Prisma, QuoteStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { QuotesTable } from '@/components/backoffice/QuotesTable';
import { QuotesFilterBar } from '@/components/backoffice/QuotesFilterBar';

export const dynamic = 'force-dynamic';

const SORTABLE_FIELDS = ['createdAt', 'clientName', 'totalAmount', 'status'] as const;

export default async function DevisPage({
  searchParams,
}: {
  searchParams: { status?: string; sortBy?: string; sortDir?: string };
}) {
  const status =
    searchParams.status && (Object.values(QuoteStatus) as string[]).includes(searchParams.status)
      ? (searchParams.status as QuoteStatus)
      : undefined;

  const sortBy = (SORTABLE_FIELDS as readonly string[]).includes(searchParams.sortBy ?? '')
    ? (searchParams.sortBy as (typeof SORTABLE_FIELDS)[number])
    : 'createdAt';

  const sortDir = searchParams.sortDir === 'asc' ? 'asc' : 'desc';

  const orderBy: Prisma.QuoteOrderByWithRelationInput = { [sortBy]: sortDir };

  const quotes = await prisma.quote.findMany({
    where: status ? { status } : undefined,
    orderBy,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Devis</h1>
          <p className="mt-1 text-sm text-gray-500">{quotes.length} devis</p>
        </div>
        <QuotesFilterBar />
      </div>
      <QuotesTable quotes={quotes} />
    </div>
  );
}
