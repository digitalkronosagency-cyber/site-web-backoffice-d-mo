import { prisma } from '@/lib/prisma';
import { ContenuTabs } from '@/components/backoffice/ContenuTabs';

export const dynamic = 'force-dynamic';

export default async function ContenuPage() {
  const [company, services, testimonials, photos] = await Promise.all([
    prisma.company.findFirst(),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    prisma.photo.findMany({ orderBy: { order: 'asc' } }),
  ]);

  if (!company) {
    return <p className="text-sm text-gray-500">Aucune entreprise configurée.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Contenu du site</h1>
        <p className="mt-1 text-sm text-gray-500">Modifiez le contenu affiché sur le site public</p>
      </div>
      <ContenuTabs
        company={company}
        services={services}
        testimonials={testimonials.map((t) => ({ ...t, date: t.date.toISOString() }))}
        photos={photos}
      />
    </div>
  );
}
