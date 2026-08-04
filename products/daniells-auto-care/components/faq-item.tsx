'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FaqItemProps {
  faq: { q: string; a: string };
  index: number;
}

export function FaqItem({ faq, index }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        className="flex items-center justify-between gap-gauge w-full px-panel py-gauge cursor-pointer text-left font-sans font-bold text-fg text-sm uppercase tracking-label hover:text-accent transition-colors duration-fast ease-default min-h-touch-xl"
        data-track-category="engagement"
        data-track-action="toggle"
        data-track-label={`faq_${index}`}
      >
        <span>{faq.q}</span>
        <span className="flex-shrink-0 text-accent" aria-hidden="true">
          {open ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-panel-${index}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="px-panel pb-gauge text-fg-soft text-sm leading-relaxed border-t border-border pt-gauge">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
