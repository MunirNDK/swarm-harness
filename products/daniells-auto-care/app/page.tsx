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
  services,
  areas,
  stats,
  reviews,
  faqs,
  whyChooseUs,
  processSteps,
  beforeAfter,
  images,
} from '@/lib/site';
import { pageMeta, localBusinessLd, organizationLd, faqLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Mobile Auto Detailing Northern NJ | Daniells Auto Care',
  description:
    'Professional mobile auto detailing in Northern NJ. Same-day service, 140+ 5-star reviews, free quotes. Ceramic coating, paint correction & more.',
  path: '/',
});

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export default function HomePage() {
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
            style={{ background: 'rgba(5,5,5,0.88)' }}
            aria-hidden="true"
          />
          {/* Red radial accent — right side on desktop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 60% at 85% 45%, rgba(232,5,5,0.18) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        </div>

        <Container className="relative z-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column — h1 + subheading + CTAs */}
            <div>
              <Reveal>
                <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent mb-4">
                  Northern New Jersey · Mobile Detailing
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1
                  className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-6"
                  style={{
                    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                    lineHeight: 1.07,
                  }}
                >
                  Flawless Mobile Detailing{' '}
                  <span style={{ color: 'var(--accent)' }}>
                    Across Northern NJ.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-fg-soft text-lg leading-relaxed mb-8 max-w-lg">
                  Professional mobile detailing across Northern NJ — we come to your home or office, fully equipped to deliver a flawless, showroom finish.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap gap-4">
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
                className="rounded-lg border border-border bg-surface p-8"
                style={{ borderTop: '3px solid var(--accent)' }}
              >
                <h2
                  className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-6"
                  style={{ fontSize: 'var(--t-xl)' }}
                >
                  Get Your Free Quote
                </h2>
                <QuoteForm />
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
            subtitle="Every service performed with professional-grade products and meticulous precision. All 8 services, front and center — nothing hidden."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <ServiceCard service={service} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} className="h-full">
                <GlowCard className="h-full flex flex-col">
                  <div className="p-8 h-full">
                    <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-lg mb-3">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-fg text-sm mb-4 flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-base mb-2">
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
          <div className="mt-8 text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            title="Northern New Jersey's Mobile Detail Team"
            subtitle="We come to your doorstep. Select your area for local service details and availability."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {areas.map((area) => (
              <Reveal key={area}>
                <Link
                  href={`/service-areas/${slugify(area)}`}
                  className="flex items-center justify-center rounded-lg border border-border bg-surface px-3 py-4 text-center font-mono text-xs uppercase tracking-[0.08em] text-fg-soft hover:border-accent hover:text-accent transition-all duration-base ease-default min-h-[44px]"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={`area_${slugify(area)}`}
                  data-track-context="internal"
                >
                  {area}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
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
            className="rounded-lg px-8 py-16 md:py-20 text-center"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)',
            }}
          >
            <Reveal>
              <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Same-Day Service Available
              </p>
              <h2
                className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                Ready for a Showroom Finish?
              </h2>
              <p
                className="text-lg mb-8 max-w-xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                Free quote in {business.responseTime}. We come to you anywhere
                in Northern NJ — home, office, or anywhere convenient.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <QuoteButton
                  size="xl"
                  className="bg-fg text-accent hover:bg-fg/90 border-transparent"
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
