import { formatDate, firstName } from '@/lib/utils';

export function quoteRelanceTemplate(params: {
  clientName: string;
  sentAt: Date;
  serviceType: string;
  companyName: string;
}) {
  const { clientName, sentAt, serviceType, companyName } = params;
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <p>Bonjour ${firstName(clientName)},</p>
      <p>Je reviens vers vous concernant le devis envoyé le ${formatDate(sentAt)} pour ${serviceType}. N'hésitez pas si vous avez des questions.</p>
      <p>Cordialement,<br/>${companyName}</p>
    </div>
  `;
}
