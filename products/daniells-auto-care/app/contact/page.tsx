import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Clock, MapPin, Timer } from 'lucide-react';
import { pageMeta, localBusinessLd, breadcrumbLd } from '@/lib/seo';
import { business } from '@/lib/site';
import { getServiceAreas } from '@/lib/wordpress/service-areas';
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
  title:       'Contact Us — Free Quote Quickly',
  description:
    'Contact Daniells Auto Care for mobile auto detailing in Northern NJ. Get a free quote quickly. Call (973) 916-7868 or fill out our contact form.',
  path: '/contact',
});

export default async function ContactPage() {
  const areas = await getServiceAreas();

  return (
    <>
      <JsonLd data={[localBusinessLd(), breadcrumbLd(BREADCRUMBS)]} />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-bolt">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Page Header ── */}
      <Section surface="bg" id="contact-header">
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <p className="mb-bolt font-mono text-mono-sm tracking-label uppercase text-accent">
                Get in Touch
              </p>
              <h1
                className="tracking-tighter text-3xl"
              >
                Contact Daniells Auto Care
              </h1>
              <p className="mt-gauge text-fg-soft leading-relaxed">
                Fill out the form and we&apos;ll respond quickly — no
                obligation. Or call us directly if you prefer to speak right away.
              </p>
              <div className="mt-panel">
                <Button
                  href={business.phoneHref}
                  variant="phone"
                  size="lg"
                  track={{ category: 'conversion', action: 'link_click', label: 'phone_call' }}
                >
                  <Phone className="w-4 h-4 mr-rivet" aria-hidden="true" />
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
                <GlowCard className="p-panel md:p-bay">
                  <h2 className="mb-pin text-xl">Send a Message</h2>
                  <p className="font-mono text-mono-sm tracking-label uppercase text-fg-faint mb-panel">
                    SVC-CONTACT // MOBILE DISPATCH
                  </p>
                  <ContactForm />
                </GlowCard>
              </Reveal>
            </div>

            {/* ── Business Info ── */}
            <div className="lg:col-span-2 flex flex-col gap-bolt">
              <Reveal delay={80}>
                <GlowCard className="p-panel">
                  <h2 className="mb-gauge text-xl">
                    Contact Info
                  </h2>
                  <ul className="space-y-gauge">
                    <li className="flex items-start gap-bolt">
                      <Phone
                        className="w-4 h-4 text-accent mt-pin flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-mono-sm tracking-label uppercase text-fg-faint mb-pin">
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
                    <li className="flex items-start gap-bolt">
                      <Clock
                        className="w-4 h-4 text-accent mt-pin flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-mono-sm tracking-label uppercase text-fg-faint mb-pin">
                          Hours
                        </p>
                        <p className="text-fg">{business.hours}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-bolt">
                      <MapPin
                        className="w-4 h-4 text-accent mt-pin flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-mono-sm tracking-label uppercase text-fg-faint mb-pin">
                          Service Area
                        </p>
                        <p className="text-fg">{business.serviceArea}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-bolt">
                      <Timer
                        className="w-4 h-4 text-accent mt-pin flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-mono text-mono-sm tracking-label uppercase text-fg-faint mb-pin">
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
                <GlowCard className="p-panel">
                  <h2 className="mb-gauge text-xl">
                    Areas We Serve
                  </h2>
                  <div className="flex flex-wrap gap-rivet">
                    {areas.map((area) => (
                      <Link
                        key={area.slug}
                        href={`/service-areas/${area.slug}`}
                        className="font-mono text-mono-sm tracking-label uppercase text-fg-soft bg-surface2 border border-border rounded-full px-bolt py-pin hover:border-accent hover:text-accent transition-colors duration-fast min-h-touch flex items-center"
                        data-track-category="navigation"
                        data-track-action="link_click"
                        data-track-label={area.slug}
                        data-track-context="internal"
                      >
                        {area.name}
                      </Link>
                    ))}
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
