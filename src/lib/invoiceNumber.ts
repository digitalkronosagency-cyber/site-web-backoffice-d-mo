import { prisma } from '@/lib/prisma';

export async function getNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const key = `invoice-${year}`;

  const counter = await prisma.counter.upsert({
    where: { key },
    create: { key, value: 1 },
    update: { value: { increment: 1 } },
  });

  return `FA-${year}-${String(counter.value).padStart(4, '0')}`;
}
