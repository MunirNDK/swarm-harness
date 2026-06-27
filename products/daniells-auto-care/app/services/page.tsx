import type { Metadata } from 'next';
import Link from 'next/link';
import { services, whyChooseUs, processSteps, faqs, siteUrl } from '@/lib/site';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ServiceCard } from '@/components/service-card';
import { Reveal } from '@/components/ui/reveal';
import { QuoteCTA } from '@/components/quote-cta';
import { GlassCard } from '@/components/ui/glass-card';
import { CheckCircle, ArrowRight, Sparkles, ClipboardCheck, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Auto Detailing Services in Northern NJ | Daniells Auto Care',
  description:
    'Professional mobile auto detailing services across Northern New Jersey. Ceramic coating, paint correction, PPF, window tinting, interior & exterior detailing, and fleet services. Same-day service, free quotes, 100% satisfaction guaranteed.',
  alternates: {
    canonical: `${siteUrl}/services`,
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-dac-black text-dac-white">
      {/* Hero Section */}
      <Section className="relative pt-32 pb-16 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#E80505]/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <Container>
          <Reveal>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sora tracking-tight text-center mb-6">
              <span className="bg-gradient-to-r from-white via-white to-[#E80505] bg-clip-text text-transparent">
                Auto Detailing Services
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-dac-muted mt-2">
                Northern New Jersey
              </span>
            </h1>
            <p className="text-lg text-dac-muted max-w-3xl mx-auto text-center leading-relaxed">
              Daniells Auto Care delivers professional mobile auto detailing across Northern New Jersey — from
              Franklin Lakes and Ridgewood to Chatham, Madison, and beyond. We bring the shop to your driveway with
              same-day service, factory-trained technicians, and a 100% satisfaction guarantee. Whether you need a
              complete interior and exterior detail, multi-stage paint correction, or long-term ceramic coating
              protection, every service is backed by{' '}
              <Link href="/contact" className="text-dac-red hover:text-dac-red-light underline underline-offset-4 transition-colors">
                free, no-obligation quotes
              </Link>{' '}
              and transparent pricing. Explore our full range of services below and discover why over 2,000 vehicle
              owners trust Daniells Auto Care for showroom-quality results.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section className="pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What We Offer"
              title="Complete detailing, protection, and restoration."
              subtitle="Every service is performed with premium products and meticulous attention to detail — from a quick interior refresh to full ceramic packages with lifetime warranties."
              center
            />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {services.map((service, index) => (
              <Reveal key={service.slug} direction="up" delay={index * 0.05}>
                <ServiceCard
                  slug={service.slug}
                  name={service.name}
                  short={service.short}
                  icon={service.icon}
                  className=""
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Choose Daniells */}
      <Section className="pb-24 relative">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E80505]/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Why Choose Us"
              title="The Daniells difference."
              subtitle="We don't just clean cars — we restore and protect them with factory-grade techniques, premium products, and a commitment to excellence that shows in every detail."
              center
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {whyChooseUs.map((item, index) => (
              <Reveal key={item.title} direction="up" delay={index * 0.08}>
                <GlassCard className="p-6 h-full flex flex-col items-start text-left">
                  <div className="w-10 h-10 rounded-full bg-[#E80505]/10 flex items-center justify-center mb-4 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-dac-red" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold font-sora text-dac-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-dac-muted leading-relaxed">
                    {item.desc}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How It Works"
              title="From quote to showroom finish in four simple steps."
              subtitle="We've streamlined the entire process so you can get back to what matters — enjoying a pristine vehicle."
              center
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} direction="up" delay={index * 0.1}>
                <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl h-full flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-dac-red flex items-center justify-center mb-4 flex-shrink-0">
                    <span className="text-white font-bold font-sora text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold font-sora text-dac-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-dac-muted leading-relaxed">
                    {step.desc}
                  </p>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-dac-red/40">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal direction="up" delay={0.4}>
            <div className="mt-10 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-dac-red text-white font-semibold font-sora hover:bg-dac-red-light transition-colors focus:outline-none focus:ring-2 focus:ring-dac-red focus:ring-offset-2 focus:ring-offset-dac-black"
              >
                <ClipboardCheck className="w-5 h-5" />
                Get Your Free Quote
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Fleet CTA Banner */}
      <Section className="pb-24">
        <Container>
          <Reveal>
            <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#E80505]/10 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E80505]/10 mb-6">
                  <Truck className="w-7 h-7 text-dac-red" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-sora text-dac-white mb-4">
                  Business Fleet Detailing
                </h2>
                <p className="text-dac-muted max-w-2xl mx-auto mb-6 leading-relaxed">
                  Keep your entire fleet looking professional with dedicated corporate detailing programs. We offer
                  on-site mobile service, volume pricing, and a dedicated account manager for businesses across
                  Northern New Jersey.
                </p>
                <Link
                  href="/fleet"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-dac-white font-semibold font-sora hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-dac-red focus:ring-offset-2 focus:ring-offset-dac-black"
                >
                  <Sparkles className="w-5 h-5" />
                  Explore Fleet Services
                </Link>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked questions."
              subtitle="Everything you need to know about our mobile detailing services in Northern New Jersey."
              center
            />
          </Reveal>
          <div className="max-w-3xl mx-auto mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} direction="up" delay={index * 0.06}>
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold font-sora text-dac-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-dac-muted leading-relaxed">
                    {faq.a}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <Reveal direction="up" delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-dac-muted mb-4">
                Still have questions? We're here to help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-dac-red text-white font-semibold font-sora hover:bg-dac-red-light transition-colors focus:outline-none focus:ring-2 focus:ring-dac-red focus:ring-offset-2 focus:ring-offset-dac-black"
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
      <QuoteCTA />
    </main>
  );
}
