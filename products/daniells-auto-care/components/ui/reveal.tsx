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
 * Respects prefers-reduced-motion (skips animation).
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
  const Tag                          = as;
  const ref                          = useRef<HTMLElement>(null);
  const [visible, setVisible]        = useState(false);
  const [reduced, setReduced]        = useState(false);

  // Detect reduced-motion preference on mount (SSR-safe)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref}
      className={cn(className)}
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: reduced
          ? 'none'
          : `opacity 350ms cubic-bezier(0.2,0,0,1) ${delay}ms, transform 350ms cubic-bezier(0.2,0,0,1) ${delay}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
