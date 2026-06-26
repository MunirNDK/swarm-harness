import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { Marquee } from '@/components/ui/marquee';
import { QuoteCTA } from '@/components/ui/quote-cta';
import { Reveal } from '@/components/ui/reveal';
import { MapPin } from 'lucide-react';
import { areas } from '@/lib/site';

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export const metadata: Metadata = {
  title: 'Service Areas | Daniells Auto Care',
  description:
    'Mobile auto detailing across Northern New Jersey. Serving Franklin Lakes, Ridgewood, Tenafly, Chatham, Madison, and more. Same-day service, 100% satisfaction.',
};

export default function ServiceAreasPage() {
  return (
    <>
      {/* Hero / Grid Section */}
      <Section id="service-areas" className="relative">
        {/* Red glow behind the grid */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E80505]/10 blur-3xl rounded-full" />
        </div>

        <Container>
          <SectionHeading
            eyebrow="Service Areas"
            title="Proudly Serving Northern New Jersey"
            subtitle="Expert auto detailing delivered to your doorstep across Bergen, Morris, and Essex counties."
            className="mb-16"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area, index) => (
              <Reveal key={area} index={index}>
                <Link
                  href={`/service-areas/${slugify(area)}`}
                  aria-label={`Auto detailing in ${area}`}
                  className="block focus:outline-none focus:ring-2 focus:ring-dac-red rounded-3xl"
                >
                  <GlassCard className="p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                    <MapPin className="w-6 h-6 text-dac-red flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-semibold text-lg">{area}</span>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Marquee Section */}
      <Section className="py-16 bg-black/40">
        <Container>
          <p className="text-center text-dac-muted mb-8 text-sm uppercase tracking-widest">
            We come to you
          </p>
          <Marquee items={areas} />
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA />
    </>
  );
}
