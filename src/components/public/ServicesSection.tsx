import { getIcon } from '@/lib/icons';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export function ServicesSection({ services }: { services: ServiceItem[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Nos services</h2>
        <p className="mt-2 text-gray-500">Des solutions électriques complètes pour particuliers et professionnels</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <div
              key={service.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-brand-50 text-brand">
                <Icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-brand-900">{service.title}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
