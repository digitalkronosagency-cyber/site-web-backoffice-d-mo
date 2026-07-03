'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, daysAgo } from '@/lib/utils';

interface RelanceItem {
  id: string;
  clientName: string;
  serviceType: string;
  sentAt: Date | null;
}

export function RelanceList({ quotes }: { quotes: RelanceItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleRelance(id: string) {
    setLoadingId(id);
    try {
      await fetch(`/api/admin/quotes/${id}/relance`, { method: 'POST' });
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold text-brand-900">Devis à relancer</h3>
      {quotes.length === 0 ? (
        <p className="text-sm text-gray-400">Aucun devis à relancer pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {quotes.map((q) => (
            <li key={q.id} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">{q.clientName}</p>
                <p className="text-gray-500">
                  {q.serviceType} — envoyé {q.sentAt ? `il y a ${daysAgo(q.sentAt)} jours (${formatDate(q.sentAt)})` : ''}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={loadingId === q.id}
                onClick={() => handleRelance(q.id)}
              >
                {loadingId === q.id ? 'Envoi...' : 'Relancer maintenant'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
