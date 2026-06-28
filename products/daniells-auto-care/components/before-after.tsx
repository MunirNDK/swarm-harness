'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface BeforeAfterProps {
  before: string;
  after: string;
  title?: string;
  tag?: string;
}

export function BeforeAfter({ before, after, title, tag }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePositionFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setPosition(percentage);
  }, []);

  const handlePointerDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current) return;
      updatePositionFromClientX(e.clientX);
    },
    [updatePositionFromClientX]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Attach global listeners for move and up
  useEffect(() => {
    const onMove = (e: PointerEvent) => handlePointerMove(e);
    const onUp = () => handlePointerUp();
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Keyboard a11y via range input
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(e.target.value));
  };

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10 bg-dac-ink"
        style={{ touchAction: 'none' }}
      >
        {/* After image (base) */}
        <img
          src={after}
          alt={title ? `${title} - after` : 'After'}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Before image clipped */}
        <img
          src={before}
          alt={title ? `${title} - before` : 'Before'}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />

        {/* Vertical divider line */}
        <div
          className="absolute inset-y-0 w-[2px] bg-white shadow-lg"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />

        {/* Draggable handle */}
        <div
          className="absolute top-1/2 z-10 -translate-y-1/2 cursor-ew-resize"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
          onPointerDown={handlePointerDown}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Before
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          After
        </span>

        {/* Range input for keyboard/accessibility */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={handleRangeChange}
          className="absolute bottom-2 left-1/2 w-4/5 -translate-x-1/2 cursor-pointer opacity-0 focus:opacity-100"
          aria-label={`Before/after slider for ${title || 'comparison'}`}
        />
      </div>

      {/* Title + tag below */}
      {(title || tag) && (
        <div className="mt-3 px-1">
          {title && <p className="text-sm font-medium text-white">{title}</p>}
          {tag && <p className="text-xs text-dac-muted">{tag}</p>}
        </div>
      )}
    </div>
  );
}
