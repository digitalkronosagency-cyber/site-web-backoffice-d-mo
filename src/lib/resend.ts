import { Resend } from 'resend';
import { withTimeout } from '@/lib/with-timeout';

const EMAIL_TIMEOUT_MS = 20_000;

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || 'Électricité Dumont <onboarding@resend.dev>';
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailOptions) {
  const resend = getResendClient();

  const result = await withTimeout(
    resend.emails.send({
      from: getFromAddress(),
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    }),
    EMAIL_TIMEOUT_MS,
    'Resend'
  );

  // The Resend SDK returns { data, error } instead of throwing on failure —
  // surface that as a thrown error so callers' try/catch and status
  // transitions (e.g. quote -> "Envoyé") only happen on genuine success.
  if (result.error) {
    throw new Error(`Échec de l'envoi de l'email: ${result.error.message}`);
  }

  return result;
}
