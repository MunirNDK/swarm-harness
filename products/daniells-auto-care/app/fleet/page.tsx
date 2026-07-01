import type { Metadata } from 'next';
import Image from 'next/image';
import { Truck, Calendar, UserCheck, ClipboardList } from 'lucide-react';
import { pageMeta, serviceLd, breadcrumbLd } from '@/lib/seo';
import { services, reviews, images, business } from '@/lib/site';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { Button } from '@/components/ui/button';
import { TrustMarquee } from '@/components/trust-marquee';
import { ReviewCard } from '@/components/review-card';
import { QuoteButton } from '@/components/quote-modal';

const fleet = services.find((s) => s.slug === 'fleet-detailing')!;

export const metadata: Metadata = pageMeta({
  title: 'Fleet Detailing for NJ Businesses',
  description:
    'Mobile fleet detailing with on-site service, volume pricing, and dedicated account management for businesses in Northern New Jersey. Free fleet assessment in 15 min.',
  path: '/fleet',
});

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Fleet Detailing', href: '/fleet' },
];

const BENEFITS = [
  {
    icon: Truck,
    title: 'On-Site Mobile Service',
    desc: 'We bring our full commercial detailing rig to your depot, office, or jobsite — minimising downtime and keeping your fleet on the road.',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    desc: 'Weekly, bi-weekly, or monthly programs that keep every vehicle in your fleet consistently clean, protected, and presentation-ready.',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Account Contact',
    desc: 'A single point of contact for scheduling, service history, and special requests — you never repeat yourself.',
  },
  {
    icon: ClipboardList,
    title: 'Quality Reporting',
    desc: 'After each service cycle, we provide a brief condition summary so you can track consistency and catch wear issues early.',
  },
];

const TIERS = [
  {
    label: 'Small Fleet',
    desc: 'Suitable for businesses running 3–10 vehicles. Monthly or bi-monthly scheduling keeps a compact fleet presentation-ready without disrupting daily operations.',
  },
  {
    label: 'Mid-Size Fleet',
    desc: 'Designed for companies operating 11–30 vehicles. Bi-weekly or monthly rotations with scheduled on-site visits and a dedicated account contact.',
  },
  {
    label: 'Large Fleet',
    desc: 'For businesses managing 31 or more vehicles. Weekly rolling schedules, priority dispatch, volume pricing, and full service reporting.',
  },
];

export default function FleetPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceLd({ name: fleet.name, description: fleet.long, slug: fleet.slug }),
          breadcrumbLd(BREADCRUMBS),
        ]}
      />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-3">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-surface-dark">
        <Image
          src={images.fleet}
          alt="A row of commercial vehicles awaiting professional on-site mobile detailing"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom,rgba(5,5,5,0.75) 0%,rgba(10,10,10,1) 100%)',
          }}
          aria-hidden="true"
        />
        <Container className="relative z-10 py-20 md:py-28">
          <Reveal>
            <p className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent">
              Corporate Fleet Programs
            </p>
            <h1
              className="font-sans font-bold uppercase tracking-[-0.02em] text-fg"
              style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)', lineHeight: '1.05' }}
            >
              Mobile Fleet Detailing
              <br />
              <span className="text-accent">Built for Business</span>
            </h1>
            <p className="mt-6 max-w-xl text-fg-soft text-lg leading-relaxed">
              {fleet.long}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <QuoteButton
                size="lg"
                track={{
                  category: 'conversion',
                  action:   'button_click',
                  label:    'fleet_hero_get_quote',
                }}
              >
                Request Fleet Assessment
              </QuoteButton>
              <Button
                href={business.phoneHref}
                variant="phone"
                size="lg"
                track={{ category: 'conversion', action: 'link_click', label: 'phone_call' }}
              >
                {business.phone}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Benefits ── */}
      <Section surface="surface" id="benefits">
        <Container>
          <SectionHeading
            kicker="Fleet Solutions"
            title="Why Businesses Choose Daniells"
            subtitle="A dedicated program built around your operations — not the other way around."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-bay">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 60}>
                <GlowCard className="h-full p-8 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface2 border border-border flex items-center justify-center text-accent flex-shrink-0">
                    <b.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-base">
                    {b.title}
                  </h3>
                  <p className="text-fg-soft text-sm leading-relaxed">{b.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Process ── */}
      <Section surface="bg" id="process">
        <Container>
          <SectionHeading
            kicker="How It Works"
            title="Our Fleet Program Process"
            subtitle="Three steps from first contact to a consistently clean, professional fleet."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-bay">
            {fleet.process.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="flex flex-col gap-4">
                  <div
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-mono font-bold text-fg text-sm flex-shrink-0"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-base">
                    {step.title}
                  </h3>
                  <p className="text-fg-soft text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Volume Pricing Tiers (no fabricated prices) ── */}
      <Section surface="surface" id="pricing">
        <Container>
          <SectionHeading
            kicker="Custom Volume Pricing"
            title="Fleet Programs by Size"
            subtitle="Every program is custom-quoted based on fleet size, vehicle types, and service frequency. Request a free fleet assessment to receive your tailored proposal — no obligation."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-bay">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.label} delay={i * 80} className="h-full">
                <GlowCard className="h-full flex flex-col">
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-lg">
                      {tier.label}
                    </h3>
                    <p className="text-fg-soft text-sm leading-relaxed flex-1">{tier.desc}</p>
                    <div className="mt-auto">
                      <QuoteButton
                        variant="outline"
                        size="md"
                        track={{
                          category: 'conversion',
                          action:   'button_click',
                          label:    `fleet_tier_custom_quote`,
                        }}
                      >
                        Custom Quote
                      </QuoteButton>
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Reviews ── */}
      <Section surface="bg" id="reviews">
        <Container>
          <SectionHeading
            kicker="What Clients Say"
            title="140+ Five-Star Reviews"
            subtitle="Northern NJ businesses and vehicle owners trust Daniells Auto Care."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-bay">
            {reviews.map((r) => (
              <Reveal key={r.name}>
                <ReviewCard review={r} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Trust Marquee ── */}
      <TrustMarquee />

      {/* ── Fleet CTA ── */}
      <Section surface="surface-dark-2" id="fleet-cta">
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2
                className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-4"
                style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}
              >
                Build a Fleet Program Today
              </h2>
              <p className="text-fg-soft mb-8 leading-relaxed">
                Tell us about your fleet and we&apos;ll respond within {business.responseTime} with a
                custom proposal — no obligation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <QuoteButton
                  size="lg"
                  track={{
                    category: 'conversion',
                    action:   'button_click',
                    label:    'fleet_cta_get_quote',
                  }}
                >
                  Request Free Assessment
                </QuoteButton>
                <Button
                  href={business.phoneHref}
                  variant="phone"
                  size="lg"
                  track={{ category: 'conversion', action: 'link_click', label: 'phone_call' }}
                >
                  {business.phone}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
