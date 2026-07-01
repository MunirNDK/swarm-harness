import { cn } from '@/lib/utils';

interface StarRatingProps {
  value:      number;
  max?:       number;
  className?: string;
  /** Legacy compat */
  count?:     number;
  size?:      number;
}

/**
 * StarRating — Contract §10, §12.6
 * Red stars (--accent), NOT gold. 18x18px per spec §15.
 */
export function StarRating({
  value,
  max     = 5,
  className,
  /** Legacy compat */
  count,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size: _size,
}: StarRatingProps) {
  const filled = count ?? value;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`${filled} out of ${max} stars`}
      role="img"
    >
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          aria-hidden="true"
          style={{
            fill:   i < filled ? 'var(--accent)' : 'none',
            stroke: i < filled ? 'var(--accent)' : 'var(--muted)',
            strokeWidth: '1.5',
          }}
        >
          <polygon points="9,1 11.09,6.26 17,7.27 13,11.14 14.18,17.02 9,14.77 3.82,17.02 5,11.14 1,7.27 6.91,6.26" />
        </svg>
      ))}
    </div>
  );
}
