'use client';

import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { business } from '@/lib/site';
import { QuoteButton } from '@/components/quote-modal';

/**
 * StickyCta — Contract §10
 * Mobile-only bottom bar: Call + Get Quote.
 * Touch targets ≥ 44px per contract §6.
 */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-surface-dark border-t border-border p-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          href={business.phoneHref}
          variant="outline"
          size="lg"
          className="min-h-[44px]"
          track={{
            category: 'conversion',
            action:   'link_click',
            label:    'phone_call',
          }}
        >
          <Phone className="h-4 w-4 mr-1.5" aria-hidden="true" />
          Call
        </Button>
        <QuoteButton
          variant="primary"
          size="lg"
          className="min-h-[44px]"
          track={{
            category: 'conversion',
            action:   'button_click',
            label:    'sticky_get_free_quote',
          }}
        >
          Get Free Quote
        </QuoteButton>
      </div>
    </div>
  );
}

/** @deprecated Use StickyCta (matching contract §10 naming) */
export { StickyCta as StickyCTA };
