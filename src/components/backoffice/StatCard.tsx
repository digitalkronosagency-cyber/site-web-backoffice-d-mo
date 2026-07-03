import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-brand-900">{value}</p>
      {subValue && <p className="mt-1 text-xs text-gray-400">{subValue}</p>}
    </Card>
  );
}
