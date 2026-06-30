import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { SERVICES, IMAGES, type Service } from '@/lib/site';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { ServiceCard } from '@/components/service-card';
import { QuoteCTA } from '@/components/quote-cta';
import { Icon } from '@/components/ui/icon';

// ── Benefit definitions per service ──
const BENEFITS: Record<string, { text: string; icon: string }[]> = {
  'car-detailing': [
    { text: 'Full interior vacuum, shampoo, and steam extraction', icon: 'Sparkles' },
    { text: 'Exterior hand wash, clay bar decontamination, and wax', icon: 'Shield' },
    { text: 'Wheel, tire, and wheel well deep cleaning', icon: 'CheckCircle' },
    { text: 'Leather conditioning and UV protectant application', icon: 'Award' },
    { text: 'Window, trim, and interior dressing', icon: 'Zap' },
    { text: '100% Satisfaction Guarantee', icon: 'ShieldCheck' },
  ],
  'exterior-detailing': [
    { text: 'pH-neutral hand wash with two-bucket method', icon: 'Sparkles' },
    { text: 'Clay bar decontamination to remove bonded fallout', icon: 'CheckCircle' },
    { text: 'Single- or multi-stage paint polish for gloss restoration', icon: 'Wand2' },
    { text: 'High-grade sealant or ceramic wax protection', icon: 'Shield' },
    { text: 'Wheel, tire, and trim detailing with dressing', icon: 'Award' },
    { text: '100% Satisfaction Guarantee', icon: 'ShieldCheck' },
  ],
  'interior-detailing': [
    { text: 'Deep vacuum including seats, carpets, mats, and trunk', icon: 'Sparkles' },
    { text: 'Hot-water steam extraction for carpets and upholstery', icon: 'Zap' },
    { text: 'Leather cleaning and conditioning with pH-balanced products', icon: 'Award' },
    { text: 'All surfaces sanitized including door panels, dash, and console', icon: 'ShieldCheck' },
    { text: 'Glass and mirror streak-free cleaning', icon: 'CheckCircle' },
    { text: '100% Satisfaction Guarantee', icon: 'Shield' },
  ],
  'ceramic-coating': [
    { text: 'Full paint decontamination and surface preparation', icon: 'CheckCircle' },
    { text: 'Single-stage polish to enhance gloss before coating', icon: 'Wand2' },
    { text: 'Multi-layer ceramic application with UV-cure', icon: 'Layers' },
    { text: 'Hydrophobic surface that repels water, dirt, and contaminants', icon: 'Shield' },
    { text: '2–10 year warranty backed by manufacturer', icon: 'Award' },
    { text: '100% Satisfaction Guarantee', icon: 'ShieldCheck' },
  ],
  'paint-correction': [
    { text: 'Full paint inspection with depth gauge and lighting', icon: 'CheckCircle' },
    { text: 'Multi-stage machine compounding to remove deep defects', icon: 'Wand2' },
    { text: 'Finishing polish for a flawless, mirror-like gloss', icon: 'Sparkles' },
    { text: 'IPA wipe-down to reveal true correction results', icon: 'Zap' },
    { text: 'Sealant or ceramic protection applied after correction', icon: 'Shield' },
    { text: '100% Satisfaction Guarantee', icon: 'ShieldCheck' },
  ],
  'paint-protection-film': [
    { text: 'Paint inspection and surface preparation', icon: 'CheckCircle' },
    { text: 'Computer-cut or custom-cut PPF patterns for precision fit', icon: 'Layers' },
    { text: 'Self-healing film that repairs minor scratches with heat', icon: 'Wand2' },
    { text: 'Guards high-impact areas: hood, bumper, mirrors, fenders', icon: 'Shield' },
    { text: 'Virtually invisible — maintains factory appearance', icon: 'Sparkles' },
    { text: '100% Satisfaction Guarantee', icon: 'ShieldCheck' },
  ],
  'window-tinting': [
    { text: 'Premium ceramic or carbon window film with lifetime warranty', icon: 'Layers' },
    { text: '99% UV rejection to protect interior and occupants', icon: 'Shield' },
    { text: 'Significant heat rejection for cooler cabin temperatures', icon: 'SunDim' },
    { text: 'Enhanced privacy and glare reduction', icon: 'CheckCircle' },
    { text: 'Computer-cut patterns for flawless, gap-free edges', icon: 'Sparkles' },
    { text: '100% Satisfaction Guarantee', icon: 'ShieldCheck' },
  ],
  'fleet-detailing': [
    { text: 'Dedicated account manager for seamless coordination', icon: 'Award' },
    { text: 'On-site mobile service — we come to your lot or facility', icon: 'Truck' },
    { text: 'Volume pricing with transparent per-vehicle quoting', icon: 'CheckCircle' },
    { text: 'Consistent quality across every vehicle in your fleet', icon: 'ShieldCheck' },
    { text: 'Flexible scheduling to minimize business disruption', icon: 'Clock' },
    { text: '100% Satisfaction Guarantee', icon: 'Shield' },
  ],
};

// ── Why it matters content per service ──
const WHY_CONTENT: Record<string, string> = {
  'car-detailing':
    'A professionally detailed car isn\'t just about looks — it preserves your vehicle\'s value, protects against environmental damage, and makes every drive feel new again. Regular detailing extends the life of your paint, leather, and interior materials, saving you money on repairs and depreciation over time.',
  'exterior-detailing':
    'Your paint is under constant assault from UV rays, road salt, bird droppings, and industrial fallout. Professional exterior detailing removes these contaminants before they etch into your clear coat, while premium sealants create a barrier that sheds water and dirt for months.',
  'interior-detailing':
    'You spend hundreds of hours a year inside your vehicle — the cabin should feel clean, fresh, and healthy. Deep cleaning removes embedded allergens, bacteria, and odors that household vacuums leave behind, while conditioning protects leather and plastics from cracking and fading.',
  'ceramic-coating':
    'Ceramic coating bonds to your paint at a molecular level, creating a semi-permanent shell that resists chemicals, UV, heat, and minor scratches. It dramatically reduces maintenance — washes become faster, water spots are minimized, and your paint stays glossier for years.',
  'paint-correction':
    'Swirls, holograms, and fine scratches scatter light and dull your finish — even on a clean car. Paint correction removes these defects permanently, restoring the depth and mirror-like reflection your paint had from the factory. No filler glazes, no temporary cover-ups: real, lasting results.',
  'paint-protection-film':
    'A single rock chip can penetrate clear coat and expose bare metal, leading to rust and costly repairs. PPF absorbs that impact, self-heals light scratches, and preserves your factory paint — all while being nearly undetectable. It\'s the ultimate investment in long-term protection.',
  'window-tinting':
    'Quality window tint is about more than privacy — it blocks 99% of UV rays that cause skin damage and interior fading, rejects solar heat to keep your cabin comfortable, and reduces dangerous glare. With a lifetime warranty, it pays for itself in comfort and protection.',
  'fleet-detailing':
    'Your fleet represents your brand on every road and jobsite. Clean, well-maintained vehicles project professionalism, boost driver morale, and protect your asset value. Our mobile fleet program handles the logistics so you can focus on running your business.',
};

// ── Helpers ──
function getRelatedServices(currentSlug: string): Service[] {
  return SERVICES.filter((s) => s.slug !== currentSlug);
}

// ═══════════════════════════════════════════
//  STATIC GENERATION
// ═══════════════════════════════════════════
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: `${service.name} | Daniells Auto Care`,
    description: service.short,
  };
}

// ═══════════════════════════════════════════
//  PAGE COMPONENT
// ═══════════════════════════════════════════
export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const benefits = BENEFITS[service.slug] ?? [];
  const whyContent = WHY_CONTENT[service.slug] ?? '';
  const relatedServices = getRelatedServices(service.slug);
  const serviceImage = IMAGES.services[service.slug as keyof typeof IMAGES.services];

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.short,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Daniells Auto Care',
      telephone: '(973) 916-7868',
      areaServed: 'Northern New Jersey',
    },
    serviceType: 'Auto Detailing',
    areaServed: {
      '@type': 'City',
      name: 'Northern New Jersey',
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. Hero ── */}
      <Section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <Reveal>
              <div>
                <p className="text-sm font-medium text-dac-red uppercase tracking-wider mb-4 font-heading">
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
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  className="min-h-[44px]"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Reveal>

            {/* Image in GlassCard with red glow */}
            <Reveal direction="left" delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-dac-red/10 blur-3xl rounded-3xl" />
                <GlassCard glow className="overflow-hidden p-0">
                  {serviceImage && (
                    <Image
                      src={serviceImage}
                      alt={service.name}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                </GlassCard>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── 2. What's Included ── */}
      <Section className="py-16 md:py-20 bg-dac-black/50">
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
                  <Icon name={benefit.icon} className="h-6 w-6 text-dac-red flex-shrink-0 mt-0.5" />
                  <p className="text-white font-medium">{benefit.text}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. Why It Matters ── */}
      <Section className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="Why It Matters"
                title={`Why ${service.name} is Worth It`}
                centered
              />
              <p className="text-dac-muted text-lg leading-relaxed">
                {whyContent}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── 4. Related Services ── */}
      <Section className="py-16 md:py-20 bg-dac-black/50">
        <Container>
          <SectionHeading
            eyebrow="Explore More"
            title="Related Services"
            subtitle="Complete your vehicle care with these complementary services."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((relatedService, index) => (
              <ServiceCard
                key={relatedService.slug}
                service={relatedService}
                index={index}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 5. Quote CTA ── */}
      <QuoteCTA />
    </>
  );
}
