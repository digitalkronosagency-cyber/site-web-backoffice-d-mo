import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/lib/constants';
import { formatCurrency, formatDateShort } from '@/lib/utils';

interface QuoteRow {
  id: string;
  clientName: string;
  serviceType: string;
  totalAmount: unknown;
  status: string;
  createdAt: Date;
}

export function QuotesTable({ quotes }: { quotes: QuoteRow[] }) {
  if (quotes.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-400">Aucun devis trouvé.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Prestation</th>
            <th className="px-4 py-3">Montant</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={q.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{q.clientName}</td>
              <td className="px-4 py-3 text-gray-600">{q.serviceType}</td>
              <td className="px-4 py-3 text-gray-600">
                {q.totalAmount ? formatCurrency(Number(q.totalAmount)) : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge className={QUOTE_STATUS_COLORS[q.status]}>{QUOTE_STATUS_LABELS[q.status]}</Badge>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDateShort(q.createdAt)}</td>
              <td className="px-4 py-3">
                <Link href={`/backoffice/devis/${q.id}`} className="font-medium text-brand hover:underline">
                  {q.status === 'NOUVEAU' ? 'Créer le devis' : 'Voir'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
