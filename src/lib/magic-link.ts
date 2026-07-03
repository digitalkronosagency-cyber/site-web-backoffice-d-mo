import { randomBytes, createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

const TOKEN_TTL_MINUTES = 15;

export function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

export async function createLoginToken(email: string): Promise<string> {
  const rawToken = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

  await prisma.adminLoginToken.create({
    data: {
      tokenHash: hashToken(rawToken),
      email,
      expiresAt,
    },
  });

  return rawToken;
}

export async function consumeLoginToken(rawToken: string): Promise<string | null> {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.adminLoginToken.findUnique({ where: { tokenHash } });

  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;

  await prisma.adminLoginToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.email;
}
