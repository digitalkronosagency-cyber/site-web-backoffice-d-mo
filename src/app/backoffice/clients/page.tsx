import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDateShort } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getClients() {
  const quotes = await prisma.quote.findMany({
    include: { invoice: true },
    orderBy: { createdAt: 'desc' },
  });

  const clientsMap = new Map<
    string,
    {
      name: string;
      email: string;
      phone: string;
      quoteCount: number;
      totalInvoiced: number;
      lastActivity: Date;
    }
  >();

  for (const q of quotes) {
    const key = q.clientEmail;
    const existing = clientsMap.get(key);
    const invoiced = q.invoice ? Number(q.invoice.amountTTC) : 0;

    if (existing) {
      existing.quoteCount += 1;
      existing.totalInvoiced += invoiced;
      if (q.createdAt > existing.lastActivity) existing.lastActivity = q.createdAt;
    } else {
      clientsMap.set(key, {
        name: q.clientName,
        email: q.clientEmail,
        phone: q.clientPhone,
        quoteCount: 1,
        totalInvoiced: invoiced,
        lastActivity: q.createdAt,
      });
    }
  }

  return Array.from(clientsMap.values()).sort(
    (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
  );
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Clients</h1>
        <p className="mt-1 text-sm text-gray-500">{clients.length} clients</p>
      </div>

      {clients.length === 0 ? (
        <Card className="p-8 text-center text-sm text-gray-400">Aucun client pour le moment.</Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Nb devis</th>
                <th className="px-4 py-3">Total facturé</th>
                <th className="px-4 py-3">Dernière activité</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.email} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{c.quoteCount}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(c.totalInvoiced)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDateShort(c.lastActivity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
