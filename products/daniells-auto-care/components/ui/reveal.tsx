'use client';

import {
  useEffect,
  useRef,
  useState,
  ElementType,
  ReactNode,
  HTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  delay?:     number;
  as?:        ElementType;
  children:   ReactNode;
  className?: string;
  /** Legacy compat — accepted but unused; Reveal always fades up */
  index?:     number;
  /** Legacy compat — accepted but unused */
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Reveal — Contract §10, §13.3 HEADLINE_ENTRANCE / §13.4 SCROLL_RHYTHM
 * Fade-up 14px / 350ms via IntersectionObserver at 15% threshold.
 *
 * Progressive enhancement: content is VISIBLE by default (SSR / no-JS / crawlers
 * always render it). On mount, JS hides only below-the-fold elements and reveals
 * them on scroll. In-view and above-the-fold content never hides (no flash).
 * Respects prefers-reduced-motion. A safety timer guarantees content is never
 * left hidden even if the observer never fires.
 */
export function Reveal({
  delay     = 0,
  as        = 'div',
  className,
  children,
  style,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index:     _index,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  direction: _direction,
  ...props
}: RevealProps) {
  const Tag                   = as;
  const ref                   = useRef<HTMLElement>(null);
  // Start visible so SSR HTML shows content; JS may hide below-fold items.
  const [hidden, setHidden]   = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return; // stay visible

    // Only elements currently below the fold get the fade-up treatment.
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return; // above/in fold — keep visible, no animation flash

    setHidden(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    // Safety net: never leave content hidden (e.g. non-scrolling render).
    const timer = window.setTimeout(() => setHidden(false), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={{
        opacity:    hidden ? 0 : 1,
        transform:  hidden ? 'translateY(14px)' : 'translateY(0)',
        transition: `opacity 350ms cubic-bezier(0.2,0,0,1) ${delay}ms, transform 350ms cubic-bezier(0.2,0,0,1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
