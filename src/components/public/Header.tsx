import Link from 'next/link';
import { Phone, Zap } from 'lucide-react';

export function Header({ companyName, phone }: { companyName: string; phone: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-accent">
            <Zap size={20} />
          </span>
          <span className="text-lg font-bold text-brand-900">{companyName}</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="hidden items-center gap-1.5 text-sm font-medium text-brand-900 hover:text-brand-700 sm:flex"
          >
            <Phone size={16} />
            {phone}
          </a>
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-brand-900 sm:hidden" aria-label="Appeler">
            <Phone size={20} />
          </a>
          <a
            href="#devis"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-accent-600"
          >
            Devis gratuit
          </a>
        </div>
      </div>
    </header>
  );
}
