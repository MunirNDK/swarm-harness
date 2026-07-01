import { cn } from '@/lib/utils';
import { stats as defaultStats } from '@/lib/site';

interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats?:     Stat[];
  className?: string;
}

/**
 * StatStrip — Contract §10, §12.9
 * Accent top-border tiles, stat number in accent red, mono label.
 * Server component.
 */
export function StatStrip({ stats = defaultStats, className }: StatStripProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4',
        className
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border-t-2 border-accent border-b border-b-border px-gauge py-panel text-center"
        >
          <p
            className="font-sans font-extrabold text-accent leading-none"
            style={{ fontSize: 'var(--t-3xl)' }}
          >
            {stat.value}
          </p>
          <p className="font-mono text-xs text-fg-faint uppercase tracking-[0.1em] mt-rivet">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
