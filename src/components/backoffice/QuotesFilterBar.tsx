'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { QUOTE_STATUS_LABELS } from '@/lib/constants';

export function QuotesFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/backoffice/devis?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        className="w-auto"
        defaultValue={searchParams.get('status') ?? ''}
        onChange={(e) => updateParam('status', e.target.value)}
      >
        <option value="">Tous les statuts</option>
        {Object.entries(QUOTE_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        className="w-auto"
        defaultValue={searchParams.get('sortBy') ?? 'createdAt'}
        onChange={(e) => updateParam('sortBy', e.target.value)}
      >
        <option value="createdAt">Trier par date</option>
        <option value="clientName">Trier par client</option>
        <option value="totalAmount">Trier par montant</option>
        <option value="status">Trier par statut</option>
      </Select>
      <Select
        className="w-auto"
        defaultValue={searchParams.get('sortDir') ?? 'desc'}
        onChange={(e) => updateParam('sortDir', e.target.value)}
      >
        <option value="desc">Décroissant</option>
        <option value="asc">Croissant</option>
      </Select>
    </div>
  );
}
