'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Settings,
  Palette,
  Zap,
  LogOut,
} from 'lucide-react';
import { clsx } from '@/components/ui/clsx';

const NAV_ITEMS = [
  { href: '/backoffice/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/backoffice/devis', label: 'Devis', icon: FileText },
  { href: '/backoffice/factures', label: 'Factures', icon: Receipt },
  { href: '/backoffice/clients', label: 'Clients', icon: Users },
  { href: '/backoffice/contenu', label: 'Contenu du site', icon: Palette },
  { href: '/backoffice/parametres', label: 'Paramètres', icon: Settings },
];

export function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-brand-950 text-white">
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-brand-900">
          <Zap size={18} />
        </span>
        <span className="font-bold">Backoffice</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-brand-700 text-white' : 'text-brand-200 hover:bg-brand-800 hover:text-white'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-brand-800 px-3 py-4">
        {email && <p className="mb-2 truncate px-3 text-xs text-brand-300">{email}</p>}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-brand-200 hover:bg-brand-800 hover:text-white"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
