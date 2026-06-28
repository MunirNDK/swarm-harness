import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
import { StarRating } from '@/components/ui/star-rating';
import { CheckCircle, Clock, ShieldCheck, Sparkles, Wrench, MapPin, Phone } from 'lucide-react';

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

// Localized intro copy for each town
function areaIntro(town: string): string {
  const intros: Record<string, string> = {
    'Franklin Lakes':
      'Franklin Lakes is known for its upscale homes and luxury vehicles. Our mobile detailing team brings showroom-quality results directly to your driveway, so you never have to leave the comfort of your neighborhood.',
    Ridgewood:
      'Ridgewood combines classic charm with a busy professional lifestyle. We make it easy to keep your car spotless with same-day mobile detailing that fits your schedule — no waiting, no travel.',
    Tenafly:
      'Tenafly drivers expect meticulous attention to detail. Our factory-trained technicians deliver exactly that, using professional-grade products and techniques that protect your vehicle’s finish for the long haul.',
    'Englewood Cliffs':
      'Englewood Cliffs is just minutes from the city, but our mobile service means you don’t have to fight traffic for a detail. We come to your home or office and deliver a flawless finish on the spot.',
    Chatham:
      'Chatham families and commuters trust us for consistent, high-quality detailing. From daily drivers to weekend classics, we treat every vehicle with the same level of care and precision.',
    Madison:
      'Madison’s tree-lined streets are beautiful, but sap and pollen can take a toll on your paint. Our mobile detailing service removes contaminants safely and applies long-lasting protection — right at your curb.',
    'Mountain Lakes':
      'Mountain Lakes residents value quality and convenience. Our same-day mobile detailing brings a full-service detail shop to your door, with the same premium products and techniques used on high-end vehicles.',
    'Basking Ridge':
      'Basking Ridge is a growing community with busy families and professionals. Our mobile service eliminates the hassle of drop-off appointments, delivering a complete detail while you focus on your day.',
    Bernardsville:
      'Bernardsville’s winding roads and seasonal weather demand a vehicle that looks and performs its best. Our detailing packages include paint decontamination, ceramic coatings, and interior protection built for local conditions.',
    'Florham Park':
      'Florham Park is a hub for business and residential life. We provide corporate fleet detailing and personal vehicle care with the same commitment to quality, speed, and 100% satisfaction.',
  };
  return intros[town] ?? `Professional mobile auto detailing available in ${town}, NJ. Same-day service, 100% satisfaction guaranteed.`;
}

// Why choose us for local pages
const whyChooseUs = [
  {
    title: 'Mobile Convenience',
    desc: 'We come to your home or office — no need to drive to a shop or wait in a lobby.',
    icon: MapPin,
  },
  {
    title: 'Same-Day Service',
    desc: 'Most details are completed the same day you call. We respect your time.',
    icon: Clock,
  },
  {
    title: 'Factory-Trained Technicians',
    desc: 'Every technician is trained on the latest products and techniques, ensuring consistent, high-quality results.',
    icon: Wrench,
  },
  {
    title: '100% Satisfaction Guarantee',
    desc: 'If you’re not completely satisfied, we make it right. No questions asked.',
    icon: ShieldCheck,
  },
];

// Process steps
const processSteps = [
  {
    title: '1. Request a Quote',
    desc: 'Fill out our quick form or call (973) 916-7868. We respond within 15 minutes with a personalized estimate.',
  },
  {
    title: '2. We Arrive at Your Location',
    desc: 'Our mobile unit comes fully equipped with water, power, and professional-grade products — no hookups needed.',
  },
  {
    title: '3. Inspection & Prep',
    desc: 'We assess your vehicle’s condition, discuss your goals, and prep the surface for the best possible results.',
  },
  {
    title: '4. Detail & Protect',
    desc: 'From wash and decontamination to ceramic coating or interior steam cleaning, every step is performed with precision.',
  },
  {
    title: '5. Final Walkthrough',
    desc: 'We review the finished vehicle with you to ensure every detail meets our 100% satisfaction standard.',
  },
];

// Localized FAQs
const faqs = [
  {
    q: 'Do you travel to my area?',
    a: 'Yes! We provide mobile detailing throughout Northern New Jersey, including all towns listed on our service areas page. Our team comes directly to your home or workplace.',
  },
  {
    q: 'How quickly can I get a quote?',
    a: 'We respond to all quote requests within 15 minutes during business hours. Just fill out the form or call (973) 916-7868.',
  },
  {
    q: 'What services are available near me?',
    a: 'Our full catalog — interior and exterior detailing, ceramic coating, paint correction, PPF, and window tinting — is available throughout our service area. We bring everything needed in our mobile unit.',
  },
  {
    q: 'Do I need to provide water or power?',
    a: 'No. Our mobile detailing rigs are fully self-contained with water tanks, generators, and all necessary equipment. We simply need a safe place to park and work.',
  },
  {
    q: 'Is same-day service really available?',
    a: 'In most cases, yes. We prioritize same-day completion for standard detailing packages. Larger jobs like paint correction or ceramic coating may require additional time, which we’ll discuss during your quote.',
  },
  {
    q: 'Are you licensed and insured?',
    a: 'Absolutely. Daniells Auto Care is fully licensed and insured. Our technicians are factory-trained, and we carry comprehensive coverage for your peace of mind.',
  },
];

export function generateStaticParams() {
  return site.areas.map((area) => ({
    slug: slugify(area),
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = site.areas.find((a) => slugify(a) === params.slug);
  if (!area) return {};

  const title = `Mobile Auto Detailing in ${area}, NJ | Daniells Auto Care`;
  const description = `Professional mobile auto detailing in ${area}, NJ. Same-day service, 100% satisfaction guaranteed. Ceramic coating, paint correction, window tinting & more. Get a free quote in 15 minutes.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${site.siteUrl}/service-areas/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${site.siteUrl}/service-areas/${params.slug}`,
      siteName: site.business.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: site.images.hero,
          width: 1200,
          height: 800,
          alt: `Auto detailing in ${area}, NJ`,
        },
      ],
    },
  };
}

export default function AreaDetailPage({ params }: { params: { slug: string } }) {
  const area = site.areas.find((a) => slugify(a) === params.slug);
  if (!area) notFound();

  const town = area;
  const intro = areaIntro(town);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.business.name,
    telephone: site.business.phone,
    url: `${site.siteUrl}/service-areas/${params.slug}`,
    image: site.images.hero,
    description: `Professional mobile auto detailing in ${town}, NJ. Same-day service, 100% satisfaction guaranteed.`,
    areaServed: {
      '@type': 'City',
      name: town,
      sameAs: `https://en.wikipedia.org/wiki/${town.replace(/\s+/g, '_')},_New_Jersey`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: town,
      addressRegion: 'NJ',
      addressCountry: 'US',
    },
    priceRange: '$$',
    openingHours: 'Mo-Su 00:00-23:59',
    sameAs: [
      `${site.siteUrl}/service-areas/${params.slug}`,
    ],
  };

  return (
    <main>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative min-h-[80vh] flex items-center overflow-hidden">
        <Image
          src={site.images.hero}
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
                {intro}
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

      {/* Services available in {town} */}
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

      {/* Why Choose Us */}
      <Section className="bg-black/40">
        <SectionHeading
          eyebrow="Why Daniells Auto Care"
          title={`Why ${town} Drivers Choose Us`}
          subtitle="Mobile convenience, factory-trained technicians, and a 100% satisfaction guarantee — all backed by 300+ five-star reviews."
        />
        <div className="grid gap-6 sm:grid-cols-2 mt-8">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <GlassCard className="p-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-dac.red/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-dac.red" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-dac.muted text-sm">{item.desc}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process Steps */}
      <Section>
        <SectionHeading
          eyebrow="How It Works"
          title="Our Mobile Detailing Process"
          subtitle="From quote to completion, we make it simple and transparent."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {processSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <GlassCard className="p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-dac.red/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-dac.red font-bold text-sm">{i + 1}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-dac.muted text-sm">{step.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Localized FAQ */}
      <Section className="bg-black/40">
        <SectionHeading
          eyebrow="FAQ"
          title={`Frequently Asked Questions About Detailing in ${town}`}
          subtitle="Everything you need to know before booking your mobile detail."
        />
        <div className="grid gap-4 sm:grid-cols-2 mt-8 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold text-base mb-2">{faq.q}</h3>
                <p className="text-dac.muted text-sm">{faq.a}</p>
              </GlassCard>
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
