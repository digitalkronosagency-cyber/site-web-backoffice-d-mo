import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { quoteRelanceTemplate } from '@/lib/email-templates/quoteRelance';
import { logActivity } from '@/lib/activity';
import type { Quote } from '@prisma/client';

export async function relanceQuote(quote: Quote, companyName: string) {
  if (!quote.sentAt) {
    throw new Error('Ce devis n\'a pas encore été envoyé');
  }

  await sendEmail({
    to: quote.clientEmail,
    subject: `Suivi de votre devis — ${companyName}`,
    html: quoteRelanceTemplate({
      clientName: quote.clientName,
      sentAt: quote.sentAt,
      serviceType: quote.serviceType,
      companyName,
    }),
  });

  const updated = await prisma.quote.update({
    where: { id: quote.id },
    data: { status: 'RELANCE', lastRelanceAt: new Date() },
  });

  await logActivity('QUOTE_RELAUNCHED', `Relance envoyée à ${quote.clientName}`, quote.id);

  return updated;
}
