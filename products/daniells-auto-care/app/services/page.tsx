import type { Metadata } from 'next';
import { services } from '@/lib/site';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ServiceCard } from '@/components/service-card';
import { Reveal } from '@/components/ui/reveal';
import { QuoteCTA } from '@/components/quote-cta';

export const metadata: Metadata = {
  title: 'Services | Daniells Auto Care',
  description:
    'Complete auto detailing, ceramic coating, paint correction, PPF, window tinting, and fleet services in Northern New Jersey. Showroom results, same-day service.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-dac-black text-dac-white">
      {/* Hero Section */}
      <Section className="relative pt-32 pb-16 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#E80505]/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our Services"
              title="Showroom quality, delivered at your door."
              subtitle="From a one-step detail to full ceramic packages with lifetime window tint, we bring the shop to your driveway — same-day, every day."
              center
            />
          </Reveal>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section className="pb-24">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Reveal key={service.slug} direction="up" delay={index * 0.05}>
                <ServiceCard
                  slug={service.slug}
                  name={service.name}
                  short={service.short}
                  icon={service.icon}
                  className=""
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <QuoteCTA />
    </main>
  );
}
