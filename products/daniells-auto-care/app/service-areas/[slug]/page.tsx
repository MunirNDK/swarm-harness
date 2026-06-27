import { notFound } from 'next/navigation';
import Image from 'next/image';
import { site } from '@/lib/site';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ServiceCard } from '@/components/service-card';
import { ReviewCard } from '@/components/review-card';
import { QuoteCTA } from '@/components/quote-cta';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&h=800&fit=crop&crop=edges';

export function generateStaticParams() {
  return site.areas.map((area) => ({
    slug: area.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function AreaDetailPage({ params }: { params: { slug: string } }) {
  const area = site.areas.find(
    (a) => a.toLowerCase().replace(/\s+/g, '-') === params.slug
  );
  if (!area) notFound();

  const town = area;

  return (
    <main>
      {/* Hero */}
      <div className="relative min-h-[80vh] flex items-center overflow-hidden">
        <Image
          src={HERO_IMAGE_URL}
          alt={`Auto detailing in ${town}, NJ`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dac.ink via-dac.ink/80 to-dac.ink/40" />
        <Container className="relative z-10 py-12">
          <GlassCard className="p-8 md:p-12 max-w-2xl">
            <Reveal>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-dac.red mb-4">
                Mobile Auto Detailing in {town}, NJ
              </h1>
              <p className="text-lg text-dac.muted mb-8">
                Professional same-day auto detailing available in {town}. 100% satisfaction guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" href="/contact">
                  Get Free Quote
                </Button>
                <Button variant="secondary" size="lg" href="tel:+19739167868">
                  Call (973) 916-7868
                </Button>
              </div>
            </Reveal>
          </GlassCard>
        </Container>
      </div>

      {/* Services */}
      <Section>
        <SectionHeading
          eyebrow="Our Services"
          title={`Detailing Services in ${town}`}
          subtitle="Complete auto detailing, ceramic coating, paint correction, window tinting and more — all available in your area."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {site.services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.1}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <Section>
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Customers Say"
          subtitle="Real reviews from drivers in Northern New Jersey."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {site.reviews.map((review, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Quote CTA */}
      <Section>
        <QuoteCTA />
      </Section>
    </main>
  );
}
