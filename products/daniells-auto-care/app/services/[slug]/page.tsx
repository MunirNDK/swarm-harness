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
    title: `${service.name} | ${site.business.name}`,
    description: service.short,
    openGraph: {
      title: `${service.name} | ${site.business.name}`,
      description: service.short,
    },
  };
}

// Image mapping for services (dark-toned Unsplash photos)
const serviceImages: Record<string, { src: string; width: number; height: number; alt: string }> = {
  'car-detailing': {
    src: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Professional car detailing in progress',
  },
  'exterior-detailing': {
    src: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Exterior car detailing and paint restoration',
  },
  'interior-detailing': {
    src: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Interior car detailing and deep cleaning',
  },
  'ceramic-coating': {
    src: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58792?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Ceramic coating application on luxury car',
  },
  'paint-correction': {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Paint correction and polishing process',
  },
  'paint-protection-film': {
    src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Paint protection film installation',
  },
  'window-tinting': {
    src: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Professional window tinting service',
  },
  'fleet-detailing': {
    src: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Fleet detailing for business vehicles',
  },
};

// Benefits list per service
const serviceBenefits: Record<string, string[]> = {
  'car-detailing': [
    'Complete interior steam cleaning and shampoo',
    'Exterior hand wash, clay bar, and wax',
    'Leather conditioning and UV protection',
    'Engine bay cleaning and dressing',
    'Same-day service available',
  ],
  'exterior-detailing': [
    'Hand wash with pH-neutral soap',
    'Paint decontamination and clay bar treatment',
    'Machine polishing for gloss restoration',
    'Premium sealant or wax application',
    'Wheel and tire cleaning and dressing',
  ],
  'interior-detailing': [
    'Deep vacuum and crevice cleaning',
    'Steam extraction for carpets and upholstery',
    'Leather cleaning and conditioning',
    'Dashboard and trim UV protection',
    'Odor elimination and sanitization',
  ],
  'ceramic-coating': [
    'Paint decontamination and prep',
    'Single-stage polish for maximum adhesion',
    'Multi-layer ceramic application',
    '2–10 year warranty options',
    'Hydrophobic self-cleaning effect',
  ],
  'paint-correction': [
    'Multi-stage machine polishing',
    'Swirl mark and scratch removal',
    'Oxidation and water spot correction',
    'Gloss enhancement and refinement',
    'Prep for ceramic coating or sealant',
  ],
  'paint-protection-film': [
    'Self-healing polyurethane film',
    'Custom-cut for your vehicle',
    'High-impact area coverage',
    'Invisible finish, no yellowing',
    'Rock chip and scratch protection',
  ],
  'window-tinting': [
    'Premium ceramic or carbon film',
    'UV rejection up to 99%',
    'Heat reduction for cooler cabins',
    'Lifetime warranty on film',
    'Professional computer-cut installation',
  ],
  'fleet-detailing': [
    'On-site mobile service available',
    'Volume pricing and account management',
    'Consistent quality across all vehicles',
    'Flexible scheduling to minimize downtime',
    'Custom detailing packages for your fleet',
  ],
};

// Why it matters per service
const serviceWhyItMatters: Record<string, string> = {
  'car-detailing':
    'A full detail does more than clean your car — it preserves your investment. Regular detailing protects paint, prevents interior wear, and maintains resale value. Our comprehensive approach ensures every surface is cleaned, conditioned, and protected.',
  'exterior-detailing':
    'Your car\'s exterior faces constant assault from UV rays, road debris, and environmental contaminants. Professional exterior detailing removes bonded contaminants, restores gloss, and applies protective layers that shield your paint for months.',
  'interior-detailing':
    'The interior is where you spend your time — it should be clean, fresh, and comfortable. Our deep-cleaning process removes allergens, bacteria, and embedded dirt while conditioning surfaces to prevent cracking and fading.',
  'ceramic-coating':
    'Ceramic coating is the ultimate paint protection. Unlike wax that washes away in weeks, a professional ceramic coating bonds to your paint at the molecular level, providing years of hydrophobic protection, UV resistance, and effortless maintenance.',
  'paint-correction':
    'Swirls, scratches, and oxidation dull your car\'s appearance and reduce its value. Paint correction removes these defects through precise machine polishing, restoring a flawless, mirror-like finish that looks better than factory.',
  'paint-protection-film':
    'Even careful drivers can\'t avoid every rock chip. Paint protection film provides an invisible, self-healing barrier that absorbs impacts and prevents damage to your paint — preserving your car\'s appearance and resale value.',
  'window-tinting':
    'Window tint isn\'t just about looks — it blocks harmful UV rays, reduces interior heat, cuts glare, and adds privacy. Our premium films come with a lifetime warranty and are installed with precision for a flawless finish.',
  'fleet-detailing':
    'Your fleet represents your brand. Clean, well-maintained vehicles project professionalism and attention to detail. Our fleet program delivers consistent, high-quality detailing with minimal disruption to your operations.',
};

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = site.services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const image = serviceImages[service.slug] || serviceImages['car-detailing'];
  const benefits = serviceBenefits[service.slug] || [];
  const whyItMatters = serviceWhyItMatters[service.slug] || '';

  // Get related services (excluding current, up to 3)
  const relatedServices = site.services
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
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
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
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

      {/* What's Included Section */}
      <Section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="What's Included"
            title={`${service.name} Package`}
            subtitle="Every service includes our commitment to quality, attention to detail, and 100% satisfaction guarantee."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
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

      {/* Why It Matters Section */}
      <Section className="py-16 md:py-20 bg-dac-black/50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="Why It Matters"
                title="Protect Your Investment"
                centered
              />
              <div className="mt-8">
                <GlassCard className="p-8 md:p-10">
                  <p className="text-dac-muted text-lg leading-relaxed">
                    {whyItMatters}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button
                      href="/contact"
                      variant="primary"
                      size="lg"
                      className="min-h-[44px]"
                    >
                      Schedule Your Service
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Related Services Section */}
      {relatedServices.length > 0 && (
        <Section className="py-16 md:py-20">
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
