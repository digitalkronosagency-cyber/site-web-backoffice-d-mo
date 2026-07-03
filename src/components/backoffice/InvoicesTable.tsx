'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '@/lib/constants';
import { formatCurrency, formatDateShort } from '@/lib/utils';

interface InvoiceRow {
  id: string;
  number: string;
  clientName: string;
  amountTTC: number;
  status: string;
  createdAt: string;
}

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function markPaid(id: string) {
    setLoadingId(id);
    try {
      await fetch(`/api/admin/invoices/${id}/pay`, { method: 'POST' });
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function sendInvoice(id: string) {
    setLoadingId(id);
    try {
      await fetch(`/api/admin/invoices/${id}/send`, { method: 'POST' });
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  if (invoices.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-400">Aucune facture pour le moment.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
            <th className="px-4 py-3">N°</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Montant TTC</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{inv.number}</td>
              <td className="px-4 py-3 text-gray-600">{inv.clientName}</td>
              <td className="px-4 py-3 text-gray-600">{formatCurrency(inv.amountTTC)}</td>
              <td className="px-4 py-3">
                <Badge className={INVOICE_STATUS_COLORS[inv.status]}>{INVOICE_STATUS_LABELS[inv.status]}</Badge>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDateShort(inv.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <a href={`/api/admin/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="ghost">
                      PDF
                    </Button>
                  </a>
                  <Button size="sm" variant="outline" disabled={loadingId === inv.id} onClick={() => sendInvoice(inv.id)}>
                    Envoyer
                  </Button>
                  {inv.status === 'EN_ATTENTE' && (
                    <Button size="sm" variant="secondary" disabled={loadingId === inv.id} onClick={() => markPaid(inv.id)}>
                      Marquer payée
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
