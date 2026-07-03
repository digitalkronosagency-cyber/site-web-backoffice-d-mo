import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLoginToken } from '@/lib/magic-link';
import { sendEmail } from '@/lib/resend';
import { magicLinkTemplate } from '@/lib/email-templates/magicLink';
import { loginRequestSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

const GENERIC_MESSAGE = 'Si cet email est autorisé, vous recevrez un lien de connexion.';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    if (adminEmail && email === adminEmail) {
      const rawToken = await createLoginToken(email);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
      const loginUrl = `${baseUrl}/api/auth/verify?token=${rawToken}`;

      const company = await prisma.company.findFirst();

      try {
        await sendEmail({
          to: email,
          subject: `Connexion à l'espace admin ${company?.name ?? ''}`.trim(),
          html: magicLinkTemplate(loginUrl),
        });
      } catch (err) {
        console.error('Erreur envoi email magic link:', err);
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
  } catch {
    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
  }
}
