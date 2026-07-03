'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';

interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export function TestimonialsEditor({ testimonials: initial }: { testimonials: TestimonialItem[] }) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initial);
  const [newItem, setNewItem] = useState({ name: '', rating: 5, comment: '', date: new Date().toISOString().slice(0, 10) });
  const [busy, setBusy] = useState(false);

  async function deleteTestimonial(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function addTestimonial() {
    if (!newItem.name || !newItem.comment) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const created = await res.json();
      setTestimonials((prev) => [...prev, created]);
      setNewItem({ name: '', rating: 5, comment: '', date: new Date().toISOString().slice(0, 10) });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {testimonials.map((t) => (
        <Card key={t.id} className="flex items-start justify-between gap-4 p-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-brand-900">{t.name}</span>
              <StarRating rating={t.rating} size={14} />
            </div>
            <p className="text-sm text-gray-600">{t.comment}</p>
            <p className="mt-1 text-xs text-gray-400">{new Date(t.date).toLocaleDateString('fr-FR')}</p>
          </div>
          <button disabled={busy} onClick={() => deleteTestimonial(t.id)} className="text-gray-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </Card>
      ))}

      <Card className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-brand-900">Ajouter un avis</h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Input
            placeholder="Nom"
            value={newItem.name}
            onChange={(e) => setNewItem((s) => ({ ...s, name: e.target.value }))}
          />
          <Select
            value={String(newItem.rating)}
            onChange={(e) => setNewItem((s) => ({ ...s, rating: Number(e.target.value) }))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} étoiles
              </option>
            ))}
          </Select>
          <Input
            type="date"
            value={newItem.date}
            onChange={(e) => setNewItem((s) => ({ ...s, date: e.target.value }))}
          />
        </div>
        <Textarea
          className="mt-2"
          placeholder="Commentaire"
          rows={2}
          value={newItem.comment}
          onChange={(e) => setNewItem((s) => ({ ...s, comment: e.target.value }))}
        />
        <Button type="button" className="mt-2" onClick={addTestimonial} disabled={busy}>
          <Plus size={14} /> Ajouter
        </Button>
      </Card>
    </div>
  );
}
