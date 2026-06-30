'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';
import { QuoteCTA } from '@/components/quote-cta';
import { Marquee } from '@/components/marquee';
import { AREAS } from '@/lib/site';
import { MapPin } from 'lucide-react';

export function AreaList() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {AREAS.map((area, i) => (
          <Reveal key={area} staggerIndex={i}>
            <Link href={`/service-areas/${area.toLowerCase().replace(/\s+/g, '-')}`} className="block">
              <GlassCard hover className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-dac-red/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-dac-red" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dac-white text-base">{area}</h3>
                  <p className="text-dac-muted text-xs">Mobile detailing available</p>
                </div>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <Marquee>
          {AREAS.map((area) => (
            <span key={area} className="inline-flex items-center gap-1 text-dac-muted text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 text-dac-red shrink-0" />
              {area}, NJ
            </span>
          ))}
        </Marquee>
      </div>

      <QuoteCTA className="mt-16" />
    </>
  );
}