import { MapPin } from 'lucide-react';

export function ServiceAreaSection({ cities }: { cities: string[] }) {
  if (cities.length === 0) return null;

  return (
    <section className="bg-brand-900 py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Zone d&apos;intervention</h2>
        <p className="mt-2 text-brand-100">Nous intervenons à Lyon et dans les communes environnantes</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {cities.map((city) => (
            <span
              key={city}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium"
            >
              <MapPin size={14} className="text-accent" />
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
