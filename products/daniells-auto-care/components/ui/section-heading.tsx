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
 * kicker: mono red uppercase label above the title
 * title: display font, uppercase, tight tracking
 * subtitle: soft color, max-width 40rem
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
        'mb-12',
        resolvedAlign === 'center' && 'text-center',
        className
      )}
    >
      {resolvedKicker && (
        <p className="mb-3 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent">
          {resolvedKicker}
        </p>
      )}
      <h2
        className={cn(
          'font-sans font-bold uppercase tracking-[-0.01em] text-fg',
          'text-[clamp(2rem,3.5vw,3rem)]'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-md text-fg-soft leading-relaxed',
            resolvedAlign === 'center' && 'max-w-[40rem] mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
