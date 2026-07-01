import { GlowCard } from '@/components/ui/glow-card';
import { StarRating } from '@/components/ui/star-rating';

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
      className={className}
      style={{ '--glow-alpha': '0.08' } as React.CSSProperties}
    >
      <div className="p-8 flex flex-col h-full gap-4">
        {/* Stars */}
        <StarRating value={stars} />

        {/* Quote */}
        <blockquote
          className="text-fg-soft text-[0.9rem] leading-[1.7] flex-grow italic"
        >
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Author row */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full bg-surface2 border border-border flex items-center justify-center font-sans font-bold text-[0.85rem] text-accent flex-shrink-0"
              aria-hidden="true"
            >
              {initial}
            </div>
            <div>
              <p className="text-fg text-sm font-medium">{name}</p>
              <p className="font-mono text-[0.6rem] tracking-[0.08em] text-fg-faint uppercase">
                Verified Google Review
              </p>
            </div>
          </div>
          <span className="text-fg-faint text-xs flex-shrink-0">{when}</span>
        </div>
      </div>
    </GlowCard>
  );
}
