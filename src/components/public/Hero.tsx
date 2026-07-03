import { ShieldCheck, Clock, Award } from 'lucide-react';

export function Hero({ companyName, description }: { companyName: string; description: string }) {
  return (
    <section className="bg-brand text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-3 inline-block rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent-300">
            Électricien certifié à Lyon
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {companyName}, votre expert électricité de confiance
          </h1>
          <p className="mb-8 max-w-lg text-brand-100">{description}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#devis"
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-brand-900 transition-colors hover:bg-accent-600"
            >
              Demander un devis gratuit
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-white/30 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              Nos services
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-brand-100">
            <span className="flex items-center gap-2">
              <Clock size={18} className="text-accent" /> Intervention rapide
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent" /> Garantie décennale
            </span>
            <span className="flex items-center gap-2">
              <Award size={18} className="text-accent" /> Certifié Qualifelec
            </span>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-brand-700 to-brand-950 shadow-2xl ring-1 ring-white/10" />
        </div>
      </div>
    </section>
  );
}
