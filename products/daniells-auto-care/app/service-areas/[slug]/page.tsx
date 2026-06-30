import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';
import { ServiceCard } from '@/components/service-card';
import { ReviewCard } from '@/components/review-card';
import { QuoteCTA } from '@/components/quote-cta';
import { BUSINESS, SERVICES, AREAS, REVIEWS, IMAGES, SITE } from '@/lib/site';
import { Phone } from 'lucide-react';

// ── Slug helpers ────────────────────────────────────────────────────────
const slugify = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, '-');


// Area name from slug, checking against canonical AREAS list (handles
// Tenafly → Tenafly, Englewood Cliffs → Englewood Cliffs, etc.)
function areaFromSlug(slug: string): string | null {
  return AREAS.find((a) => slugify(a) === slug) ?? null;
}

// ── Localized intro ─────────────────────────────────────────────────────
function areaIntro(area: string): string {
  return (
    `${area}, NJ drivers trust Daniells Auto Care for professional mobile auto detailing ` +
    `delivered right to their driveway or workplace. Our factory-trained technicians arrive ` +
    `in a fully equipped mobile unit — no need for water, power, or a shop visit. From a ` +
    `quick interior refresh to a full ceramic coating with a multi-year warranty, every job ` +
    `is backed by our 100% satisfaction guarantee. Same-day service is available across ` +
    `${BUSINESS.serviceArea}, and we respond to every quote request within 15 minutes.`
  );
}

// ── generateStaticParams ────────────────────────────────────────────────
export function generateStaticParams(): { slug: string }[] {
  return AREAS.map((area) => ({ slug: slugify(area) }));
}

// ── generateMetadata ────────────────────────────────────────────────────
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const area = areaFromSlug(params.slug);
  if (!area) return {};

  const title = `Mobile Auto Detailing in ${area}, NJ | ${BUSINESS.name}`;
  const description = `Professional mobile auto detailing in ${area}, NJ. Same-day service, 100% satisfaction guaranteed. Ceramic coating, paint correction, window tinting & more. Get a free quote in 15 minutes.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.url}/service-areas/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/service-areas/${params.slug}`,
      siteName: BUSINESS.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: IMAGES.hero,
          width: 1200,
          height: 800,
          alt: `Auto detailing in ${area}, NJ`,
        },
      ],
    },
  };
}

// ── Page component ──────────────────────────────────────────────────────
export default function AreaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const area = areaFromSlug(params.slug);
  if (!area) notFound();

  const town = area as string;
  const intro = areaIntro(town);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    telephone: BUSINESS.phone,
    url: `${SITE.url}/service-areas/${params.slug}`,
    image: IMAGES.hero,
    description: `Professional mobile auto detailing in ${area}, NJ. Same-day service, 100% satisfaction guaranteed.`,
    areaServed: {
      '@type': 'City',
      name: area,
      sameAs: `https://en.wikipedia.org/wiki/${area.replace(/\s+/g, '_')},_New_Jersey`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: area,
      addressRegion: 'NJ',
      addressCountry: 'US',
    },
    priceRange: '$$',
    openingHours: 'Mo-Su 00:00-23:59',
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <div className="relative min-h-[80vh] flex items-center overflow-hidden">
        <Image
          src={IMAGES.hero}
          alt={`Auto detailing in ${town}, NJ`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        <Container className="relative z-10 py-12">
          <GlassCard className="p-8 md:p-12 max-w-2xl">
            <Reveal>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#E80505] mb-4">
                Mobile Auto Detailing in {town}, NJ
              </h1>
              <p className="text-lg text-dac-muted mb-8">{intro}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" href="/contact">
                  Get Free Quote
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href={BUSINESS.phoneHref}
                >
                  <Phone className="w-4 h-4" />
                  Call {BUSINESS.phone}
                </Button>
              </div>
            </Reveal>
          </GlassCard>
        </Container>
      </div>

      {/* ── 2. Services available locally ────────────────────────────── */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Our Services"
            title={`Services We Offer in ${town}`}
            subtitle="Complete auto detailing, ceramic coating, paint correction, window tinting and more — all available with same-day mobile service."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. Reviews ───────────────────────────────────────────────── */}
      <Section className="bg-black/40">
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Customers Say"
            subtitle="Real reviews from drivers across Northern New Jersey."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <ReviewCard key={i} review={review} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 4. Quote CTA ─────────────────────────────────────────────── */}
      <QuoteCTA
        headline="Ready for a Showroom Finish?"
      />
    </>
  );
}
