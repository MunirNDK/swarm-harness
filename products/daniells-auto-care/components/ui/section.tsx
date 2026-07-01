import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type SurfaceVariant = 'bg' | 'surface' | 'surface-dark' | 'surface-dark-2';

const surfaceClasses: Record<SurfaceVariant, string> = {
  'bg':             'bg-bg',
  'surface':        'bg-surface',
  'surface-dark':   'bg-surface-dark',
  'surface-dark-2': 'bg-surface-dark-2',
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  surface?: SurfaceVariant;
  id?: string;
  /** Legacy compat — ignored, use surface instead */
  background?: string;
}

/**
 * Section — Contract §10
 * Applies vertical rhythm (section-v-pad) and surface background.
 * Adds data-od-id for Open Design tooling (DS-AS-012).
 */
export function Section({
  className,
  surface = 'bg',
  id,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  background: _background,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      data-od-id={id ?? 'section'}
      className={cn(
        'section-v-pad',
        surfaceClasses[surface],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
