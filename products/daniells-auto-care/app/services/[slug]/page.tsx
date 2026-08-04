import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { GlowCard } from '@/components/ui/glow-card';
import { FaqItem } from '@/components/faq-item';
import { ServiceCard } from '@/components/service-card';
import { ServicePricing } from '@/components/service-pricing';
import { QuoteButton } from '@/components/quote-modal';
import { business } from '@/lib/site';
import { serviceImageUrl } from '@/lib/wordpress/fallback-images';
import { pageMeta, serviceLd, faqLd, breadcrumbLd } from '@/lib/seo';
import { getService, getServices } from '@/lib/wordpress/services';
import { getServiceAreas } from '@/lib/wordpress/service-areas';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) return {};
  return pageMeta({
    title: `${service.name} in Northern NJ | Daniells Auto Care`,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await getService(params.slug);
  if (!service) notFound();

  const [allServices, allAreas] = await Promise.all([getServices(), getServiceAreas()]);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.name, href: `/services/${service.slug}` },
  ];

  const relatedServices = allServices
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  // Empty relation => fall back to "all areas" (matches pre-CMS behavior) — schema contract §5.2
  const availableAreas =
    service.relatedServiceAreaSlugs.length > 0
      ? allAreas.filter((a) => service.relatedServiceAreaSlugs.includes(a.slug))
      : allAreas;

  const heroImage = serviceImageUrl(service.slug, service.featuredImage?.url);

  const sdLd = serviceLd(
    { name: service.name, description: service.longDescription, slug: service.slug },
  );
  const sdFaqLd = faqLd(service.faqItems);
  const sdBcLd = breadcrumbLd(breadcrumbs);

  return (
    <>
      <JsonLd data={[sdLd, sdFaqLd, sdBcLd]} />

      {/* ── SERVICE HERO ── */}
      <Section surface="surface-dark" id="service-hero">
        <Container>
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="mb-bay" />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-stall items-stretch">
            {/* Left — h1 + description + CTAs */}
            <div>
              <Reveal delay={60}>
                <p className="font-mono text-mono-sm tracking-label uppercase text-accent mb-bolt">
                  Professional Mobile Service · Northern NJ
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h1
                  className="mb-panel text-3xl"
                >
                  {service.name}
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-fg-soft text-lg leading-relaxed mb-panel">
                  {service.longDescription}
                </p>
              </Reveal>

              <Reveal delay={260}>
                <div className="flex flex-wrap gap-gauge">
                  <QuoteButton
                    size="lg"
                    track={{
                      category: 'conversion',
                      action: 'button_click',
                      label: `${service.slug}_get_quote`,
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
            </div>

            {/* Right — service image */}
            <Reveal delay={200} className="h-full">
              <div className="relative rounded-lg overflow-hidden border border-border aspect-[4/3] lg:aspect-auto lg:h-full">
                {/* Red glow behind image */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 80% 80% at 50% 0%, var(--accent-soft) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <Image
                  src={heroImage}
                  alt={service.featuredImage?.alt || `${service.name} — Daniells Auto Care mobile service in Northern New Jersey`}
                  fill
                  className="object-cover z-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── BENEFITS ── bg */}
      {service.benefits.length > 0 && (
        <Section surface="bg" id="service-benefits">
          <Container>
            <SectionHeading
              kicker="What's Included"
              title={service.benefitsTitle || `${service.name} Package`}
              subtitle={
                service.benefitsSubtitle ||
                'Every service includes our commitment to quality, meticulous attention to detail, and 100% satisfaction guarantee.'
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gauge">
              {service.benefits.map((benefit, i) => (
                <Reveal key={i} delay={i * 50}>
                  <GlowCard className="h-full">
                    <div className="p-panel flex items-start gap-gauge">
                      {/* Red bullet */}
                      <span
                        className="flex-shrink-0 mt-pin w-2 h-2 rounded-full"
                        style={{ background: 'var(--accent)' }}
                        aria-hidden="true"
                      />
                      <p className="text-fg-soft text-sm leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── PRICING ── surface (tiers + optional add-ons); hidden when no CMS tiers */}
      <ServicePricing service={service} surface="surface" />

      {/* ── PROCESS ── bg (kept bg so surfaces alternate around the pricing block) */}
      {service.processSteps.length > 0 && (
        <Section surface="bg" id="service-process">
          <Container>
            <SectionHeading
              kicker="Our Process"
              title={service.processTitle || `How We Deliver ${service.name}`}
              subtitle={
                service.processSubtitle ||
                'A proven, step-by-step approach for consistent, showroom-quality results every time.'
              }
            />
            <div className="max-w-4xl mx-auto space-y-panel">
              {service.processSteps.map((step, i) => (
                <Reveal key={i} delay={i * 80}>
                  <GlowCard>
                    <div className="p-panel md:p-bay flex gap-panel">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-cta-fg text-sm"
                        style={{ background: 'var(--accent)' }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-base mb-rivet">
                          {step.title}
                        </h3>
                        <p className="text-fg-soft text-sm leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── FAQ ── surface-dark + FAQPage JSON-LD (emitted above) */}
      {service.faqItems.length > 0 && (
        <Section surface="surface-dark" id="service-faq">
          <Container>
            <SectionHeading
              kicker="FAQ"
              title={service.faqTitle || `${service.name} Questions`}
              subtitle={service.faqSubtitle || 'Answers to common questions about this service.'}
            />
            <div className="max-w-3xl mx-auto space-y-gauge">
              {service.faqItems.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <FaqItem faq={{ q: item.q, a: item.a }} index={i} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── RELATED SERVICES ── bg + internal linking */}
      {relatedServices.length > 0 && (
        <Section surface="bg" id="related-services">
          <Container>
            <SectionHeading
              kicker="Explore More"
              title="Related Services"
              subtitle="Complete your vehicle care with these complementary services — all available as mobile service in Northern NJ."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-panel mb-bay">
              {relatedServices.map((rs, i) => (
                <Reveal key={rs.slug} delay={i * 80}>
                  <ServiceCard
                    service={{ slug: rs.slug, name: rs.name, icon: rs.icon, short: rs.shortDescription }}
                  />
                </Reveal>
              ))}
            </div>
            <div className="flex flex-wrap gap-gauge justify-center">
              <Button
                variant="outline"
                href="/services"
                track={{
                  category: 'navigation',
                  action: 'link_click',
                  label: 'all_services',
                  context: 'internal',
                }}
              >
                View All Services
              </Button>
              <Button
                variant="outline"
                href="/service-areas"
                track={{
                  category: 'navigation',
                  action: 'link_click',
                  label: 'service_areas',
                  context: 'internal',
                }}
              >
                See Service Areas
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {/* ── INLINE CTA ── surface-dark */}
      <Section surface="surface-dark" id="service-cta">
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
                Ready to Book {service.name}?
              </h2>
              <p
                className="text-lg mb-bay max-w-lg mx-auto text-cta-fg/80"
              >
                Free, fast quotes. We come to you anywhere
                in Northern NJ — no shop visit required.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-gauge">
                <QuoteButton
                  size="xl"
                  className="bg-cta-fg text-accent hover:bg-cta-fg/90 border-transparent"
                  track={{
                    category: 'conversion',
                    action: 'button_click',
                    label: `${service.slug}_cta_get_quote`,
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

      {/* ── SERVICE AREAS INTERNAL LINKS ── */}
      <Section surface="bg" id="service-areas-links">
        <Container>
          <p className="font-mono text-mono-sm tracking-label uppercase text-accent mb-gauge">
            Available In
          </p>
          <div className="flex flex-wrap gap-bolt">
            {availableAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="rounded-full border border-border px-gauge py-rivet font-mono text-mono-sm uppercase tracking-label text-fg-soft hover:border-accent hover:text-accent transition-all duration-fast ease-default min-h-touch flex items-center"
                data-track-category="navigation"
                data-track-action="link_click"
                data-track-label={`area_${area.slug}`}
                data-track-context="internal"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
