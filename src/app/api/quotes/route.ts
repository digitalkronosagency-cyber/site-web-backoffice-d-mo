import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { quoteRequestSchema } from '@/lib/validators';
import { logActivity } from '@/lib/activity';
import { sendEmail } from '@/lib/resend';
import { quoteReceivedTemplate } from '@/lib/email-templates/quoteReceived';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = quoteRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const quote = await prisma.quote.create({
    data: {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientAddress: data.clientAddress || null,
      serviceType: data.serviceType,
      description: data.description,
      status: 'NOUVEAU',
    },
  });

  await logActivity('QUOTE_CREATED', `Nouvelle demande de devis de ${data.clientName}`, quote.id);

  try {
    const company = await prisma.company.findFirst();
    if (company) {
      await sendEmail({
        to: data.clientEmail,
        subject: `Demande de devis bien reçue — ${company.name}`,
        html: quoteReceivedTemplate({
          clientName: data.clientName,
          companyName: company.name,
          phone: company.phone,
        }),
      });
    }
  } catch (err) {
    console.error('Erreur envoi email de confirmation:', err);
  }

  return NextResponse.json({ success: true, id: quote.id }, { status: 201 });
}
