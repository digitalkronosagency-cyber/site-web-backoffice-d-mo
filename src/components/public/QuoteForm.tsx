'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SERVICE_TYPE_OPTIONS } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';

export function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceType: SERVICE_TYPE_OPTIONS[0],
    description: '',
    clientAddress: '',
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur');
      setStatus('success');
      setForm({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        serviceType: SERVICE_TYPE_OPTIONS[0],
        description: '',
        clientAddress: '',
      });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center rounded-lg bg-white p-10 text-center shadow-sm">
        <CheckCircle2 size={48} className="mb-4 text-green-600" />
        <h3 className="mb-2 text-xl font-semibold text-brand-900">Demande envoyée !</h3>
        <p className="text-gray-500">
          Merci, votre demande de devis a bien été enregistrée. Nous vous recontacterons rapidement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nom complet</label>
        <Input required value={form.clientName} onChange={(e) => update('clientName', e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Téléphone</label>
        <Input required value={form.clientPhone} onChange={(e) => update('clientPhone', e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <Input
          required
          type="email"
          value={form.clientEmail}
          onChange={(e) => update('clientEmail', e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Type de prestation</label>
        <Select value={form.serviceType} onChange={(e) => update('serviceType', e.target.value)}>
          {SERVICE_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">Adresse d&apos;intervention</label>
        <Input value={form.clientAddress} onChange={(e) => update('clientAddress', e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">Description du besoin</label>
        <Textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600 sm:col-span-2">
          Une erreur est survenue, merci de réessayer ou de nous appeler directement.
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Envoi en cours...' : 'Demander mon devis gratuit'}
        </Button>
      </div>
    </form>
  );
}
