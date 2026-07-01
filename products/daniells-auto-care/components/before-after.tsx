'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface BeforeAfterItem {
  id:     string;
  title:  string;
  tag:    string;
  before: string;
  after:  string;
}

interface BeforeAfterProps {
  item?:      BeforeAfterItem;
  className?: string;
  /** Legacy flat props — used when item is not provided */
  before?: string;
  after?:  string;
  title?:  string;
  tag?:    string;
}

/**
 * BeforeAfter — Contract §10, §12.7
 * Draggable slider compare: after image underneath, before image clipped.
 * Red vertical divider line + VS pill badge.
 * Accessible: keyboard range input, pointer events.
 * data-track on the container per contract §5.
 */
export function BeforeAfter({
  item,
  className,
  before: flatBefore,
  after:  flatAfter,
  title:  flatTitle,
  tag:    flatTag,
}: BeforeAfterProps) {
  const resolved = item ?? {
    id:     flatTitle ?? 'comparison',
    title:  flatTitle ?? '',
    tag:    flatTag   ?? '',
    before: flatBefore ?? '',
    after:  flatAfter  ?? '',
  };

  const { id, title, tag, before, after } = resolved;

  const [position, setPosition]  = useState(50);
  const [reduced, setReduced]    = useState(false);
  const containerRef             = useRef<HTMLDivElement>(null);
  const dragging                 = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
  }, []);

  const updateFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct  = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = useCallback(() => { dragging.current = true; }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => { if (dragging.current) updateFromClientX(e.clientX); };
    const onUp   = ()                => { dragging.current = false; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };
  }, [updateFromClientX]);

  return (
    <div
      className={cn('flex flex-col', className)}
      data-track-category="content"
      data-track-action="view"
      data-track-label={id}
    >
      {/* Comparison container */}
      <div
        ref={containerRef}
        className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-border bg-surface"
        style={{ touchAction: 'none' }}
      >
        {/* After image (base layer) */}
        <Image
          src={after}
          alt={title ? `${title} — after` : 'After'}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Before image (clipped) */}
        <Image
          src={before}
          alt={title ? `${title} — before` : 'Before'}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />

        {/* Red divider line */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-[2px] bg-accent z-[3]"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />

        {/* VS pill on the divider */}
        <div
          aria-hidden="true"
          className="absolute z-[4] flex items-center justify-center"
          style={{
            left:      `${position}%`,
            top:       '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span
            className="bg-surface-dark border border-accent rounded-full px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] text-accent uppercase whitespace-nowrap"
          >
            VS
          </span>
        </div>

        {/* Draggable handle */}
        <div
          className="absolute top-1/2 z-[5] -translate-y-1/2 cursor-ew-resize"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
          onPointerDown={onPointerDown}
        >
          <div className="w-10 h-10 rounded-full bg-surface-dark/80 border border-border flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7 4L13 10L7 16"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg" />
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute bottom-3 left-3 z-[4] rounded-full bg-surface-dark/70 px-3 py-1 font-mono text-xs uppercase tracking-widest text-fg-soft">
          Before
        </span>
        <span className="absolute bottom-3 right-3 z-[4] rounded-full bg-surface-dark/70 px-3 py-1 font-mono text-xs uppercase tracking-widest text-fg-soft">
          After
        </span>

        {/* Accessible range input */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => !reduced && setPosition(Number(e.target.value))}
          className="absolute bottom-2 left-1/2 w-4/5 -translate-x-1/2 opacity-0 focus:opacity-100 cursor-pointer z-[6]"
          aria-label={`Before/after slider for ${title || 'comparison'}`}
        />
      </div>

      {/* Meta row */}
      {(title || tag) && (
        <div className="mt-3 px-1 flex items-center justify-between gap-2">
          {title && <p className="text-sm font-medium text-fg">{title}</p>}
          {tag && (
            <span className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-accent bg-accent-soft border border-[rgba(232,5,5,0.2)] rounded-full px-2 py-0.5 flex-shrink-0">
              {tag}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface BeforeAfterGridProps {
  items:      BeforeAfterItem[];
  className?: string;
}

/**
 * BeforeAfterGrid — Contract §10
 * 2-column grid on desktop, 1-column on mobile.
 */
export function BeforeAfterGrid({ items, className }: BeforeAfterGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-bay',
        className
      )}
    >
      {items.map((item) => (
        <BeforeAfter key={item.id} item={item} />
      ))}
    </div>
  );
}
