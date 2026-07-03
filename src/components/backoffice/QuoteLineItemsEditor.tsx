'use client';

import { Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export interface LineItemDraft {
  label: string;
  quantity: number;
  unitPrice: number;
}

export function QuoteLineItemsEditor({
  lineItems,
  onChange,
}: {
  lineItems: LineItemDraft[];
  onChange: (items: LineItemDraft[]) => void;
}) {
  const total = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);

  function update(index: number, field: keyof LineItemDraft, value: string) {
    const next = [...lineItems];
    next[index] = {
      ...next[index],
      [field]: field === 'label' ? value : Number(value),
    };
    onChange(next);
  }

  function remove(index: number) {
    onChange(lineItems.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...lineItems, { label: '', quantity: 1, unitPrice: 0 }]);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-2 text-xs font-medium uppercase text-gray-500">
        <div className="col-span-6">Désignation</div>
        <div className="col-span-2">Quantité</div>
        <div className="col-span-2">Prix unitaire</div>
        <div className="col-span-2">Total</div>
      </div>
      {lineItems.map((li, idx) => (
        <div key={idx} className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-6">
            <Input value={li.label} onChange={(e) => update(idx, 'label', e.target.value)} placeholder="Ex: Pose de tableau électrique" />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min={0}
              step="0.5"
              value={li.quantity}
              onChange={(e) => update(idx, 'quantity', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min={0}
              step="0.01"
              value={li.unitPrice}
              onChange={(e) => update(idx, 'unitPrice', e.target.value)}
            />
          </div>
          <div className="col-span-1 text-sm text-gray-600">{formatCurrency(li.quantity * li.unitPrice)}</div>
          <button type="button" onClick={() => remove(idx)} className="col-span-1 text-gray-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus size={14} /> Ajouter une ligne
      </Button>
      <div className="flex justify-end border-t border-gray-200 pt-3 text-base font-semibold text-brand-900">
        Total HT : {formatCurrency(total)}
      </div>
    </div>
  );
}
