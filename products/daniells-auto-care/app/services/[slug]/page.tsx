import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { ServiceCard } from '@/components/service-card';
import { QuoteCTA } from '@/components/quote-cta';

// Generate static params for all services
export function generateStaticParams() {
  return site.services.map((service) => ({
    slug: service.slug,
  }));
}

// Generate metadata for each service page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = site.services.find((s) => s.slug === params.slug);
  if (!service) return {};

  return {
    title: `${service.name} in Northern NJ | ${site.business.name}`,
    description: service.metaDescription || service.short,
    openGraph: {
      title: `${service.name} in Northern NJ | ${site.business.name}`,
      description: service.metaDescription || service.short,
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = site.services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const benefits = service.benefits || [];
  const process = service.process || [];
  const faq = service.faq || [];

  // Get related services (excluding current, up to 3)
  const relatedServices = site.services
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  // Build intro paragraph: long description + 2-3 sentences about Northern NJ and mobile
  const introParagraph = `${service.long} At Daniells Auto Care, we bring professional ${service.name.toLowerCase()} to Northern New Jersey with our fully equipped mobile detailing service. Whether you're in Franklin Lakes, Ridgewood, or anywhere in our service area, our factory-trained technicians come to your home or office, delivering showroom-quality results without disrupting your day.`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.metaDescription || service.short,
    provider: {
      '@type': 'LocalBusiness',
      name: site.business.name,
      telephone: site.business.phone,
      areaServed: 'Northern New Jersey',
    },
    areaServed: 'Northern New Jersey',
    ...(faq.length > 0 && {
      hasFAQPage: {
        '@type': 'FAQPage',
        mainEntity: faq.map((item: { q: string; a: string }) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    }),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <Section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <Reveal>
              <div>
                <p className="text-sm font-medium text-dac-red uppercase tracking-wider mb-4">
                  Our Services
                </p>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-white via-white to-dac-red bg-clip-text text-transparent">
                    {service.name}
                  </span>
                </h1>
                <p className="text-lg text-dac-muted leading-relaxed mb-8">
                  {service.long}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    href="/contact"
                    variant="primary"
                    size="lg"
                    className="min-h-[44px]"
                  >
                    Get Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    href={site.business.phoneHref}
                    variant="secondary"
                    size="lg"
                    className="min-h-[44px]"
                  >
                    {site.business.phone}
                  </Button>
                </div>
              </div>
            </Reveal>

            {/* Image */}
            <Reveal direction="left" delay={0.2}>
              <div className="relative">
                {/* Red glow behind image */}
                <div className="absolute inset-0 bg-dac-red/10 blur-3xl rounded-3xl" />
                <GlassCard className="overflow-hidden p-0 relative">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </GlassCard>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Intro / Overview Section */}
      <Section className="py-16 md:py-20 bg-dac-black/50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Professional {service.name} in Northern NJ
              </h2>
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-dac-muted leading-relaxed">
                  {introParagraph}
                </p>
                <p className="text-dac-muted leading-relaxed mt-4">
                  Ready to experience the difference?{' '}
                  <a href="/contact" className="text-dac-red hover:underline font-medium">
                    Contact us today
                  </a>{' '}
                  for a free, no-obligation quote, or explore our{' '}
                  {relatedServices.length > 0 && (
                    <>
                      other services like{' '}
                      {relatedServices.slice(0, 2).map((rs, i) => (
                        <span key={rs.slug}>
                          <a href={`/services/${rs.slug}`} className="text-dac-red hover:underline font-medium">
                            {rs.name.toLowerCase()}
                          </a>
                          {i < relatedServices.slice(0, 2).length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      .
                    </>
                  )}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* What's Included / Benefits Section */}
      {benefits.length > 0 && (
        <Section className="py-16 md:py-20">
          <Container>
            <SectionHeading
              eyebrow="What's Included"
              title={`${service.name} Package`}
              subtitle="Every service includes our commitment to quality, attention to detail, and 100% satisfaction guarantee."
            />
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit: string, index: number) => (
                <Reveal key={index} delay={index * 0.05}>
                  <GlassCard className="p-6 flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-dac-red flex-shrink-0 mt-0.5" />
                    <p className="text-white font-medium">{benefit}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Our Process Section */}
      {process.length > 0 && (
        <Section className="py-16 md:py-20 bg-dac-black/50">
          <Container>
            <SectionHeading
              eyebrow="Our Process"
              title={`How We Deliver ${service.name}`}
              subtitle="A proven, step-by-step approach for consistent, showroom-quality results."
            />
            <div className="mt-12 max-w-4xl mx-auto space-y-8">
              {process.map((step: { title: string; desc: string }, index: number) => (
                <Reveal key={index} delay={index * 0.1}>
                  <GlassCard className="p-6 md:p-8 flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dac-red/20 flex items-center justify-center text-dac-red font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-dac-muted leading-relaxed">{step.desc}</p>
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* FAQ Section */}
      {faq.length > 0 && (
        <Section className="py-16 md:py-20">
          <Container>
            <SectionHeading
              eyebrow="FAQ"
              title={`${service.name} Questions`}
              subtitle="Answers to common questions about our service."
              centered
            />
            <div className="mt-12 max-w-3xl mx-auto space-y-6">
              {faq.map((item: { q: string; a: string }, index: number) => (
                <Reveal key={index} delay={index * 0.05}>
                  <GlassCard className="p-6 md:p-8">
                    <h3 className="text-lg font-semibold text-white mb-3">{item.q}</h3>
                    <p className="text-dac-muted leading-relaxed">{item.a}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Related Services Section */}
      {relatedServices.length > 0 && (
        <Section className="py-16 md:py-20 bg-dac-black/50">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Explore More"
                title="Related Services"
                subtitle="Complete your vehicle care with these complementary services."
              />
            </Reveal>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((relatedService, index) => (
                <Reveal key={relatedService.slug} delay={index * 0.1}>
                  <ServiceCard service={relatedService} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Quote CTA Section */}
      <QuoteCTA />
    </>
  );
}
