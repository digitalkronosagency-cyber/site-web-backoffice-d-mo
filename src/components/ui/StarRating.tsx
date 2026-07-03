import { Star } from 'lucide-react';
import { clsx } from '@/components/ui/clsx';

export function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} sur 5 étoiles`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={clsx(i < rating ? 'fill-accent text-accent' : 'fill-gray-200 text-gray-200')}
        />
      ))}
    </div>
  );
}
