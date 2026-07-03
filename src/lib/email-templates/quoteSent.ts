import { formatCurrency, firstName } from '@/lib/utils';

export function quoteSentTemplate(params: {
  clientName: string;
  serviceType: string;
  totalAmount: number;
  companyName: string;
}) {
  const { clientName, serviceType, totalAmount, companyName } = params;
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0b2545;">Votre devis ${companyName}</h2>
      <p>Bonjour ${firstName(clientName)},</p>
      <p>Veuillez trouver ci-joint votre devis pour la prestation « ${serviceType} », d'un montant total de <strong>${formatCurrency(totalAmount)}</strong>.</p>
      <p>N'hésitez pas à nous contacter pour toute question.</p>
      <p>Cordialement,<br/>${companyName}</p>
    </div>
  `;
}
