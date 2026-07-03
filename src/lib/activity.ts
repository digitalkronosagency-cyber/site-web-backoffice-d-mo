import { prisma } from '@/lib/prisma';

export async function logActivity(type: string, message: string, quoteId?: string) {
  await prisma.activityLog.create({
    data: { type, message, quoteId },
  });
}
