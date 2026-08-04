'use client';

/**
 * TrustMarquee — Contract §10, §4 Signature Move #3
 * Full-width --cta-gradient band with horizontally scrolling trust signals.
 * Items duplicated for seamless loop, edge fade mask, ctaPulse overlay.
 * Sits on the red accent: all text here is pinned to --cta-fg, never --ink.
 */

const TRUST_ITEMS = [
  '140+ Five Star Reviews',
  'Licensed & Insured',
  'Same Day Service',
  'Mobile Service to Your Location',
] as const;

export function TrustMarquee() {
  // Duplicate items for seamless loop
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <div
      className="relative w-full overflow-hidden animate-cta-pulse bg-cta-gradient py-panel"
      aria-label="Trust signals"
    >
      {/* Edge fade mask */}
      <div
        aria-hidden="true"
        className="marquee-mask absolute inset-0 pointer-events-none z-raised"
      />

      {/* Scrolling track */}
      <div className="flex animate-marquee" aria-hidden="true">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-stall font-sans font-semibold uppercase text-lg tracking-label text-cta-fg/90 whitespace-nowrap px-stall"
          >
            {/* Dot separator */}
            <span
              className="inline-block w-rivet h-rivet rounded-full bg-cta-fg opacity-muted mr-gauge flex-shrink-0"
              aria-hidden="true"
            />
            {item}
          </span>
        ))}
      </div>

      {/* Accessible text (visually hidden, marquee text is aria-hidden) */}
      <p className="sr-only">
        {TRUST_ITEMS.join('. ')}
      </p>
    </div>
  );
}
