'use client';

import { Button } from '@/components/ui/button';
import { business } from '@/lib/site';
import { cn } from '@/lib/utils';
import { QuoteButton } from './quote-modal';

interface QuoteCTAProps {
  className?: string;
  headline?: string;
  subheadline?: string;
}

export function QuoteCTA({ className, headline, subheadline }: QuoteCTAProps) {
  const [quoteCta, callCta] = business.primaryCtas;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-cta-gradient p-bay md:p-stall shadow-lg',
        className
      )}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-cta-fg/5 backdrop-blur-sm" />
      <div className="relative z-raised flex flex-col md:flex-row items-center justify-between gap-panel">
        {/* Sits on the red gradient — text is pinned to --cta-fg, never --ink */}
        <div>
          <h2 className="text-2xl text-cta-fg">
            {headline ?? 'Ready for a showroom finish?'}
          </h2>
          <p className="mt-rivet text-cta-fg/80">
            {subheadline ?? 'Get your free quote quickly.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-bolt">
          <QuoteButton variant={quoteCta.variant as 'primary' | 'secondary'} size="lg">
            {quoteCta.label}
          </QuoteButton>
          <Button
            href={business.phoneHref}
            variant={callCta.variant as 'primary' | 'secondary'}
            size="lg"
          >
            {callCta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}