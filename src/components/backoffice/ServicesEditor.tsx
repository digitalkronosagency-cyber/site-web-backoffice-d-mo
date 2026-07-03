'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ICON_OPTIONS, getIcon } from '@/lib/icons';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export function ServicesEditor({ services: initialServices }: { services: ServiceItem[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [newService, setNewService] = useState({ title: '', description: '', icon: ICON_OPTIONS[0] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    router.refresh();
  }

  async function updateField(id: string, field: 'title' | 'description' | 'icon', value: string) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function saveService(id: string) {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: service.title, description: service.description, icon: service.icon }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteService(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      setServices((prev) => prev.filter((s) => s.id !== id));
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function addService() {
    if (!newService.title || !newService.description) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'ajout du service");
      setServices((prev) => [...prev, data]);
      setNewService({ title: '', description: '', icon: ICON_OPTIONS[0] });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'ajout du service");
    } finally {
      setBusy(false);
    }
  }

  async function move(id: string, direction: -1 | 1) {
    const index = services.findIndex((s) => s.id === id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= services.length) return;

    const reordered = [...services];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setServices(reordered);

    setBusy(true);
    try {
      await fetch('/api/admin/services/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: reordered.map((s) => s.id) }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {services.map((service, idx) => {
        const Icon = getIcon(service.icon);
        return (
          <Card key={service.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand">
                <Icon size={20} />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={service.title}
                  onChange={(e) => updateField(service.id, 'title', e.target.value)}
                  onBlur={() => saveService(service.id)}
                />
                <Textarea
                  rows={2}
                  value={service.description}
                  onChange={(e) => updateField(service.id, 'description', e.target.value)}
                  onBlur={() => saveService(service.id)}
                />
                <Select
                  value={service.icon}
                  onChange={(e) => {
                    updateField(service.id, 'icon', e.target.value);
                    saveService(service.id);
                  }}
                  className="w-auto"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <button disabled={busy || idx === 0} onClick={() => move(service.id, -1)} className="text-gray-400 hover:text-brand disabled:opacity-30">
                  <ArrowUp size={16} />
                </button>
                <button disabled={busy || idx === services.length - 1} onClick={() => move(service.id, 1)} className="text-gray-400 hover:text-brand disabled:opacity-30">
                  <ArrowDown size={16} />
                </button>
                <button disabled={busy} onClick={() => deleteService(service.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        );
      })}

      <Card className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-brand-900">Ajouter un service</h4>
        <div className="space-y-2">
          <Input
            placeholder="Titre"
            value={newService.title}
            onChange={(e) => setNewService((s) => ({ ...s, title: e.target.value }))}
          />
          <Textarea
            placeholder="Description"
            rows={2}
            value={newService.description}
            onChange={(e) => setNewService((s) => ({ ...s, description: e.target.value }))}
          />
          <Select
            value={newService.icon}
            onChange={(e) => setNewService((s) => ({ ...s, icon: e.target.value }))}
            className="w-auto"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
          <Button type="button" onClick={addService} disabled={busy}>
            <Plus size={14} /> Ajouter
          </Button>
        </div>
      </Card>
    </div>
  );
}
