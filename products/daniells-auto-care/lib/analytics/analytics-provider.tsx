'use client';

import { useEffect } from 'react';
import { initTracking } from './track';

/**
 * Mounts and cleans up the custom analytics framework at the app root.
 */
export function AnalyticsProvider(): null {
  useEffect(() => initTracking(), []);

  return null;
}
