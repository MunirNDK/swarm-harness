import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { GlowCard } from '@/components/ui/glow-card';
import { ServiceCard } from '@/components/service-card';
import { QuoteButton } from '@/components/quote-modal';
import { TrustMarquee } from '@/components/trust-marquee';
import {
  business,
  whyChooseUs,
  processSteps,
} from '@/lib/site';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { getServices } from '@/lib/wordpress/services';

export const metadata: Metadata = pageMeta({
  title: 'Auto Detailing Services | Daniells Auto Care',
  description:
    'Mobile auto detailing services in Northern NJ. Ceramic coating, paint correction, PPF, window tinting, interior & exterior detailing. Same-day service.',
  path: '/services',
});

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd data={breadcrumbLd(breadcrumbs)} />

      {/* ── PAGE HEADER ── */}
      <Section surface="surface-dark" id="services-header">
        <Container>
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="mb-bay" />
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mb-panel text-3xl"
            >
              Professional Auto Detailing Services
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-fg-soft text-lg leading-relaxed max-w-3xl mb-bay">
              Daniells Auto Care delivers premium mobile detailing across{' '}
              {business.serviceArea} — from{' '}
              <Link
                href="/service-areas/franklin-lakes"
                className="text-accent hover:text-accent-mid transition-colors duration-fast ease-default"
                data-track-category="navigation"
                data-track-action="link_click"
                data-track-label="franklin-lakes"
                data-track-context="internal"
              >
                Franklin Lakes
              </Link>{' '}
              to{' '}
              <Link
                href="/service-areas/ridgewood"
                className="text-accent hover:text-accent-mid transition-colors duration-fast ease-default"
                data-track-category="navigation"
                data-track-action="link_click"
                data-track-label="ridgewood"
                data-track-context="internal"
              >
                Ridgewood
              </Link>{' '}
              and beyond. Ceramic coating, paint correction, interior deep-cleans, and more, brought to your door.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-gauge">
              <QuoteButton
                size="lg"
                track={{
                  category: 'conversion',
                  action: 'button_click',
                  label: 'services_get_quote',
                }}
              >
                Get Free Quote
              </QuoteButton>
              <Button
                variant="phone"
                size="lg"
                href={business.phoneHref}
                track={{
                  category: 'conversion',
                  action: 'link_click',
                  label: 'phone_call',
                }}
              >
                {business.phone}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── TRUST MARQUEE ── */}
      <TrustMarquee />

      {/* ── ALL 8 SERVICE CARDS ── 3-col grid */}
      <Section surface="bg" id="services-grid">
        <Container>
          <SectionHeading
            kicker="What We Offer"
            title="Complete Detailing, Protection & Restoration"
            subtitle="Every service is performed with professional-grade products and meticulous attention to detail — from a quick interior refresh to full ceramic packages."
          />
          {services.length === 0 ? (
            <p className="text-fg-soft text-center py-stall">
              Services are being updated — check back shortly, or{' '}
              <Link href="/contact" className="text-accent hover:text-accent-mid">
                contact us
              </Link>{' '}
              for current offerings.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-panel">
              {services.map((service, i) => (
                <Reveal key={service.slug} delay={i * 60}>
                  <ServiceCard
                    service={{
                      slug: service.slug,
                      name: service.name,
                      icon: service.icon,
                      short: service.shortDescription,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ── WHY CHOOSE US ── surface */}
      <Section surface="surface" id="why-daniells">
        <Container>
          <SectionHeading
            kicker="Why Daniells Auto Care"
            title="The Daniells Difference"
            subtitle="We don't just clean cars — we restore and protect them with factory-grade techniques and a commitment to excellence that shows in every detail."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-panel">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <GlowCard className="h-full flex flex-col">
                  <div className="p-bay h-full">
                    <h3 className="text-lg mb-bolt">
                      {item.title}
                    </h3>
                    <p className="text-fg-soft text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── PROCESS ── surface-dark */}
      <Section surface="surface-dark" id="process">
        <Container>
          <SectionHeading
            kicker="How It Works"
            title="From Quote to Showroom Finish"
            subtitle="A transparent, four-step process that puts you in control from start to finish."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-bay">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-cta-fg text-sm mb-gauge flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-base mb-rivet">
                    {step.title}
                  </h3>
                  <p className="text-fg-soft text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── CTA BAND ── bg */}
      <Section surface="bg" id="services-cta">
        <Container>
          <div
            className="rounded-lg px-bay py-deck text-center"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)',
            }}
          >
            <Reveal>
              <p
                className="font-mono text-mono-sm tracking-label uppercase mb-bolt text-cta-fg/60"
              >
                {business.hours} · {business.responseTime}
              </p>
              <h2
                className="text-cta-fg mb-gauge text-3xl"
              >
                Schedule Your Detail Today
              </h2>
              <p
                className="text-lg mb-bay max-w-lg mx-auto text-cta-fg/80"
              >
                Get a free, no-obligation quote — fast. We
                come to your home or office anywhere in {business.serviceArea}.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-gauge">
                <QuoteButton
                  size="xl"
                  className="bg-cta-fg text-accent hover:bg-cta-fg/90 border-transparent"
                  track={{
                    category: 'conversion',
                    action: 'button_click',
                    label: 'services_cta_get_quote',
                  }}
                >
                  Get Free Quote
                </QuoteButton>
                <Button
                  variant="phone"
                  size="xl"
                  href={business.phoneHref}
                  className="border-cta-fg/60 !text-cta-fg hover:bg-cta-fg/10 hover:!text-cta-fg hover:border-cta-fg"
                  track={{
                    category: 'conversion',
                    action: 'link_click',
                    label: 'phone_call',
                  }}
                >
                  {business.phone}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
