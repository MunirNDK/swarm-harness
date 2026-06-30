import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';
import type { STATS } from '@/lib/site';

interface StatStripProps {
  stats: typeof STATS;
  className?: string;
}

export function StatStrip({ stats, className }: StatStripProps) {
  return (
    <GlassCard className={cn('w-full', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} staggerIndex={i} className="text-center">
            <div className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dac-red mb-1">
              {stat.value}
            </div>
            <div className="text-dac-muted text-xs sm:text-sm font-medium uppercase tracking-wider">
              {stat.label}
            </div>
          </Reveal>
        ))}
      </div>
    </GlassCard>
  );
}