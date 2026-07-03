'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface CompanyData {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  siret: string;
  tvaNumber: string;
  description: string;
  cities: string[];
}

export function CompanyForm({ company }: { company: CompanyData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...company,
    citiesText: company.cities.join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          postalCode: form.postalCode,
          city: form.city,
          siret: form.siret,
          tvaNumber: form.tvaNumber,
          description: form.description,
          cities: form.citiesText.split(',').map((c) => c.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error();
      setMessage('Informations mises à jour. Le site public est à jour.');
      router.refresh();
    } catch {
      setMessage('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom de l&apos;entreprise</label>
            <Input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Téléphone</label>
            <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Adresse</label>
            <Input value={form.address} onChange={(e) => update('address', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Code postal</label>
            <Input value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Ville</label>
            <Input value={form.city} onChange={(e) => update('city', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">SIRET</label>
            <Input value={form.siret} onChange={(e) => update('siret', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">N° TVA</label>
            <Input value={form.tvaNumber} onChange={(e) => update('tvaNumber', e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Villes couvertes (séparées par des virgules)</label>
          <Input value={form.citiesText} onChange={(e) => update('citiesText', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <Textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} required />
        </div>
        {message && <p className="text-sm text-green-700">{message}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </form>
    </Card>
  );
}
