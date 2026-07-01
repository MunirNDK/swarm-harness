import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

/**
 * GlassCard — LEGACY compatibility wrapper.
 * New code should use <GlowCard> from components/ui/glow-card.tsx.
 * Kept to avoid breaking existing page imports during swarm build.
 */
export function GlassCard({
  className,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  glow: _glow,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-surface shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
