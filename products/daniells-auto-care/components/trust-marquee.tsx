'use client';

/**
 * TrustMarquee — Contract §10, §4 Signature Move #3
 * Full-width linear-gradient(135deg,#E80505,#980404) band
 * with horizontally scrolling mono trust signals.
 * Items duplicated for seamless loop, edge fade mask, ctaPulse overlay.
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
      className="relative w-full overflow-hidden animate-cta-pulse"
      style={{ background: 'linear-gradient(135deg, #E80505, #980404)', padding: 'var(--panel) 0' }}
      aria-label="Trust signals"
    >
      {/* Edge fade mask */}
      <div
        aria-hidden="true"
        className="marquee-mask absolute inset-0 pointer-events-none z-10"
      />

      {/* Scrolling track */}
      <div className="flex animate-marquee" aria-hidden="true">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-stall font-sans font-semibold uppercase text-[1.3rem] tracking-[0.05em] text-fg-soft whitespace-nowrap px-stall"
            style={{ letterSpacing: '0.05em' }}
          >
            {/* Red dot separator */}
            <span
              className="inline-block w-2 h-2 rounded-full bg-fg-soft opacity-60 mr-4 flex-shrink-0"
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
