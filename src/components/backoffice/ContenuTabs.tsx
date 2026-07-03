'use client';

import { useState } from 'react';
import { clsx } from '@/components/ui/clsx';
import { CompanyForm } from '@/components/backoffice/CompanyForm';
import { ServicesEditor } from '@/components/backoffice/ServicesEditor';
import { TestimonialsEditor } from '@/components/backoffice/TestimonialsEditor';
import { PhotosUploader } from '@/components/backoffice/PhotosUploader';

const TABS = [
  { key: 'entreprise', label: 'Informations entreprise' },
  { key: 'services', label: 'Services proposés' },
  { key: 'avis', label: 'Avis clients' },
  { key: 'photos', label: 'Photos' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function ContenuTabs(props: {
  company: Parameters<typeof CompanyForm>[0]['company'];
  services: Parameters<typeof ServicesEditor>[0]['services'];
  testimonials: Parameters<typeof TestimonialsEditor>[0]['testimonials'];
  photos: Parameters<typeof PhotosUploader>[0]['photos'];
}) {
  const [tab, setTab] = useState<TabKey>('entreprise');

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium transition-colors',
              tab === t.key
                ? 'border-b-2 border-accent text-brand-900'
                : 'text-gray-500 hover:text-brand-900'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'entreprise' && <CompanyForm company={props.company} />}
      {tab === 'services' && <ServicesEditor services={props.services} />}
      {tab === 'avis' && <TestimonialsEditor testimonials={props.testimonials} />}
      {tab === 'photos' && <PhotosUploader photos={props.photos} />}
    </div>
  );
}
