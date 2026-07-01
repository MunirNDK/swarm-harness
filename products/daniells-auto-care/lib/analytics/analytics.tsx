'use client';

import { useEffect } from 'react';
import { initTracking } from './track';

/**
 * Analytics — client component that boots the delegated click listener.
 * Render once inside layout.tsx (outside any suspense boundary is fine).
 */
export function Analytics(): null {
  useEffect(() => {
    initTracking();
  }, []);

  return null;
}
