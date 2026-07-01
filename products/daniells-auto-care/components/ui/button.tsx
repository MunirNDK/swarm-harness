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
   Variant + size maps — Design Spec §12.1-§12.3
   ═══════════════════════════════════════════════════════════════ */
const variantClasses: Record<string, string> = {
  primary:
    'bg-cta text-fg font-sans font-bold uppercase tracking-[0.05em] text-[0.95rem] ' +
    'rounded-sm border-none cursor-pointer inline-flex items-center justify-center gap-2 ' +
    'transition-all duration-base ease-default ' +
    'hover:bg-accent-mid hover:-translate-y-px hover:shadow-red ' +
    'active:translate-y-0 ' +
    'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none',
  outline:
    'bg-transparent text-fg font-sans font-bold uppercase tracking-[0.05em] text-[0.95rem] ' +
    'rounded-sm border border-border cursor-pointer inline-flex items-center justify-center gap-2 ' +
    'transition-all duration-base ease-default ' +
    'hover:border-accent hover:text-accent ' +
    'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none',
  phone:
    'bg-transparent text-accent font-sans font-bold uppercase tracking-[0.05em] text-[0.95rem] ' +
    'rounded-sm border border-accent cursor-pointer inline-flex items-center justify-center gap-rivet ' +
    'transition-all duration-base ease-default ' +
    'hover:bg-accent hover:text-fg ' +
    'active:scale-[0.98] ' +
    'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none',
  ghost:
    'bg-transparent text-fg-soft font-sans font-bold uppercase tracking-[0.05em] text-[0.95rem] ' +
    'rounded-sm cursor-pointer inline-flex items-center justify-center gap-2 ' +
    'transition-all duration-base ease-default ' +
    'hover:text-fg ' +
    'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none',
  /* Legacy aliases */
  secondary:
    'bg-transparent text-fg font-sans font-bold uppercase tracking-[0.05em] text-[0.95rem] ' +
    'rounded-sm border border-border cursor-pointer inline-flex items-center justify-center gap-2 ' +
    'transition-all duration-base ease-default ' +
    'hover:border-accent hover:text-accent ' +
    'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none',
};

const sizeClasses: Record<string, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'py-[0.85rem] px-[1.75rem]',
  lg: 'py-[1rem] px-[2rem] text-base',
  xl: 'py-[1.1rem] px-[2.25rem] text-md',
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
      size    = 'md',
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
      sizeClasses[size] ?? sizeClasses.md,
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
