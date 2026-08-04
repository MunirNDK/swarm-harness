'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { X } from 'lucide-react';
import { QuoteForm } from '@/components/quote-form';
import { Button, type TrackProps } from '@/components/ui/button';
import type { Service } from '@/lib/wordpress/types';

/* ═══════════════════════════════════════════════════════════════
   Context — Contract §10
   ═══════════════════════════════════════════════════════════════ */
export interface QuotePrefill {
  service?:          string;
  fleetSize?:        string;
  vehicleType?:      string;
  serviceFrequency?: string;
}

interface QuoteModalContextType {
  isOpen:  boolean;
  prefill: QuotePrefill | undefined;
  open:    (prefill?: QuotePrefill) => void;
  close:   () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType | undefined>(undefined);

export function useQuoteModal(): QuoteModalContextType {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error('useQuoteModal must be used inside QuoteModalProvider');
  return ctx;
}

/**
 * QuoteModalProvider — wraps the app; does NOT auto-render <QuoteModal />.
 * Layout renders <QuoteModal /> explicitly so it sits at the root z-index.
 */
export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen]   = useState(false);
  const [prefill, setPrefill] = useState<QuotePrefill | undefined>(undefined);
  const open  = useCallback((p?: QuotePrefill) => { setPrefill(p); setIsOpen(true); }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <QuoteModalContext.Provider value={{ isOpen, prefill, open, close }}>
      {children}
    </QuoteModalContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Modal — DS-CS-017: center, backdrop, close btn, Escape, focus trap
   ═══════════════════════════════════════════════════════════════ */
export function QuoteModal({ services }: { services: Service[] }) {
  const { isOpen, close, prefill } = useQuoteModal();
  const overlayRef        = useRef<HTMLDivElement>(null);
  const closeButtonRef    = useRef<HTMLButtonElement>(null);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  /* Body scroll lock + focus close btn on open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-dropdown flex items-center justify-center p-gauge bg-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface shadow-lg border-t-thick border-accent"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={close}
          className="absolute top-4 right-4 p-rivet text-fg-faint hover:text-fg transition-colors duration-fast ease-default rounded-sm min-w-touch min-h-touch flex items-center justify-center"
          aria-label="Close modal"
          data-track-category="navigation"
          data-track-action="toggle"
          data-track-label="quote_modal_close"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="p-panel md:p-bay">
          <h2
            id="quote-modal-title"
            className="mb-panel text-2xl"
          >
            Get Your Free Quote
          </h2>
          <QuoteForm prefill={prefill} services={services} eventSection="popup_form" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QuoteButton — standard "Get Free Quote" CTA everywhere
   Contract §10
   ═══════════════════════════════════════════════════════════════ */
interface QuoteButtonProps {
  children?:  React.ReactNode;
  className?: string;
  variant?:   'primary' | 'outline' | 'ghost' | 'secondary';
  size?:      'sm' | 'md' | 'lg' | 'xl';
  prefill?:   { service?: string; fleetSize?: string; vehicleType?: string; serviceFrequency?: string };
  track?:     TrackProps;
}

export function QuoteButton({
  children  = 'Get Free Quote',
  className,
  variant   = 'primary',
  size      = 'md',
  prefill,
  track,
}: QuoteButtonProps) {
  const { open } = useQuoteModal();
  // Map 'secondary' to 'outline' for Button variant compat
  const resolvedVariant = (variant === 'secondary' ? 'outline' : variant) as
    'primary' | 'outline' | 'ghost';

  return (
    <Button
      onClick={() => open(prefill)}
      variant={resolvedVariant}
      size={size}
      className={className}
      track={track ?? {
        category: 'conversion',
        action:   'button_click',
        label:    'get_free_quote',
      }}
    >
      {children}
    </Button>
  );
}
