'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuoteForm } from '@/components/quote-form';

interface QuoteModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType | undefined>(undefined);

export function useQuoteModal() {
  const context = useContext(QuoteModalContext);
  if (!context) throw new Error('useQuoteModal must be used within a QuoteModalProvider');
  return context;
}

export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <QuoteModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      <QuoteModal />
    </QuoteModalContext.Provider>
  );
}

export function QuoteModal() {
  const { isOpen, close } = useQuoteModal();
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    },
    [close]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-dac-ink/95 p-6 shadow-2xl">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-dac-muted hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="quote-modal-title" className="text-2xl font-bold text-white mb-6">
          Get Your Free Quote
        </h2>
        <QuoteForm />
      </div>
    </div>
  );
}

interface QuoteButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function QuoteButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
}: QuoteButtonProps) {
  const { open } = useQuoteModal();

  return (
    <Button onClick={open} variant={variant} size={size} className={className}>
      {children}
    </Button>
  );
}