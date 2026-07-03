import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { QuoteDetailClient } from '@/components/backoffice/QuoteDetailClient';

export const dynamic = 'force-dynamic';

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { lineItems: { orderBy: { order: 'asc' } } },
  });

  if (!quote) notFound();

  return (
    <QuoteDetailClient
      quote={{
        id: quote.id,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        clientPhone: quote.clientPhone,
        clientAddress: quote.clientAddress,
        serviceType: quote.serviceType,
        description: quote.description,
        status: quote.status,
        createdAt: quote.createdAt.toISOString(),
        sentAt: quote.sentAt ? quote.sentAt.toISOString() : null,
        pdfUrl: quote.pdfUrl,
        lineItems: quote.lineItems.map((li) => ({
          label: li.label,
          quantity: Number(li.quantity),
          unitPrice: Number(li.unitPrice),
        })),
      }}
    />
  );
}
