import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface StarRatingProps {
  count: number;
  max?: number;
  size?: number;
  className?: string;
}

export function StarRating({ count, max = 5, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn('flex gap-0.5', className)} aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < count ? 'fill-dac-red text-dac-red' : 'fill-none text-dac-faint',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}