import { firstName } from '@/lib/utils';

export function quoteReceivedTemplate(params: { clientName: string; companyName: string; phone: string }) {
  const { clientName, companyName, phone } = params;
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0b2545;">Demande de devis bien reçue</h2>
      <p>Bonjour ${firstName(clientName)},</p>
      <p>Nous avons bien reçu votre demande de devis. Notre équipe vous recontactera très rapidement.</p>
      <p>Pour toute urgence, vous pouvez nous joindre directement au ${phone}.</p>
      <p>Cordialement,<br/>${companyName}</p>
    </div>
  `;
}
