import { formatCurrency, firstName } from '@/lib/utils';

export function invoiceSentTemplate(params: {
  clientName: string;
  invoiceNumber: string;
  amountTTC: number;
  companyName: string;
}) {
  const { clientName, invoiceNumber, amountTTC, companyName } = params;
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0b2545;">Facture ${invoiceNumber}</h2>
      <p>Bonjour ${firstName(clientName)},</p>
      <p>Veuillez trouver ci-joint votre facture n°${invoiceNumber} d'un montant de <strong>${formatCurrency(amountTTC)}</strong> TTC.</p>
      <p>Merci de votre confiance.</p>
      <p>Cordialement,<br/>${companyName}</p>
    </div>
  `;
}
