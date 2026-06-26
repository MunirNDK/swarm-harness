import { GlassCard } from "@/components/ui/glass-card";
import { stats } from "@/lib/site";
import { cn } from "@/lib/utils";

interface StatStripProps {
  className?: string;
}

export function StatStrip({ className }: StatStripProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4",
        className
      )}
    >
      {stats.map((stat) => (
        <GlassCard key={stat.label} className="p-6 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-dac-muted">{stat.label}</div>
        </GlassCard>
      ))}
    </div>
  );
}
