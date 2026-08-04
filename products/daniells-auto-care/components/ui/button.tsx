import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  ButtonHTMLAttributes,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
} from 'react';

/* ═══════════════════════════════════════════════════════════════
   Track props — Contract §5 / §10
   ═══════════════════════════════════════════════════════════════ */
export interface TrackProps {
  category: string;
  action:   string;
  label:    string;
  context?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Variant + size maps — tokens doc §"Component Tokens · Buttons"

   Sizing lives entirely in sizeClasses (height + padding + font size);
   variants only carry colour, border and state. Uppercase button labels
   use tracking-label (0.12em), the WCAG 1.4.12 floor for uppercase text.
   ═══════════════════════════════════════════════════════════════ */
const variantBase =
  'font-sans font-bold uppercase tracking-label rounded-sm cursor-pointer ' +
  'inline-flex items-center justify-center gap-rivet ' +
  'transition-all duration-base ease-default ' +
  'focus-visible:outline-medium focus-visible:outline-accent focus-visible:outline-offset-2 ' +
  'disabled:opacity-disabled disabled:pointer-events-none';

const variantClasses: Record<string, string> = {
  primary:
    `${variantBase} bg-cta text-cta-fg border-none ` +
    'hover:bg-cta-hover hover:-translate-y-px hover:shadow-red ' +
    'active:bg-cta-active active:translate-y-0',
  outline:
    `${variantBase} bg-transparent text-fg border-thin border-border ` +
    'hover:border-accent hover:text-accent',
  phone:
    `${variantBase} bg-transparent text-accent border-thin border-accent ` +
    'hover:bg-accent hover:text-cta-fg ' +
    'active:bg-cta-active active:text-cta-fg',
  ghost:
    `${variantBase} bg-transparent text-fg-soft ` +
    'hover:text-fg',
  /* Legacy alias — same treatment as `outline` */
  secondary:
    `${variantBase} bg-transparent text-fg border-thin border-border ` +
    'hover:border-accent hover:text-accent',
};

/* btn-sm 32px · btn-md 40px · btn-lg 48px · btn-xl 56px */
const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-bolt text-sm',
  md: 'h-10 px-gauge text-sm',
  lg: 'h-12 px-panel text-base',
  xl: 'h-14 px-panel text-md',
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  'primary' | 'outline' | 'phone' | 'ghost' | 'secondary';
  size?:     'sm' | 'md' | 'lg' | 'xl';
  href?:     string;
  external?: boolean;
  asChild?:  boolean;
  track?:    TrackProps;
}

function trackAttrs(track?: TrackProps): Record<string, string> {
  if (!track) return {};
  const attrs: Record<string, string> = {
    'data-track-category': track.category,
    'data-track-action':   track.action,
    'data-track-label':    track.label,
  };
  if (track.context) attrs['data-track-context'] = track.context;
  return attrs;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      /* Default is `lg` (48px): it clears the 44px touch-target minimum
         (WCAG 2.5.5) and keeps unsized CTAs at their established weight. */
      size    = 'lg',
      href,
      external,
      asChild,
      track,
      children,
      ...props
    },
    ref
  ) => {
    const cls = cn(
      variantClasses[variant] ?? variantClasses.primary,
      sizeClasses[size] ?? sizeClasses.lg,
      className
    );
    const ta = trackAttrs(track);

    // Slot / asChild pattern
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<Record<string, unknown>>;
      return cloneElement(child, { className: cn(cls, child.props?.className as string), ...ta });
    }

    // Anchor (external or tel:)
    if (href) {
      const isExt =
        external ||
        href.startsWith('http') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:');

      if (isExt) {
        return (
          <a
            href={href}
            className={cls}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            {...ta}
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={href} className={cls} {...ta}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={cls} {...(ta as Record<string, string>)} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
