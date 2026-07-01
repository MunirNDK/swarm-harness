/**
 * Delegated analytics listener — Design Contract §5, AN-DA-015
 *
 * Reads data-track-category / data-track-action / data-track-label
 * (and optional data-track-context) from the nearest ancestor of the
 * click target that carries [data-track-category].
 *
 * Pushes { event: 'track', category, action, label, context? } to
 * window.dataLayer (initialised lazily — no GA ID hardcoded).
 *
 * Call initTracking() once from a 'use client' component effect.
 * The function is idempotent (guards against double-registration).
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    __trackingInit?: boolean;
  }
}

function handleClick(e: MouseEvent): void {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const el = target.closest('[data-track-category]') as HTMLElement | null;
  if (!el) return;

  const category = el.dataset.trackCategory;
  const action   = el.dataset.trackAction;
  const label    = el.dataset.trackLabel;
  const context  = el.dataset.trackContext;

  if (!category || !action || !label) return;

  // Initialise dataLayer if it doesn't exist
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  const payload: Record<string, unknown> = {
    event:    'track',
    category,
    action,
    label,
  };
  if (context) payload.context = context;

  window.dataLayer.push(payload);
}

export function initTracking(): void {
  // SSR guard
  if (typeof window === 'undefined') return;
  // Idempotency guard
  if (window.__trackingInit) return;
  window.__trackingInit = true;

  document.addEventListener('click', handleClick, { passive: true });
}
