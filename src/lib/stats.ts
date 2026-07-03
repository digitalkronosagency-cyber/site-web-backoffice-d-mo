import { prisma } from '@/lib/prisma';
import { RELANCE_DELAY_DAYS } from '@/lib/constants';

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getDashboardStats() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const relanceThreshold = new Date(now.getTime() - RELANCE_DELAY_DAYS * 24 * 60 * 60 * 1000);

  const [sentThisMonth, signedThisMonth, pendingCount, revenueInProgress, relanceList, recentActivity] =
    await Promise.all([
      prisma.quote.count({
        where: { sentAt: { gte: monthStart } },
      }),
      prisma.quote.findMany({
        where: { status: 'SIGNE', signedAt: { gte: monthStart } },
        select: { totalAmount: true },
      }),
      prisma.quote.count({
        where: { status: { in: ['NOUVEAU', 'ENVOYE', 'RELANCE'] } },
      }),
      prisma.invoice.aggregate({
        where: { status: 'EN_ATTENTE' },
        _sum: { amountTTC: true },
      }),
      prisma.quote.findMany({
        where: {
          status: { in: ['ENVOYE', 'RELANCE'] },
          sentAt: { lte: relanceThreshold },
        },
        orderBy: { sentAt: 'asc' },
        take: 10,
      }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

  const signedTotal = signedThisMonth.reduce(
    (sum, q) => sum + Number(q.totalAmount ?? 0),
    0
  );

  return {
    sentThisMonth,
    signedThisMonthCount: signedThisMonth.length,
    signedThisMonthTotal: signedTotal,
    pendingCount,
    revenueInProgress: Number(revenueInProgress._sum.amountTTC ?? 0),
    relanceList,
    recentActivity,
  };
}

export async function getQuoteEvolution(months = 6) {
  const now = new Date();
  const results: { month: string; envoyes: number; signes: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const [envoyes, signes] = await Promise.all([
      prisma.quote.count({
        where: { sentAt: { gte: monthDate, lt: nextMonthDate } },
      }),
      prisma.quote.count({
        where: { signedAt: { gte: monthDate, lt: nextMonthDate } },
      }),
    ]);

    results.push({
      month: new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(monthDate),
      envoyes,
      signes,
    });
  }

  return results;
}
