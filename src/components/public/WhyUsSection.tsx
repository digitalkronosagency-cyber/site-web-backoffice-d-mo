import { Clock, ShieldCheck, Award, PhoneCall } from 'lucide-react';

const REASONS = [
  {
    icon: Clock,
    title: 'Réactivité',
    description: 'Intervention sous 24h et dépannage en urgence 7j/7.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantie décennale',
    description: 'Tous nos travaux sont couverts par une garantie décennale.',
  },
  {
    icon: Award,
    title: 'Certifié',
    description: 'Électricien certifié Qualifelec, conforme à la norme NF C 15-100.',
  },
  {
    icon: PhoneCall,
    title: 'Disponibilité',
    description: 'Une équipe à votre écoute pour répondre à toutes vos questions.',
  },
];

export function WhyUsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Pourquoi nous choisir</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason) => (
          <div key={reason.title} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-accent">
              <reason.icon size={26} />
            </div>
            <h3 className="mb-2 font-semibold text-brand-900">{reason.title}</h3>
            <p className="text-sm text-gray-500">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
