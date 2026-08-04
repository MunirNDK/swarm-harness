import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import { ReviewCard } from '@/components/review-card';
import { QuoteButton } from '@/components/quote-modal';
import { TrustMarquee } from '@/components/trust-marquee';
import { FaqItem } from '@/components/faq-item';
import { business, reviews, faqs, areaIntro } from '@/lib/site';
import { pageMeta, localBusinessLd, faqLd, breadcrumbLd } from '@/lib/seo';
import { getServiceArea, getServiceAreas } from '@/lib/wordpress/service-areas';
import { getServices } from '@/lib/wordpress/services';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const areas = await getServiceAreas();
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await getServiceArea(params.slug);
  if (!area) return {};
  return pageMeta({
    title: `Auto Detailing in ${area.name}, NJ | Daniells Auto Care`,
    description:
      area.seoDescription ||
      `Professional mobile auto detailing in ${area.name}, NJ. Same-day service, free quotes, 140+ 5-star reviews. Ceramic coating, paint correction & more.`,
    path: `/service-areas/${params.slug}`,
  });
}

export default async function AreaDetailPage({ params }: Props) {
  const area = await getServiceArea(params.slug);
  if (!area) notFound();

  const [allServices, allAreas] = await Promise.all([getServices(), getServiceAreas()]);

  const town = area.name;
  // null/empty => fall back to the existing generic template — schema contract §3
  const intro = area.localIntroduction || areaIntro(town);

  // Empty relation => fall back to "all services" (matches pre-CMS behavior) — schema contract §5.3
  const availableServices =
    area.relatedServiceSlugs.length > 0
      ? allServices.filter((s) => area.relatedServiceSlugs.includes(s.slug))
      : allServices;

  const nearbyAreas = allAreas.filter((a) => a.slug !== area.slug);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: town, href: `/service-areas/${params.slug}` },
  ];

  const localLd = localBusinessLd();
  const bcLd = breadcrumbLd(breadcrumbs);
  const areaFaqLd = faqLd(faqs);

  return (
    <>
      <JsonLd data={[localLd, bcLd, areaFaqLd]} />

      {/* ── AREA HERO ── surface-dark */}
      <Section surface="surface-dark" id="area-hero">
        <Container>
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="mb-bay" />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-stall items-start">
            <div>
              <Reveal delay={60}>
                <p className="font-mono text-mono-sm tracking-label uppercase text-accent mb-bolt">
                  Mobile Auto Detailing · Northern NJ
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h1
                  className="mb-panel text-3xl"
                >
                  Auto Detailing in{' '}
                  <span style={{ color: 'var(--accent)' }}>{town}</span>, NJ
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-fg-soft text-lg leading-relaxed mb-bay">
                  {intro}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap gap-gauge">
                  <QuoteButton
                    size="lg"
                    track={{
                      category: 'conversion',
                      action: 'button_click',
                      label: `area_${params.slug}_get_quote`,
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

            {/* Stats column */}
            <Reveal delay={200}>
              <div className="grid grid-cols-2 gap-gauge">
                {[
                  { value: business.reviewsCount, label: 'Five-Star Reviews' },
                  { value: business.experienceYears, label: 'Years Combined Experience' },
                  { value: business.vehiclesDetailed, label: 'Vehicles Detailed' },
                  { value: 'Quick', label: 'Quote Response' },
                ].map((stat) => (
                  <GlowCard key={stat.label} className="h-full">
                    <div className="p-panel text-center">
                      <p
                        className="font-sans font-extrabold text-accent leading-none mb-pin text-3xl"
                      >
                        {stat.value}
                      </p>
                      <p className="font-mono text-mono-sm text-fg-faint uppercase tracking-label">
                        {stat.label}
                      </p>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── TRUST MARQUEE ── */}
      <TrustMarquee />

      {/* ── SERVICES IN TOWN ── bg */}
      <Section surface="bg" id="area-services">
        <Container>
          <SectionHeading
            kicker="Available Services"
            title={`Detailing Services in ${town}`}
            subtitle={`Complete auto detailing, ceramic coating, paint correction, window tinting, and more — all available as mobile service in ${town}.`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-panel mb-bay">
            {availableServices.map((service, i) => (
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
          <div className="flex flex-wrap gap-bolt justify-center">
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
          </div>
        </Container>
      </Section>

      {/* ── WHY CHOOSE US FOR THIS AREA ── surface */}
      <Section surface="surface" id="area-why-us">
        <Container>
          <SectionHeading
            kicker="Why Daniells"
            title={`Why ${town} Drivers Choose Us`}
            subtitle={`Mobile convenience, factory-trained technicians, and a 100% satisfaction guarantee — all backed by ${business.reviewsCount} five-star reviews.`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-panel">
            {[
              {
                heading: 'Mobile Convenience',
                body: `We come to your home or office in ${town} — no need to drive to a shop or wait in a lobby.`,
              },
              {
                heading: 'Same-Day Service',
                body: `Most details in ${town} are completed the same day you call. We respect your schedule.`,
              },
              {
                heading: 'Factory-Trained Techs',
                body: 'Every technician is trained on the latest products and techniques for consistent, high-quality results.',
              },
              {
                heading: '100% Satisfaction',
                body: 'If you\'re not completely satisfied, we make it right — no questions asked, every time.',
              },
            ].map((item, i) => (
              <Reveal key={item.heading} delay={i * 80}>
                <GlowCard className="h-full">
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

      {/* ── REVIEWS ── surface-dark */}
      <Section surface="surface-dark" id="area-reviews">
        <Container>
          <SectionHeading
            kicker="Testimonials"
            title="What Our Customers Say"
            subtitle="Real reviews from drivers across Northern New Jersey."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-panel">
            {reviews.map((review, i) => (
              <Reveal key={review.name} delay={i * 100}>
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── FAQ ── bg (uses site-wide faqs + FAQPage JSON-LD emitted above) */}
      <Section surface="bg" id="area-faq">
        <Container>
          <SectionHeading
            kicker="FAQ"
            title={`Detailing Questions for ${town}`}
            subtitle="Common questions from customers in the area."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gauge max-w-5xl mx-auto items-start">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 40}>
                <FaqItem faq={faq} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── NEARBY AREAS INTERNAL LINKS ── surface */}
      <Section surface="surface" id="nearby-areas">
        <Container>
          <p className="font-sans font-bold uppercase tracking-tight text-fg text-lg mb-gauge">
            Other Areas We Serve
          </p>
          <div className="flex flex-wrap gap-bolt">
            {nearbyAreas.map((a) => (
              <Link
                key={a.slug}
                href={`/service-areas/${a.slug}`}
                className="rounded-full border border-border px-gauge py-rivet font-mono text-mono-sm uppercase tracking-label text-fg-soft hover:border-accent hover:text-accent transition-all duration-fast ease-default min-h-touch flex items-center"
                data-track-category="navigation"
                data-track-action="link_click"
                data-track-label={`area_${a.slug}`}
                data-track-context="internal"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── FINAL CTA ── surface-dark */}
      <Section surface="surface-dark" id="area-cta">
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
                Book Your {town} Detail Today
              </h2>
              <p
                className="text-lg mb-bay max-w-lg mx-auto text-cta-fg/80"
              >
                Free, fast quotes. Same-day service available.
                We come to your home or office in {town}, NJ.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-gauge">
                <QuoteButton
                  size="xl"
                  className="bg-cta-fg text-accent hover:bg-cta-fg/90 border-transparent"
                  track={{
                    category: 'conversion',
                    action: 'button_click',
                    label: `area_${params.slug}_cta_get_quote`,
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
