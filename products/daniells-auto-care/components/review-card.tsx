import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { StarRating } from '@/components/ui/star-rating';
import { Reveal } from '@/components/ui/reveal';
import type { REVIEWS } from '@/lib/site';

interface ReviewCardProps {
  review: (typeof REVIEWS)[number];
  index: number;
  className?: string;
}

export function ReviewCard({ review, index, className }: ReviewCardProps) {
  return (
    <Reveal staggerIndex={index} className={className}>
      <GlassCard className="h-full flex flex-col">
        <StarRating count={review.stars} className="mb-3" />
        <p className="text-dac-white text-sm sm:text-base leading-relaxed flex-1 mb-4 italic">
          &ldquo;{review.quote}&rdquo;
        </p>
        <div>
          <div className="font-heading font-semibold text-dac-white text-sm">
            {review.name}
          </div>
          <div className="text-dac-faint text-xs mt-0.5">{review.when}</div>
        </div>
      </GlassCard>
    </Reveal>
  );
}