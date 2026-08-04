import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionHeadingProps {
  kicker?:   string;
  title:     string;
  subtitle?: ReactNode;
  align?:    'center' | 'left';
  className?: string;
  /** Legacy compat aliases */
  eyebrow?:  string;
  centered?: boolean;
  center?:   boolean;
}

/**
 * SectionHeading — Contract §10, §12.12
 * kicker:   mono red uppercase label above the title (text-kicker = 12px/0.28em)
 * title:    h2 — size/weight/tracking come from the heading hierarchy in
 *           globals.css, so nothing is restated here
 * subtitle: soft ink, capped at container-sm for a readable measure
 */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  align,
  className,
  eyebrow,
  centered,
  center,
}: SectionHeadingProps) {
  // Legacy compat
  const resolvedKicker = kicker ?? eyebrow;
  const isCentered     = centered ?? center;
  const resolvedAlign  = align ?? (isCentered === false ? 'left' : 'center');

  return (
    <div
      className={cn(
        'mb-stall',
        resolvedAlign === 'center' && 'text-center',
        className
      )}
    >
      {resolvedKicker && (
        <p className="mb-bolt font-mono text-kicker uppercase text-accent">
          {resolvedKicker}
        </p>
      )}
      <h2>{title}</h2>
      {subtitle && (
        <p
          className={cn(
            'mt-gauge text-md text-fg-soft',
            resolvedAlign === 'center' && 'max-w-container-sm mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
