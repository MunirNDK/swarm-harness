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
import { QuoteButton } from '@/components/quote-modal';
import { TrustMarquee } from '@/components/trust-marquee';
import { business, areas, services } from '@/lib/site';
import { pageMeta, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Service Areas — Northern NJ | Daniells Auto Care',
  description:
    'Mobile auto detailing across Northern New Jersey. Serving Franklin Lakes, Ridgewood, Tenafly, Chatham, Madison and more. Same-day service, 100% satisfaction.',
  path: '/service-areas',
});

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Service Areas', href: '/service-areas' },
];

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(breadcrumbs)} />

      {/* ── PAGE HEADER ── surface-dark */}
      <Section surface="surface-dark" id="areas-header">
        <Container>
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="mb-8" />
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
            >
              Serving Northern New Jersey
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-fg-soft text-lg leading-relaxed max-w-3xl mb-8">
              Daniells Auto Care brings professional mobile auto detailing
              directly to your doorstep across{' '}
              {business.serviceArea}. Our fully equipped vans carry everything
              needed — water, power, and professional-grade products — so you
              never have to leave home. Same-day availability, free quotes, and{' '}
              {business.reviewsCount} five-star reviews.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-4">
              <QuoteButton
                size="lg"
                track={{
                  category: 'conversion',
                  action: 'button_click',
                  label: 'areas_get_quote',
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

      {/* ── AREAS GRID ── bg, 10 towns each linking to /service-areas/<slug> */}
      <Section surface="bg" id="areas-grid">
        <Container>
          <SectionHeading
            kicker="Our Coverage"
            title="10 Northern NJ Communities"
            subtitle="Click your town to see local service details, area-specific info, and how to book your mobile detail."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {areas.map((area, i) => {
              const aSlug = slugify(area);
              return (
                <Reveal key={area} delay={i * 60}>
                  <GlowCard>
                    <Link
                      href={`/service-areas/${aSlug}`}
                      className="block p-8 group min-h-[44px]"
                      data-track-category="navigation"
                      data-track-action="link_click"
                      data-track-label={`area_${aSlug}`}
                      data-track-context="internal"
                    >
                      {/* Red area code indicator */}
                      <p className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-accent mb-2">
                        NJ · {aSlug}
                      </p>
                      <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3 group-hover:text-accent transition-colors duration-fast ease-default">
                        {area}
                      </h3>
                      <p className="text-fg-soft text-sm leading-relaxed mb-4">
                        Professional mobile auto detailing in {area}, NJ.
                        Same-day service, factory-trained technicians, free
                        quotes.
                      </p>
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.05em] text-accent group-hover:text-accent-mid transition-colors duration-fast ease-default">
                        View {area} services
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 6h8M6 2l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </GlowCard>
                </Reveal>
              );
            })}
          </div>

          {/* Service cross-links */}
          <div className="pt-8 border-t border-border">
            <p className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-fg-faint mb-4">
              Services Available in All Areas
            </p>
            <div className="flex flex-wrap gap-3">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.06em] text-fg-soft hover:border-accent hover:text-accent transition-all duration-fast ease-default min-h-[44px] flex items-center"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={`service_${s.slug}`}
                  data-track-context="internal"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── WHY MOBILE ── surface */}
      <Section surface="surface" id="why-mobile">
        <Container>
          <SectionHeading
            kicker="Mobile Convenience"
            title="We Come to You"
            subtitle="No shop, no waiting, no wasted time. Our fully equipped van arrives at your home or office with everything needed for a showroom finish."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                heading: 'Self-Contained Setup',
                body: 'Our vans carry onboard water tanks, generators, and professional-grade products. Zero hookups required on your end.',
              },
              {
                heading: 'Same-Day Availability',
                body: 'Call (973) 916-7868 or fill out our form and we respond within 15 minutes to confirm your appointment.',
              },
              {
                heading: '5+ Years Combined Experience',
                body: 'Factory-trained technicians with over 2,000 vehicles detailed across Northern New Jersey.',
              },
              {
                heading: 'Licensed & Insured',
                body: 'Fully licensed and insured for your peace of mind. 100% satisfaction guaranteed on every visit.',
              },
            ].map((item, i) => (
              <Reveal key={item.heading} delay={i * 80}>
                <GlowCard>
                  <div className="p-8 h-full">
                    <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-lg mb-3">
                      {item.heading}
                    </h3>
                    <p className="text-fg-soft text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── FINAL CTA ── surface-dark */}
      <Section surface="surface-dark" id="areas-cta">
        <Container>
          <div
            className="rounded-lg px-8 py-16 text-center"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)',
            }}
          >
            <Reveal>
              <h2
                className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-4"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
              >
                Not Sure If We Cover Your Area?
              </h2>
              <p
                className="text-lg mb-8 max-w-lg mx-auto"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                Just ask — we likely cover your area. Free quote in{' '}
                {business.responseTime}, no obligation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <QuoteButton
                  size="xl"
                  className="bg-fg text-accent hover:bg-fg/90 border-transparent"
                  track={{
                    category: 'conversion',
                    action: 'button_click',
                    label: 'areas_cta_get_quote',
                  }}
                >
                  Get Free Quote
                </QuoteButton>
                <Button
                  variant="phone"
                  size="xl"
                  href={business.phoneHref}
                  className="border-white/60 !text-white hover:bg-white/10 hover:!text-white hover:border-white"
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
