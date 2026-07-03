export const QUOTE_STATUS_LABELS: Record<string, string> = {
  NOUVEAU: 'Nouveau',
  ENVOYE: 'Envoyé',
  RELANCE: 'Relancé',
  SIGNE: 'Signé',
  REFUSE: 'Refusé',
};

export const QUOTE_STATUS_COLORS: Record<string, string> = {
  NOUVEAU: 'bg-blue-100 text-blue-800',
  ENVOYE: 'bg-amber-100 text-amber-800',
  RELANCE: 'bg-orange-100 text-orange-800',
  SIGNE: 'bg-green-100 text-green-800',
  REFUSE: 'bg-red-100 text-red-800',
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente de paiement',
  PAYEE: 'Payée',
};

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800',
  PAYEE: 'bg-green-100 text-green-800',
};

export const SERVICE_TYPE_OPTIONS = [
  'Installation électrique',
  'Mise aux normes',
  'Dépannage urgence',
  'Tableau électrique',
  'Borne de recharge',
  'Rénovation électrique',
  'Domotique',
  'Autre',
];

export const RELANCE_DELAY_DAYS = 5;

export const TVA_RATE = 20.0;

export const ACTIVITY_LABELS: Record<string, string> = {
  QUOTE_CREATED: 'Nouvelle demande de devis',
  QUOTE_SENT: 'Devis envoyé',
  QUOTE_RELAUNCHED: 'Devis relancé',
  QUOTE_SIGNED: 'Devis signé',
  QUOTE_REFUSED: 'Devis refusé',
  INVOICE_CREATED: 'Facture créée',
  INVOICE_SENT: 'Facture envoyée',
  INVOICE_PAID: 'Facture payée',
};
