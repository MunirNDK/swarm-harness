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
import { ServiceCard } from '@/components/service-card';
import { QuoteButton } from '@/components/quote-modal';
import { TreatmentLog, getLogProps } from '@/components/treatment-log';
import { business, services } from '@/lib/site';
import { pageMeta, serviceLd, faqLd, breadcrumbLd } from '@/lib/seo';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};
  return pageMeta({
    title: `${service.name} in Northern NJ | Daniells Auto Care`,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: Props) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.name, href: `/services/${service.slug}` },
  ];

  const relatedServices = services
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  const logProps = getLogProps(service.slug, service.name, service.process.length);

  const sdLd = serviceLd(
    { name: service.name, description: service.long, slug: service.slug },
  );
  const sdFaqLd = faqLd(service.faq);
  const sdBcLd = breadcrumbLd(breadcrumbs);

  return (
    <>
      <JsonLd data={[sdLd, sdFaqLd, sdBcLd]} />

      {/* ── SERVICE HERO ── */}
      <Section surface="surface-dark" id="service-hero">
        <Container>
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="mb-8" />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — h1 + description + CTAs */}
            <div>
              <Reveal delay={60}>
                <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent mb-3">
                  Professional Mobile Service · Northern NJ
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h1
                  className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.07 }}
                >
                  {service.name}
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="text-fg-soft text-lg leading-relaxed mb-6">
                  {service.long}
                </p>
              </Reveal>

              {/* Treatment Log on detail page */}
              <Reveal delay={220}>
                <div className="mb-6">
                  <TreatmentLog
                    code={logProps.code}
                    title={logProps.title}
                    stage={logProps.stage}
                    est={logProps.est}
                    status={logProps.status}
                  />
                </div>
              </Reveal>

              <Reveal delay={260}>
                <div className="flex flex-wrap gap-4">
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
            <Reveal delay={200}>
              <div className="relative rounded-lg overflow-hidden border border-border">
                {/* Red glow behind image */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(232,5,5,0.12) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <Image
                  src={service.image}
                  alt={`${service.name} — Daniells Auto Care mobile service in Northern New Jersey`}
                  width={800}
                  height={600}
                  className="relative z-10 w-full h-auto object-cover"
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
              title={`${service.name} Package`}
              subtitle="Every service includes our commitment to quality, meticulous attention to detail, and 100% satisfaction guarantee."
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.benefits.map((benefit, i) => (
                <Reveal key={i} delay={i * 50}>
                  <GlowCard>
                    <div className="p-6 flex items-start gap-4">
                      {/* Red bullet */}
                      <span
                        className="flex-shrink-0 mt-1 w-2 h-2 rounded-full"
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

      {/* ── PROCESS ── surface */}
      {service.process.length > 0 && (
        <Section surface="surface" id="service-process">
          <Container>
            <SectionHeading
              kicker="Our Process"
              title={`How We Deliver ${service.name}`}
              subtitle="A proven, step-by-step approach for consistent, showroom-quality results every time."
              align="left"
            />
            <div className="max-w-4xl space-y-6">
              {service.process.map((step, i) => (
                <Reveal key={i} delay={i * 80}>
                  <GlowCard>
                    <div className="p-6 md:p-8 flex gap-6">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-fg text-sm"
                        style={{ background: 'var(--accent)' }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-base mb-2">
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
      {service.faq.length > 0 && (
        <Section surface="surface-dark" id="service-faq">
          <Container>
            <SectionHeading
              kicker="FAQ"
              title={`${service.name} Questions`}
              subtitle="Answers to common questions about this service."
            />
            <div className="max-w-3xl mx-auto space-y-4">
              {service.faq.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <details className="rounded-lg border border-border bg-surface overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-sans font-bold text-fg text-sm uppercase tracking-[0.02em] hover:text-accent transition-colors duration-fast ease-default min-h-[44px]">
                      <span>{item.q}</span>
                      <span
                        className="flex-shrink-0 text-accent text-xl leading-none"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-5 text-fg-soft text-sm leading-relaxed border-t border-border pt-4">
                      {item.a}
                    </div>
                  </details>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {relatedServices.map((rs, i) => (
                <Reveal key={rs.slug} delay={i * 80}>
                  <ServiceCard service={rs} />
                </Reveal>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
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
            className="rounded-lg px-8 py-14 text-center"
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
                Ready to Book {service.name}?
              </h2>
              <p
                className="text-lg mb-8 max-w-lg mx-auto"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                Free quote in {business.responseTime}. We come to you anywhere
                in Northern NJ — no shop visit required.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <QuoteButton
                  size="xl"
                  className="bg-fg text-accent hover:bg-fg/90 border-transparent"
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

      {/* ── SERVICE AREAS INTERNAL LINKS ── */}
      <Section surface="bg" id="service-areas-links">
        <Container>
          <p className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-accent mb-4">
            Available In
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Franklin Lakes',
              'Ridgewood',
              'Tenafly',
              'Englewood Cliffs',
              'Chatham',
              'Madison',
              'Mountain Lakes',
              'Basking Ridge',
              'Bernardsville',
              'Florham Park',
            ].map((area) => {
              const aSlug = area.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link
                  key={area}
                  href={`/service-areas/${aSlug}`}
                  className="rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.06em] text-fg-soft hover:border-accent hover:text-accent transition-all duration-fast ease-default min-h-[44px] flex items-center"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={`area_${aSlug}`}
                  data-track-context="internal"
                >
                  {area}
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
