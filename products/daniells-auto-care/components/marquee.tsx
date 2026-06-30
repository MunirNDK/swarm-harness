'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex gap-8 whitespace-nowrap',
          !reduced && 'animate-marquee',
          pauseOnHover && !reduced && 'hover:[animation-play-state:paused]',
        )}
        style={!reduced ? { animationDuration: `${speed}s` } : undefined}
      >
        {children}
        {!reduced && children}
      </div>
    </div>
  );
}