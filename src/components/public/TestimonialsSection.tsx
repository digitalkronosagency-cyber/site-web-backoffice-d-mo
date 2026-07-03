import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';

interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: Date;
}

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Avis clients</h2>
          <p className="mt-2 text-gray-500">Ce que nos clients disent de nos interventions</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg bg-white p-6 shadow-sm">
              <StarRating rating={t.rating} />
              <p className="mt-3 text-sm text-gray-600">&ldquo;{t.comment}&rdquo;</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-900">{t.name}</span>
                <span className="text-gray-400">{formatDate(t.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
