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
import { business } from '@/lib/site';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { getServiceAreas } from '@/lib/wordpress/service-areas';
import { getServices } from '@/lib/wordpress/services';

export const metadata: Metadata = pageMeta({
  title: 'Service Areas — Northern NJ | Daniells Auto Care',
  description:
    'Mobile auto detailing across Northern New Jersey. Serving Franklin Lakes, Ridgewood, Tenafly, Chatham, Madison and more. Same-day service, 100% satisfaction.',
  path: '/service-areas',
});

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Service Areas', href: '/service-areas' },
];

export default async function ServiceAreasPage() {
  const [areas, services] = await Promise.all([getServiceAreas(), getServices()]);

  return (
    <>
      <JsonLd data={breadcrumbLd(breadcrumbs)} />

      {/* ── PAGE HEADER ── surface-dark */}
      <Section surface="surface-dark" id="areas-header">
        <Container>
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="mb-bay" />
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mb-panel text-3xl"
            >
              Serving Northern New Jersey
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-fg-soft text-lg leading-relaxed max-w-3xl mb-bay">
              Daniells Auto Care brings professional mobile detailing directly to your doorstep across{' '}
              {business.serviceArea}. Same-day availability, free quotes, and {business.reviewsCount} five-star reviews across the region.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-gauge">
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
          {areas.length === 0 ? (
            <p className="text-fg-soft text-center py-stall mb-bay">
              Service areas are being updated — check back shortly, or{' '}
              <Link href="/contact" className="text-accent hover:text-accent-mid">
                contact us
              </Link>{' '}
              to confirm coverage in your town.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-panel mb-bay">
              {areas.map((area, i) => (
                <Reveal key={area.slug} delay={i * 60}>
                  <GlowCard>
                    <Link
                      href={`/service-areas/${area.slug}`}
                      className="block p-bay group min-h-touch"
                      data-track-category="navigation"
                      data-track-action="link_click"
                      data-track-label={`area_${area.slug}`}
                      data-track-context="internal"
                    >
                      {/* Red area code indicator */}
                      <p className="font-mono text-mono-sm tracking-label uppercase text-accent mb-rivet">
                        NJ · {area.slug}
                      </p>
                      <h3 className="text-xl mb-bolt group-hover:text-accent transition-colors duration-fast ease-default">
                        {area.name}
                      </h3>
                      <p className="text-fg-soft text-sm leading-relaxed mb-gauge">
                        Professional mobile auto detailing in {area.name}, NJ.
                        Same-day service, factory-trained technicians, free
                        quotes.
                      </p>
                      <span className="inline-flex items-center gap-rivet text-mono-sm font-bold uppercase tracking-label text-accent group-hover:text-accent-mid transition-colors duration-fast ease-default">
                        View {area.name} services
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
              ))}
            </div>
          )}

          {/* Service cross-links */}
          <div className="pt-bay border-t border-border">
            <p className="font-mono text-mono-sm tracking-label uppercase text-fg-faint mb-gauge">
              Services Available in All Areas
            </p>
            <div className="flex flex-wrap gap-bolt">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="rounded-full border border-border px-gauge py-rivet font-mono text-mono-sm uppercase tracking-label text-fg-soft hover:border-accent hover:text-accent transition-all duration-fast ease-default min-h-touch flex items-center"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-panel">
            {[
              {
                heading: 'Self-Contained Setup',
                body: 'Our vans carry onboard water tanks, generators, and professional-grade products. Zero hookups required on your end.',
              },
              {
                heading: 'Same-Day Availability',
                body: 'Call (973) 916-7868 or fill out our form and we respond quickly to confirm your appointment.',
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
                <GlowCard className="h-full flex flex-col">
                  <div className="p-bay h-full">
                    <h3 className="text-lg mb-bolt">
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
            className="rounded-lg px-bay py-deck text-center"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)',
            }}
          >
            <Reveal>
              <h2
                className="text-cta-fg mb-gauge text-3xl"
              >
                Not Sure If We Cover Your Area?
              </h2>
              <p
                className="text-lg mb-bay max-w-lg mx-auto text-cta-fg/80"
              >
                Just ask — we likely cover your area. Free, fast quotes, no obligation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-gauge">
                <QuoteButton
                  size="xl"
                  className="bg-cta-fg text-accent hover:bg-cta-fg/90 border-transparent"
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
