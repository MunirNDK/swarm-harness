import type { Metadata } from 'next';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { beforeAfter, business } from '@/lib/site';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { Button } from '@/components/ui/button';
import { BeforeAfterGrid } from '@/components/before-after';
import { QuoteButton } from '@/components/quote-modal';

const BREADCRUMBS = [
  { label: 'Home',    href: '/' },
  { label: 'Gallery', href: '/gallery' },
];

export const metadata: Metadata = pageMeta({
  title:       'Before & After Gallery — Real Detailing Results',
  description:
    'See real before-and-after transformations from our mobile auto detailing, mold removal, trim restoration, and vinyl wrap prep services across Northern New Jersey.',
  path: '/gallery',
});

/** Unique category tags from the beforeAfter data */
const CATEGORIES = [...new Set(beforeAfter.map((item) => item.tag))];

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(BREADCRUMBS)} />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-bolt">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Heading + Category Context ── */}
      <Section surface="bg" id="gallery-header">
        <Container>
          <Reveal>
            <div className="text-center mb-stall">
              <p className="mb-bolt font-mono text-mono-sm tracking-label uppercase text-accent">
                Our Work
              </p>
              <h1
                className="text-3xl"
              >
                Before &amp; After Gallery
              </h1>
              <p className="mt-gauge text-md text-fg-soft leading-relaxed max-w-container-sm mx-auto">
                Real transformations from real vehicles across Northern New Jersey. Drag the slider
                on any comparison to reveal the difference.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-wrap justify-center gap-rivet">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="font-mono text-mono-sm tracking-label uppercase text-accent bg-accent-soft border border-accent-soft rounded-full px-bolt py-pin"
                >
                  {cat}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Before/After Grid ── (data-track attrs emitted by each BeforeAfter item) */}
      <Section surface="surface" id="gallery-grid">
        <Container>
          <BeforeAfterGrid items={beforeAfter} />
        </Container>
      </Section>

      {/* ── CTA Band ── */}
      <Section surface="surface-dark-2" id="gallery-cta">
        <Container>
          <Reveal>
            <div
              className="rounded-lg p-bay md:p-stall text-center bg-cta-gradient"
            >
              <h2
                className="text-cta-fg mb-bolt text-2xl"
              >
                Ready for Your Own Transformation?
              </h2>
              <p className="text-cta-fg/80 mb-panel max-w-xl mx-auto leading-relaxed">
                Every result above started with a free quote. We come to you, anywhere in{' '}
                {business.serviceArea}.
              </p>
              <div className="flex flex-wrap justify-center gap-gauge">
                <QuoteButton
                  size="lg"
                  track={{
                    category: 'conversion',
                    action:   'button_click',
                    label:    'gallery_cta_get_quote',
                  }}
                />
                <Button
                  href={business.phoneHref}
                  variant="outline"
                  size="lg"
                  className="border-cta-fg/30 text-cta-fg hover:border-cta-fg hover:text-cta-fg"
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
