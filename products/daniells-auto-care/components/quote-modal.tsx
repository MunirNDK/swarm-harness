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

/* ═══════════════════════════════════════════════════════════════
   Context — Contract §10
   ═══════════════════════════════════════════════════════════════ */
interface QuoteModalContextType {
  isOpen: boolean;
  open:   () => void;
  close:  () => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const open                = useCallback(() => setIsOpen(true), []);
  const close               = useCallback(() => setIsOpen(false), []);

  return (
    <QuoteModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </QuoteModalContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Modal — DS-CS-017: center, backdrop, close btn, Escape, focus trap
   ═══════════════════════════════════════════════════════════════ */
export function QuoteModal() {
  const { isOpen, close } = useQuoteModal();
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
        style={{ borderTop: '3px solid var(--accent)' }}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={close}
          className="absolute top-4 right-4 p-1.5 text-fg-faint hover:text-fg transition-colors duration-fast ease-default rounded-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close modal"
          data-track-category="navigation"
          data-track-action="toggle"
          data-track-label="quote_modal_close"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="p-6 md:p-8">
          <h2
            id="quote-modal-title"
            className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-6"
            style={{ fontSize: 'var(--t-2xl)' }}
          >
            Get Your Free Quote
          </h2>
          <QuoteForm />
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
  track?:     TrackProps;
}

export function QuoteButton({
  children  = 'Get Free Quote',
  className,
  variant   = 'primary',
  size      = 'md',
  track,
}: QuoteButtonProps) {
  const { open } = useQuoteModal();
  // Map 'secondary' to 'outline' for Button variant compat
  const resolvedVariant = (variant === 'secondary' ? 'outline' : variant) as
    'primary' | 'outline' | 'ghost';

  return (
    <Button
      onClick={open}
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
