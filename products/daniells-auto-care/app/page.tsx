import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { GlowCard } from '@/components/ui/glow-card';
import { TrustMarquee } from '@/components/trust-marquee';
import { ServiceCard } from '@/components/service-card';
import { ReviewCard } from '@/components/review-card';
import { StatStrip } from '@/components/stat-strip';
import { BeforeAfterGrid } from '@/components/before-after';
import { QuoteForm } from '@/components/quote-form';
import { QuoteButton } from '@/components/quote-modal';
import { FaqItem } from '@/components/faq-item';
import {
  business,
  stats,
  reviews,
  faqs,
  whyChooseUs,
  processSteps,
  beforeAfter,
  images,
} from '@/lib/site';
import { pageMeta, localBusinessLd, organizationLd, faqLd } from '@/lib/seo';
import { getServices } from '@/lib/wordpress/services';
import { getServiceAreas } from '@/lib/wordpress/service-areas';

export const metadata: Metadata = pageMeta({
  title: 'Mobile Auto Detailing Northern NJ | Daniells Auto Care',
  description:
    'Professional mobile auto detailing in Northern NJ. Same-day service, 140+ 5-star reviews, free quotes. Ceramic coating, paint correction & more.',
  path: '/',
});

export default async function HomePage() {
  const [services, areas] = await Promise.all([getServices(), getServiceAreas()]);

  return (
    <>
      <JsonLd data={[localBusinessLd(), organizationLd(), faqLd(faqs)]} />

      {/* ── HERO ── surface-dark, single h1, QuoteForm right column */}
      <Section
        surface="surface-dark"
        id="hero"
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '85vh', paddingTop: 0, paddingBottom: 0 }}
      >
        {/* Hero image + dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={images.hero}
            alt="Daniells Auto Care mobile auto detailing in Northern New Jersey — showroom results at your doorstep"
            fill
            className="object-cover"
            priority
          />
          {/* Dark base overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgb(var(--surface-rgb) / 0.88)' }}
            aria-hidden="true"
          />
          {/* Red radial accent — right side on desktop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 60% at 85% 45%, var(--accent-soft) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        </div>

        <Container className="relative z-10 py-hangar lg:py-perimeter">
          <div className="grid lg:grid-cols-2 gap-stall items-center">
            {/* Left column — h1 + subheading + CTAs */}
            <div>
              <Reveal>
                <p className="font-mono text-mono-sm tracking-label uppercase text-accent mb-gauge">
                  Northern New Jersey · Mobile Detailing
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mb-panel text-4xl">
                  Flawless Mobile Detailing{' '}
                  <span className="text-accent">Across Northern NJ.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-fg-soft text-lg leading-relaxed mb-bay max-w-lg">
                  Professional mobile detailing across Northern NJ — we come to your home or office, fully equipped to deliver a flawless, showroom finish.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap gap-gauge">
                  <QuoteButton
                    size="lg"
                    track={{
                      category: 'conversion',
                      action: 'button_click',
                      label: 'hero_get_free_quote',
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

            {/* Right column — QuoteForm (desktop only) */}
            <Reveal delay={200} className="hidden lg:block">
              <div
                className="rounded-lg border border-border bg-surface p-bay border-t-thick border-accent"
              >
                <h2
                  className="mb-panel text-xl"
                >
                  Get Your Free Quote
                </h2>
                <QuoteForm services={services} />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── STAT STRIP ── */}
      <Section surface="surface-dark-2" id="stats" className="!py-0">
        <StatStrip stats={stats} />
      </Section>

      {/* ── TRUST MARQUEE ── (gradient CTA bar — renders its own bg) */}
      <TrustMarquee />

      {/* ── SERVICES GRID ── bg, all 8 service cards, 3-col */}
      <Section surface="bg" id="services">
        <Container>
          <SectionHeading
            kicker="Our Services"
            title="Full-Spectrum Auto Detailing"
            subtitle={`Every service performed with professional-grade products and meticulous precision. All ${services.length} services, front and center — nothing hidden.`}
          />
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
        </Container>
      </Section>

      {/* ── WHY CHOOSE US ── surface */}
      <Section surface="surface" id="why-us">
        <Container>
          <SectionHeading
            kicker="Why Daniells"
            title="The Difference Is in the Details"
            subtitle="Mobile convenience meets factory-grade expertise. We bring the detailing bay to your driveway."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-panel">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} className="h-full">
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
            title="Quote → Arrive → Detail → Done"
            subtitle="Four simple steps to a showroom-ready vehicle, all at your location."
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

      {/* ── BEFORE / AFTER TEASER ── bg, 3 items, link to gallery */}
      <Section surface="bg" id="gallery">
        <Container>
          <SectionHeading
            kicker="Real Results"
            title="Before & After Transformations"
            subtitle="Actual client vehicles — no retouching. Drag the slider to see the difference."
          />
          <BeforeAfterGrid
            items={beforeAfter.slice(0, 3)}
            className="md:grid-cols-3"
          />
          <div className="mt-bay text-center">
            <Button
              variant="outline"
              href="/gallery"
              track={{
                category: 'navigation',
                action: 'link_click',
                label: 'gallery',
                context: 'internal',
              }}
            >
              View Full Gallery
            </Button>
          </div>
        </Container>
      </Section>

      {/* ── REVIEWS ── surface */}
      <Section surface="surface" id="reviews">
        <Container>
          <SectionHeading
            kicker="Testimonials"
            title="140+ Five-Star Reviews"
            subtitle={`Rated 5.0 on Google with ${business.googleReviews} verified reviews from Northern NJ drivers.`}
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

      {/* ── SERVICE AREAS GRID ── surface-dark, 10 areas each linking to /service-areas/<slug> */}
      <Section surface="surface-dark" id="service-areas">
        <Container>
          <SectionHeading
            kicker="Where We Serve"
            title="Northern NJ's Mobile Detail Team"
            subtitle="We come to your doorstep. Select your area for local service details and availability."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-bolt mb-bay">
            {areas.map((area) => (
              <Reveal key={area.slug}>
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="flex items-center justify-center rounded-lg border border-border bg-surface px-bolt py-gauge text-center font-mono text-mono-sm uppercase tracking-label text-fg-soft hover:border-accent hover:text-accent transition-all duration-base ease-default min-h-touch"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={`area_${area.slug}`}
                  data-track-context="internal"
                >
                  {area.name}
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="text-center">
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
              View All Service Areas
            </Button>
          </div>
        </Container>
      </Section>

      {/* ── FAQ ── bg, animated client-component accordion + FAQPage JSON-LD (already in <JsonLd> above) */}
      <Section surface="bg" id="faq">
        <Container>
          <SectionHeading
            kicker="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about mobile auto detailing in Northern NJ."
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

      {/* ── FINAL CTA ── §12.14 red gradient band, big phone + QuoteButton */}
      <Section surface="surface-dark" id="final-cta">
        <Container>
          <div
            className="rounded-lg px-bay py-deck md:py-hangar text-center"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)',
            }}
          >
            <Reveal>
              <p className="font-mono text-mono-sm tracking-label uppercase mb-bolt text-cta-fg/60">
                Same-Day Service Available
              </p>
              <h2
                className="text-cta-fg mb-gauge text-3xl"
              >
                Ready for a Showroom Finish?
              </h2>
              <p
                className="text-lg mb-bay max-w-xl mx-auto text-cta-fg/80"
              >
                Free, no-obligation quotes — fast. We come to you anywhere
                in Northern NJ — home, office, or anywhere convenient.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-gauge">
                <QuoteButton
                  size="xl"
                  className="bg-cta-fg text-accent hover:bg-cta-fg/90 border-transparent"
                  track={{
                    category: 'conversion',
                    action: 'button_click',
                    label: 'final_cta_get_free_quote',
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
