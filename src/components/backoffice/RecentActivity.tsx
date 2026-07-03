import { Card } from '@/components/ui/Card';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: Date;
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold text-brand-900">Activité récente</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-400">Aucune activité récente.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">{ACTIVITY_LABELS[a.type] ?? a.type}</p>
                <p className="text-gray-500">{a.message}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-gray-400">{formatDate(a.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
