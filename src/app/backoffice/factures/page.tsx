import { prisma } from '@/lib/prisma';
import { InvoicesTable } from '@/components/backoffice/InvoicesTable';

export const dynamic = 'force-dynamic';

export default async function FacturesPage() {
  const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Factures</h1>
        <p className="mt-1 text-sm text-gray-500">{invoices.length} factures</p>
      </div>
      <InvoicesTable
        invoices={invoices.map((inv) => ({
          id: inv.id,
          number: inv.number,
          clientName: inv.clientName,
          amountTTC: Number(inv.amountTTC),
          status: inv.status,
          createdAt: inv.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
