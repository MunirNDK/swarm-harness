import type { Metadata } from 'next';
import Image from 'next/image';
import { Truck, Calendar, UserCheck, ClipboardList } from 'lucide-react';
import { pageMeta, serviceLd, breadcrumbLd } from '@/lib/seo';
import { reviews, images, business } from '@/lib/site';
import { getService } from '@/lib/wordpress/services';
import { notFound } from 'next/navigation';
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
import type { PricingTier } from '@/lib/wordpress/types';

export const metadata: Metadata = pageMeta({
  title: 'Fleet Detailing for NJ Businesses',
  description:
    'Mobile fleet detailing with on-site service, volume pricing, and dedicated account management for businesses in Northern New Jersey. Free fleet assessment quickly.',
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

/**
 * Fleet-page-only augmentation of the CMS fleet pricing tiers. Prices,
 * names and inclusions come from the shared service object (fleet.pricingTiers);
 * this layers on the richer, marketing-page context (grouping into one-time vs
 * recurring, a service-frequency badge, a "best for" blurb, and a frequency to
 * prefill into the quote form) that the plainer /services/fleet-detailing grid
 * intentionally omits. Keyed by tier name.
 */
interface FleetTierDetail {
  group: 'one-time' | 'recurring';
  blurb: string;
  frequency?: string;
  prefillFrequency: string;
}

const FLEET_TIER_DETAIL: Record<string, FleetTierDetail> = {
  'Fleet Maintenance Detail': {
    group: 'one-time',
    blurb: 'Fast, essential upkeep for vehicles that just need to look clean and professional.',
    prefillFrequency: 'One-Time Service',
  },
  'Fleet Professional Detail': {
    group: 'one-time',
    blurb: 'A more thorough clean with added protection and a sharper finish for customer-facing vehicles.',
    prefillFrequency: 'One-Time Service',
  },
  'Fleet Complete Detail': {
    group: 'one-time',
    blurb: 'A full, top-to-bottom detail for vehicles that need a complete reset.',
    prefillFrequency: 'One-Time Service',
  },
  'Monthly Fleet Maintenance': {
    group: 'recurring',
    frequency: 'Monthly',
    blurb: 'Recommended for high-use service vans, company cars, and rideshare fleets that must stay clean year-round.',
    prefillFrequency: 'Monthly',
  },
  'Quarterly Fleet Maintenance': {
    group: 'recurring',
    frequency: 'Every 3 months',
    blurb: 'For businesses that want their vehicles professionally refreshed several times per year.',
    prefillFrequency: 'Quarterly',
  },
  'Annual Fleet Restoration Detail': {
    group: 'recurring',
    frequency: 'Once per year',
    blurb: 'A yearly restoration that keeps a company fleet looking consistently professional.',
    prefillFrequency: 'Annually',
  },
};

function FleetTierCard({ tier }: { tier: PricingTier }) {
  const detail = FLEET_TIER_DETAIL[tier.name];
  return (
    <GlowCard className="h-full flex flex-col">
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-base leading-snug">
            {tier.name}
          </h4>
          {detail?.frequency && (
            <span className="flex-shrink-0 rounded-full border border-accent/40 px-2.5 py-1 font-mono text-[0.55rem] tracking-[0.08em] uppercase text-accent whitespace-nowrap">
              {detail.frequency}
            </span>
          )}
        </div>

        <div>
          <p
            className="font-sans font-bold text-accent"
            style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2rem)', lineHeight: 1.1 }}
          >
            {tier.price}
          </p>
          {tier.meta && (
            <p className="mt-1 font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint">
              {tier.meta}
            </p>
          )}
        </div>

        {detail?.blurb && (
          <p className="text-fg-soft text-sm leading-relaxed">{detail.blurb}</p>
        )}

        {tier.includes.length > 0 && (
          <ul className="space-y-2 flex-1">
            {tier.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  aria-hidden="true"
                />
                <span className="text-fg-soft text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          <QuoteButton
            variant="outline"
            size="md"
            className="w-full"
            prefill={{ service: 'fleet-detailing', serviceFrequency: detail?.prefillFrequency }}
            track={{
              category: 'conversion',
              action: 'button_click',
              label: 'fleet_pricing_get_quote',
            }}
          >
            Request Quote
          </QuoteButton>
        </div>
      </div>
    </GlowCard>
  );
}

export default async function FleetPage() {
  const fleet = await getService('fleet-detailing');
  if (!fleet) notFound();

  // Split the CMS fleet tiers into the two marketing groups by name.
  const oneTimeTiers = fleet.pricingTiers.filter(
    (t) => FLEET_TIER_DETAIL[t.name]?.group === 'one-time'
  );
  const recurringTiers = fleet.pricingTiers.filter(
    (t) => FLEET_TIER_DETAIL[t.name]?.group === 'recurring'
  );

  return (
    <>
      <JsonLd
        data={[
          serviceLd({ name: fleet.name, description: fleet.longDescription, slug: fleet.slug }),
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
              'linear-gradient(to bottom,rgba(255,255,255,0.75) 0%,rgba(250,250,248,1) 100%)',
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
              {fleet.longDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <QuoteButton
                size="lg"
                prefill={{ service: 'fleet-detailing' }}
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
            {fleet.processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="flex flex-col gap-4">
                  <div
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-mono font-bold text-cta-fg text-sm flex-shrink-0"
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

      {/* ── Fleet Pricing — one-time detailing vs recurring plans (from the CMS) ── */}
      <Section surface="surface" id="fleet-pricing">
        <Container>
          <SectionHeading
            kicker="Fleet Pricing"
            title="Detailing & Maintenance Programs"
            subtitle="Two ways to keep your fleet sharp — a one-time detail priced per vehicle, or a recurring maintenance plan on your schedule. All pricing is per vehicle and finalized after a quick assessment."
          />

          {/* Group 1 — One-time per-vehicle detailing */}
          {oneTimeTiers.length > 0 && (
            <div className="mb-14">
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-[clamp(1.35rem,2.2vw,1.75rem)]">
                  One-Time Fleet Detailing
                </h3>
                <p className="text-fg-soft text-sm leading-relaxed md:max-w-md md:text-right">
                  Priced per vehicle for a single visit — detail any number of vehicles, no commitment.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-bay">
                {oneTimeTiers.map((tier, i) => (
                  <Reveal key={tier.name} delay={i * 80} className="h-full">
                    <FleetTierCard tier={tier} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Group 2 — Recurring scheduled maintenance plans */}
          {recurringTiers.length > 0 && (
            <div>
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-[clamp(1.35rem,2.2vw,1.75rem)]">
                  Recurring Maintenance Plans
                </h3>
                <p className="text-fg-soft text-sm leading-relaxed md:max-w-md md:text-right">
                  Scheduled visits that keep every vehicle consistently clean, protected, and presentation-ready.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-bay">
                {recurringTiers.map((tier, i) => (
                  <Reveal key={tier.name} delay={i * 80} className="h-full">
                    <FleetTierCard tier={tier} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {fleet.pricingNote && (
            <p className="mt-10 max-w-3xl text-fg-faint text-xs leading-relaxed">
              {fleet.pricingNote}
            </p>
          )}
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
                Tell us about your fleet and we&apos;ll respond quickly with a
                custom proposal — no obligation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <QuoteButton
                  size="lg"
                  prefill={{ service: 'fleet-detailing' }}
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
