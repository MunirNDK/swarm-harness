import Link from 'next/link';
import {
  Sparkles,
  CarFront,
  Armchair,
  ShieldCheck,
  Wand2,
  Layers,
  SunDim,
  Truck,
  type LucideProps,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlowCard } from '@/components/ui/glow-card';

/* Icon map — all 8 service icons, imported statically for server components */
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sparkles,
  CarFront,
  Armchair,
  ShieldCheck,
  Wand2,
  Layers,
  SunDim,
  Truck,
};

interface ServiceLike {
  slug:  string;
  name:  string;
  icon:  string;
  short: string;
}

interface ServiceCardProps {
  service?:   ServiceLike;
  className?: string;
  /** Legacy flat props — used when service object is not provided */
  slug?:  string;
  name?:  string;
  icon?:  string;
  short?: string;
}

/**
 * ServiceCard — Contract §10, §6, §12.4
 * Server component — wraps GlowCard (client) for the red-glow-reveal.
 * Entire card is clickable via a stretched <Link> (absolute inset-0).
 * No nested anchors — the "View service" CTA is a visual hint, not an anchor.
 * h-full ensures equal row heights in a grid context.
 */
export function ServiceCard({
  service,
  className,
  slug:  flatSlug,
  name:  flatName,
  icon:  flatIcon,
  short: flatShort,
}: ServiceCardProps) {
  const resolved: ServiceLike = service ?? {
    slug:  flatSlug  ?? '',
    name:  flatName  ?? '',
    icon:  flatIcon  ?? 'Sparkles',
    short: flatShort ?? '',
  };
  const { slug, name, icon, short } = resolved;
  const IconComponent = ICON_MAP[icon] ?? Sparkles;

  return (
    <GlowCard
      as="article"
      className={cn('h-full', className)}
      data-track-category="content"
      data-track-action="view"
      data-track-label={slug}
    >
      <div className="p-8 flex flex-col h-full gap-4">
        {/* Icon container — 48x48, surface-2 bg, rule border, r-md */}
        <div
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-md bg-surface2 border border-border"
          aria-hidden="true"
        >
          <IconComponent
            size={26}
            style={{ stroke: 'var(--accent)', strokeWidth: 1.5, fill: 'none' }}
          />
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl">
          {name}
        </h3>

        {/* Description */}
        <p className="text-fg-soft text-[0.9rem] leading-[1.65] flex-grow">
          {short}
        </p>

        {/* View hint — visual affordance pushed to the bottom; not an anchor */}
        <span
          className="mt-auto inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.05em] text-accent"
          aria-hidden="true"
        >
          View service
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/*
          Stretched link — covers the entire GlowCard (which is position:relative).
          Positions relative to GlowCard, not the inner div (which is position:static).
          No anchor nested inside this anchor — the hint above is a <span>.
        */}
        <Link
          href={`/services/${slug}`}
          className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded-[inherit]"
          aria-label={`Learn more about ${name}`}
          data-track-category="navigation"
          data-track-action="link_click"
          data-track-label={slug}
          data-track-context="internal"
        />
      </div>
    </GlowCard>
  );
}
