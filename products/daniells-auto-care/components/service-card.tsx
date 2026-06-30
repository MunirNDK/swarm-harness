import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/lib/site';
import { Icon } from '@/components/ui/icon';

interface ServiceCardProps {
  service: Service;
  index: number;
  className?: string;
}

export function ServiceCard({ service, index, className }: ServiceCardProps) {
  return (
    <Reveal staggerIndex={index} className={className}>
      <GlassCard glow hover className="h-full flex flex-col">
        <div className="mb-4 w-12 h-12 rounded-xl bg-dac-red/10 flex items-center justify-center">
          <Icon name={service.icon} className="w-6 h-6 text-dac-red" />
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-semibold text-dac-white mb-2">
          {service.name}
        </h3>
        <p className="text-dac-muted text-sm sm:text-base leading-relaxed flex-1 mb-4">
          {service.short}
        </p>
        <Button
          variant="ghost"
          size="sm"
          href={`/services/${service.slug}`}
          className="self-start group"
        >
          Learn more
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </GlassCard>
    </Reveal>
  );
}