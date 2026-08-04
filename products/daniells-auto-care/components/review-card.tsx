import { GlowCard } from '@/components/ui/glow-card';
import { StarRating } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';

interface ReviewLike {
  name:  string;
  when:  string;
  stars: number;
  quote: string;
}

interface ReviewCardProps {
  review:     ReviewLike;
  className?: string;
  /** Legacy flat props */
  name?:  string;
  when?:  string;
  stars?: number;
  quote?: string;
}

/**
 * ReviewCard — Contract §10, §12.6
 * Red stars (not gold). No role/company (don't fabricate).
 * Source: "Verified Google Review" label per contract §6.
 */
export function ReviewCard({
  review,
  className,
  name:  flatName,
  when:  flatWhen,
  stars: flatStars,
  quote: flatQuote,
}: ReviewCardProps) {
  const { name, when, stars, quote } = review ?? {
    name:  flatName  ?? '',
    when:  flatWhen  ?? '',
    stars: flatStars ?? 5,
    quote: flatQuote ?? '',
  };

  // Avatar initial
  const initial = name.charAt(0).toUpperCase();

  return (
    <GlowCard
      as="article"
      className={cn('h-full', className)}
      style={{ '--glow-alpha': '0.08' } as React.CSSProperties}
    >
      <div className="p-bay flex flex-col h-full gap-gauge">
        {/* Stars */}
        <StarRating value={stars} />

        {/* Quote */}
        <blockquote
          className="text-fg-soft text-base leading-relaxed flex-grow italic"
        >
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Author row */}
        <div className="flex items-center justify-between gap-gauge pt-rivet border-t border-border">
          <div className="flex items-center gap-bolt">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full bg-surface2 border border-border flex items-center justify-center font-sans font-bold text-sm text-accent flex-shrink-0"
              aria-hidden="true"
            >
              {initial}
            </div>
            <div>
              <p className="text-fg text-sm font-medium">{name}</p>
              <p className="font-mono text-mono-sm tracking-label text-fg-faint uppercase">
                Verified Google Review
              </p>
            </div>
          </div>
          <span className="text-fg-faint text-sm flex-shrink-0">{when}</span>
        </div>
      </div>
    </GlowCard>
  );
}
