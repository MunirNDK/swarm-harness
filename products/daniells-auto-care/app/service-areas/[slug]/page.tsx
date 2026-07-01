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
import { business, areas, services, reviews, faqs, areaIntro } from '@/lib/site';
import { pageMeta, localBusinessLd, faqLd, breadcrumbLd } from '@/lib/seo';

type Props = { params: { slug: string } };

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export function generateStaticParams() {
  return areas.map((area) => ({ slug: slugify(area) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = areas.find((a) => slugify(a) === params.slug);
  if (!area) return {};
  return pageMeta({
    title: `Auto Detailing in ${area}, NJ | Daniells Auto Care`,
    description: `Professional mobile auto detailing in ${area}, NJ. Same-day service, free quotes, 300+ 5-star reviews. Ceramic coating, paint correction & more.`,
    path: `/service-areas/${params.slug}`,
  });
}

export default function AreaDetailPage({ params }: Props) {
  const area = areas.find((a) => slugify(a) === params.slug);
  if (!area) notFound();

  const town = area;
  const intro = areaIntro(town);

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
            <Breadcrumbs items={breadcrumbs} className="mb-8" />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Reveal delay={60}>
                <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent mb-3">
                  Mobile Auto Detailing · Northern NJ
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h1
                  className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.07 }}
                >
                  Auto Detailing in{' '}
                  <span style={{ color: 'var(--accent)' }}>{town}</span>, NJ
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-fg-soft text-lg leading-relaxed mb-8">
                  {intro}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: business.reviewsCount, label: 'Five-Star Reviews' },
                  { value: business.experienceYears, label: 'Years Experience' },
                  { value: business.vehiclesDetailed, label: 'Vehicles Detailed' },
                  { value: business.responseTime, label: 'Quote Response' },
                ].map((stat) => (
                  <GlowCard key={stat.label}>
                    <div className="p-6 text-center">
                      <p
                        className="font-sans font-extrabold text-accent leading-none mb-1"
                        style={{ fontSize: 'var(--t-3xl)' }}
                      >
                        {stat.value}
                      </p>
                      <p className="font-mono text-xs text-fg-faint uppercase tracking-[0.1em]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* ── REVIEWS ── surface-dark */}
      <Section surface="surface-dark" id="area-reviews">
        <Container>
          <SectionHeading
            kicker="Testimonials"
            title="What Our Customers Say"
            subtitle="Real reviews from drivers across Northern New Jersey."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 40}>
                <details className="rounded-lg border border-border bg-surface overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-sans font-bold text-fg text-sm uppercase tracking-[0.02em] hover:text-accent transition-colors duration-fast ease-default min-h-[44px]">
                    <span>{faq.q}</span>
                    <span
                      className="flex-shrink-0 text-accent text-xl leading-none"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-fg-soft text-sm leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── NEARBY AREAS INTERNAL LINKS ── surface */}
      <Section surface="surface" id="nearby-areas">
        <Container>
          <p className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-lg mb-4">
            Other Areas We Serve
          </p>
          <div className="flex flex-wrap gap-3">
            {areas
              .filter((a) => slugify(a) !== params.slug)
              .map((a) => {
                const aSlug = slugify(a);
                return (
                  <Link
                    key={a}
                    href={`/service-areas/${aSlug}`}
                    className="rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.06em] text-fg-soft hover:border-accent hover:text-accent transition-all duration-fast ease-default min-h-[44px] flex items-center"
                    data-track-category="navigation"
                    data-track-action="link_click"
                    data-track-label={`area_${aSlug}`}
                    data-track-context="internal"
                  >
                    {a}
                  </Link>
                );
              })}
          </div>
        </Container>
      </Section>

      {/* ── FINAL CTA ── surface-dark */}
      <Section surface="surface-dark" id="area-cta">
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
                Book Your {town} Detail Today
              </h2>
              <p
                className="text-lg mb-8 max-w-lg mx-auto"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                Free quote in {business.responseTime}. Same-day service available.
                We come to your home or office in {town}, NJ.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <QuoteButton
                  size="xl"
                  className="bg-fg text-accent hover:bg-fg/90 border-transparent"
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
                  className="border-white/60 text-white hover:bg-white/10 hover:border-white"
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
