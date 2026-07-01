import type { Metadata } from 'next';
import { Shield, GraduationCap, ShieldCheck, BadgeCheck } from 'lucide-react';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { business, whyChooseUs } from '@/lib/site';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { Button } from '@/components/ui/button';
import { TrustMarquee } from '@/components/trust-marquee';
import { QuoteButton } from '@/components/quote-modal';

const BREADCRUMBS = [
  { label: 'Home',     href: '/' },
  { label: 'Our Team', href: '/team' },
];

export const metadata: Metadata = pageMeta({
  title:       'Our Team — Factory-Trained Detailing Technicians',
  description:
    'Daniells Auto Care is a licensed, insured, factory-trained mobile detailing team with 8+ years of experience and 300+ five-star reviews across Northern New Jersey.',
  path: '/team',
});

const CREDENTIALS = [
  {
    icon: Shield,
    title: 'Licensed & Fully Insured',
    desc: 'Every service is backed by full commercial liability insurance — complete peace of mind while we work on your vehicle.',
  },
  {
    icon: GraduationCap,
    title: 'Factory-Trained Technicians',
    desc: 'Our detailers undergo professional detailing training and use commercial-grade products and equipment on every job.',
  },
  {
    icon: ShieldCheck,
    title: '2–10 Year Ceramic Coating Warranty',
    desc: 'Our premium ceramic coatings carry a manufacturer-backed warranty of up to 10 years — documented protection, not a promise.',
  },
  {
    icon: BadgeCheck,
    title: 'Lifetime Window Tint Warranty',
    desc: 'Our professional-grade window film is warranted for life against bubbling, peeling, and fading.',
  },
];

export default function TeamPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(BREADCRUMBS)} />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-3">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Hero ── */}
      <Section surface="surface-dark" id="team-hero">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <p className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent">
                Daniells Auto Care
              </p>
              <h1
                className="font-sans font-bold uppercase tracking-[-0.02em] text-fg"
                style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)', lineHeight: '1.05' }}
              >
                Our Team
              </h1>
              <p className="mt-6 text-fg-soft text-lg leading-relaxed max-w-xl">
                {business.experienceYears} years of experience. {business.vehiclesDetailed} vehicles
                detailed. {business.reviewsCount} five-star reviews. A professional mobile detailing
                operation built on craft, reliability, and genuine care for your vehicle.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Company Story ── */}
      <Section surface="surface" id="story">
        <Container>
          <div className="max-w-3xl">
            <Reveal>
              <SectionHeading
                kicker="About Us"
                title="Precision. Mobile. Professional."
                align="left"
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-fg-soft leading-relaxed">
                <p>
                  Daniells Auto Care was built on a straightforward idea: bring showroom-quality
                  detailing directly to our clients without compromising on the craft. Over{' '}
                  {business.experienceYears}, we have refined our mobile operation to deliver
                  professional-grade results at homes, offices, and commercial facilities across{' '}
                  {business.serviceArea}.
                </p>
                <p>
                  Our team is fully mobile — equipped with self-contained vans carrying water tanks,
                  power generators, and commercial detailing equipment. We do not need your hookups,
                  and you do not need to leave your driveway. Every appointment is attended by
                  factory-trained technicians who follow the same rigorous process on every vehicle,
                  regardless of make, model, or price point.
                </p>
                <p>
                  We are licensed and fully insured. That matters because we work on vehicles that
                  belong to people. Our service history of {business.vehiclesDetailed} detailed
                  vehicles and {business.reviewsCount} five-star ratings reflects a culture of
                  accountability: we stand behind every job, and we always do a final walkaround
                  before we leave.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Credentials ── */}
      <Section surface="bg" id="credentials">
        <Container>
          <SectionHeading
            kicker="Credentials"
            title="Why You Can Trust Us"
            subtitle="Real training, real insurance, real warranties — not just promises."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-bay">
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <GlowCard className="h-full p-8 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface2 border border-border flex items-center justify-center text-accent flex-shrink-0">
                    <c.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-base">
                    {c.title}
                  </h3>
                  <p className="text-fg-soft text-sm leading-relaxed">{c.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Why Choose Us (from site data — no fabricated content) ── */}
      <Section surface="surface" id="why-us">
        <Container>
          <SectionHeading
            kicker="What Sets Us Apart"
            title="The Daniells Difference"
            subtitle="Six reasons Northern NJ vehicle owners choose us — and stay with us."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-bay">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <GlowCard className="h-full p-6 flex flex-col gap-3">
                  <div
                    className="w-2 h-8 rounded-full bg-accent flex-shrink-0"
                    aria-hidden="true"
                  />
                  <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-sm">
                    {item.title}
                  </h3>
                  <p className="text-fg-soft text-sm leading-relaxed">{item.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Trust Marquee ── */}
      <TrustMarquee />

      {/* ── CTA ── */}
      <Section surface="surface-dark-2" id="team-cta">
        <Container>
          <Reveal>
            <div className="text-center max-w-xl mx-auto">
              <h2
                className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-4"
                style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)' }}
              >
                Experience the Difference
              </h2>
              <p className="text-fg-soft mb-8 leading-relaxed">
                Ready to put our team to work on your vehicle? Get your free quote — we respond in{' '}
                {business.responseTime}.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <QuoteButton
                  size="lg"
                  track={{
                    category: 'conversion',
                    action:   'button_click',
                    label:    'team_cta_get_quote',
                  }}
                />
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
