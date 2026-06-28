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
        'relative overflow-hidden rounded-3xl bg-gradient-to-r from-dac-red-dark via-dac-red to-dac-red-light p-8 md:p-12 shadow-2xl',
        className
      )}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {headline ?? 'Ready for a showroom finish?'}
          </h2>
          <p className="mt-2 text-white/80">
            {subheadline ?? 'Get your free quote in under 15 minutes.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
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