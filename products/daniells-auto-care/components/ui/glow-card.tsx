'use client';

import {
  useRef,
  useCallback,
  ElementType,
  ReactNode,
  HTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps extends HTMLAttributes<HTMLElement> {
  as?:       ElementType;
  children:  ReactNode;
  className?: string;
}

/**
 * GlowCard — Contract §10, §4 Signature Move #2
 * Red radial gradient that tracks cursor position.
 * Interaction chain:
 *   1. mousemove  → update --mx / --my CSS vars
 *   2. mouseenter → hovered state → border, shadow, translateY(-2px), glow
 *   3. mouseleave → reset --mx/--my to 50%/50%, unhover
 * Respects prefers-reduced-motion.
 */
export function GlowCard({
  as         = 'div',
  className,
  children,
  style,
  ...props
}: GlowCardProps) {
  const Tag                      = as;
  const ref                      = useRef<HTMLElement>(null);
  const [hovered, setHovered]    = useState(false);
  const [reduced, setReduced]    = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const mx   = `${e.clientX - rect.left}px`;
      const my   = `${e.clientY - rect.top}px`;
      ref.current.style.setProperty('--mx', mx);
      ref.current.style.setProperty('--my', my);
    },
    [reduced]
  );

  const handleMouseEnter = useCallback(() => setHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (ref.current) {
      ref.current.style.setProperty('--mx', '50%');
      ref.current.style.setProperty('--my', '50%');
    }
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-lg border transition-all duration-base ease-default',
        'bg-surface shadow-sm',
        hovered && !reduced
          ? 'border-[rgba(232,5,5,0.4)] -translate-y-0.5 shadow-red'
          : 'border-border',
        className
      )}
      style={{
        '--mx': '50%',
        '--my': '50%',
        ...style,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Red glow overlay — tracks cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-slow"
        style={{
          opacity: hovered && !reduced ? 1 : 0,
          background: `radial-gradient(ellipse 300px 200px at var(--mx) var(--my), rgba(232,5,5,0.12), transparent 70%)`,
        }}
      />
      {children}
    </Tag>
  );
}
