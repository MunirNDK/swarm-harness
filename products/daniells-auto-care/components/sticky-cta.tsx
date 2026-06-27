import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { business } from '@/lib/site';

export function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-dac-black/90 backdrop-blur-xl border-t border-white/10 p-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          href={business.phoneHref}
          variant="secondary"
          size="lg"
          aria-label={`Call ${business.phone}`}
        >
          <Phone className="h-5 w-5 mr-2" />
          Call
        </Button>
        <Button
          href="/contact"
          variant="primary"
          size="lg"
        >
          Get Free Quote
        </Button>
      </div>
    </div>
  );
}
