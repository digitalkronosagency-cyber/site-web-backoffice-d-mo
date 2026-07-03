'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QuoteLineItemsEditor, type LineItemDraft } from '@/components/backoffice/QuoteLineItemsEditor';
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface QuoteData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string | null;
  serviceType: string;
  description: string;
  status: string;
  createdAt: string;
  sentAt: string | null;
  pdfUrl: string | null;
  lineItems: { label: string; quantity: number; unitPrice: number }[];
}

export function QuoteDetailClient({ quote }: { quote: QuoteData }) {
  const router = useRouter();
  const [lineItems, setLineItems] = useState<LineItemDraft[]>(
    quote.lineItems.map((li) => ({
      label: li.label,
      quantity: Number(li.quantity),
      unitPrice: Number(li.unitPrice),
    }))
  );
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function saveLineItems() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setMessage('Lignes de prestation enregistrées.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function sendQuote() {
    setSending(true);
    setError(null);
    try {
      await saveLineItems();
      const res = await fetch(`/api/admin/quotes/${quote.id}/send`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi');
      setMessage('Devis envoyé au client par email.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSending(false);
    }
  }

  async function updateStatus(status: 'SIGNE' | 'REFUSE') {
    setError(null);
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour du statut');
      setMessage(status === 'SIGNE' ? 'Devis marqué comme signé. Facture créée.' : 'Devis marqué comme refusé.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">{quote.clientName}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Demande du {formatDate(quote.createdAt)} — {quote.serviceType}
          </p>
        </div>
        <Badge className={QUOTE_STATUS_COLORS[quote.status]}>{QUOTE_STATUS_LABELS[quote.status]}</Badge>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div>}

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-brand-900">Informations client</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Nom</label>
            <Input value={quote.clientName} readOnly />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Téléphone</label>
            <Input value={quote.clientPhone} readOnly />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Email</label>
            <Input value={quote.clientEmail} readOnly />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Adresse</label>
            <Input value={quote.clientAddress ?? ''} readOnly />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">Description du besoin</label>
          <Textarea value={quote.description} readOnly rows={3} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-brand-900">Lignes de prestation</h3>
        <QuoteLineItemsEditor lineItems={lineItems} onChange={setLineItems} />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" onClick={saveLineItems} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button onClick={sendQuote} disabled={sending || lineItems.length === 0}>
            {sending ? 'Envoi en cours...' : 'Envoyer le devis'}
          </Button>
          {quote.pdfUrl && (
            <a href={quote.pdfUrl} target="_blank" rel="noreferrer">
              <Button variant="ghost">Télécharger le PDF</Button>
            </a>
          )}
        </div>
      </Card>

      {(quote.status === 'ENVOYE' || quote.status === 'RELANCE') && (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-brand-900">Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => updateStatus('SIGNE')}>
              Marquer comme signé
            </Button>
            <Button variant="danger" onClick={() => updateStatus('REFUSE')}>
              Marquer comme refusé
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
