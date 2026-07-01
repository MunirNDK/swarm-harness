import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Clock, MapPin, Timer } from 'lucide-react';
import { pageMeta, localBusinessLd, breadcrumbLd } from '@/lib/seo';
import { business, areas } from '@/lib/site';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact-form';

const BREADCRUMBS = [
  { label: 'Home',    href: '/' },
  { label: 'Contact', href: '/contact' },
];

export const metadata: Metadata = pageMeta({
  title:       'Contact Us — Free Quote in 15 Min',
  description:
    'Contact Daniells Auto Care for mobile auto detailing in Northern NJ. Get a free quote within 15 minutes. Call (973) 916-7868 or fill out our contact form.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[localBusinessLd(), breadcrumbLd(BREADCRUMBS)]} />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-3">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Page Header ── */}
      <Section surface="bg" id="contact-header">
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <p className="mb-3 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent">
                Get in Touch
              </p>
              <h1
                className="font-sans font-bold uppercase tracking-[-0.02em] text-fg"
                style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: '1.05' }}
              >
                Contact Daniells Auto Care
              </h1>
              <p className="mt-4 text-fg-soft leading-relaxed">
                Fill out the form and we&apos;ll respond within {business.responseTime} — no
                obligation. Or call us directly if you prefer to speak right away.
              </p>
              <div className="mt-6">
                <Button
                  href={business.phoneHref}
                  variant="phone"
                  size="lg"
                  track={{ category: 'conversion', action: 'link_click', label: 'phone_call' }}
                >
                  <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                  {business.phone}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Two-column: ContactForm + Business Info ── */}
      <Section surface="surface" id="contact-form">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-bay">

            {/* ── Contact Form ── */}
            <div className="lg:col-span-3">
              <Reveal>
                <GlowCard className="p-6 md:p-8">
                  <h2
                    className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-1"
                    style={{ fontSize: 'var(--t-xl)' }}
                  >
                    Send a Message
                  </h2>
                  <p className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint mb-6">
                    SVC-CONTACT // MOBILE DISPATCH
                  </p>
                  <ContactForm />
                </GlowCard>
              </Reveal>
            </div>

            {/* ── Business Info ── */}
            <div className="lg:col-span-2 flex flex-col gap-bolt">
              <Reveal delay={80}>
                <GlowCard className="p-6">
                  <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-4 text-base">
                    Contact Info
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Phone
                        className="w-4 h-4 text-accent mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint mb-0.5">
                          Phone
                        </p>
                        <a
                          href={business.phoneHref}
                          className="text-fg font-medium hover:text-accent transition-colors duration-fast"
                          data-track-category="conversion"
                          data-track-action="link_click"
                          data-track-label="phone_call"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock
                        className="w-4 h-4 text-accent mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint mb-0.5">
                          Hours
                        </p>
                        <p className="text-fg">{business.hours}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin
                        className="w-4 h-4 text-accent mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint mb-0.5">
                          Service Area
                        </p>
                        <p className="text-fg">{business.serviceArea}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Timer
                        className="w-4 h-4 text-accent mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint mb-0.5">
                          Quote Response
                        </p>
                        <p className="text-fg">{business.responseTime}</p>
                      </div>
                    </li>
                  </ul>
                </GlowCard>
              </Reveal>

              {/* ── Service Area Pills — linked to /service-areas/<slug> ── */}
              <Reveal delay={120}>
                <GlowCard className="p-6">
                  <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-4 text-base">
                    Areas We Serve
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {areas.map((area) => {
                      const slug = area.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link
                          key={area}
                          href={`/service-areas/${slug}`}
                          className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-soft bg-surface2 border border-border rounded-full px-3 py-1 hover:border-accent hover:text-accent transition-colors duration-fast min-h-[44px] flex items-center"
                          data-track-category="navigation"
                          data-track-action="link_click"
                          data-track-label={slug}
                          data-track-context="internal"
                        >
                          {area}
                        </Link>
                      );
                    })}
                  </div>
                </GlowCard>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
