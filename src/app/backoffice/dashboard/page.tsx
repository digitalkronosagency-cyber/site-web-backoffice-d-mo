import { FileText, CheckCircle2, Clock, Euro } from 'lucide-react';
import { getDashboardStats, getQuoteEvolution } from '@/lib/stats';
import { StatCard } from '@/components/backoffice/StatCard';
import { QuoteEvolutionChart } from '@/components/backoffice/QuoteEvolutionChart';
import { RecentActivity } from '@/components/backoffice/RecentActivity';
import { RelanceList } from '@/components/backoffice/RelanceList';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [stats, evolution] = await Promise.all([getDashboardStats(), getQuoteEvolution()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">Vue d&apos;ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Devis envoyés ce mois" value={String(stats.sentThisMonth)} icon={FileText} />
        <StatCard
          label="Devis signés ce mois"
          value={String(stats.signedThisMonthCount)}
          subValue={formatCurrency(stats.signedThisMonthTotal)}
          icon={CheckCircle2}
        />
        <StatCard label="Devis en attente" value={String(stats.pendingCount)} icon={Clock} />
        <StatCard label="Chiffre d'affaires en cours" value={formatCurrency(stats.revenueInProgress)} icon={Euro} />
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold text-brand-900">Évolution des devis (6 derniers mois)</h3>
        <QuoteEvolutionChart data={evolution} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity activities={stats.recentActivity} />
        <RelanceList
          quotes={stats.relanceList.map((q) => ({
            id: q.id,
            clientName: q.clientName,
            serviceType: q.serviceType,
            sentAt: q.sentAt,
          }))}
        />
      </div>
    </div>
  );
}
