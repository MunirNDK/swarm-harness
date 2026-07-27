'use client';

import { useEffect } from 'react';
import { initTracking } from './track';

/**
 * Boots the universal delegated analytics listeners once at the app root.
 */
export function Analytics(): null {
  useEffect(() => {
    return initTracking();
  }, []);

  return null;
}
