import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard } from "@/components/service-card";
import { StatStrip } from "@/components/stat-strip";
import { ReviewCard } from "@/components/review-card";
import { QuoteCTA } from "@/components/quote-cta";
import { Marquee } from "@/components/marquee";
import {
  BUSINESS,
  SERVICES,
  AREAS,
  STATS,
  REVIEWS,
  IMAGES,
  SITE,
} from "@/lib/site";
import { Truck, Shield, Award, Zap, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: SITE.name,
};

const whyChooseUs = [
  {
    icon: Truck,
    title: "Mobile Service",
    description: `We come to your home or office across ${BUSINESS.serviceArea} — same-day service available.`,
  },
  {
    icon: Shield,
    title: BUSINESS.trust[0],
    description: "Fully licensed and insured for your peace of mind. Professional, factory-trained technicians.",
  },
  {
    icon: Award,
    title: "Factory-Trained",
    description: `Our technicians are ${BUSINESS.trust[1].toLowerCase()}, delivering meticulous results on every vehicle.`,
  },
  {
    icon: Zap,
    title: `${BUSINESS.responseTime.split(" ")[0]} Response`,
    description: `We value your time. Get a detailed, transparent quote within ${BUSINESS.responseTime}.`,
  },
] as const;

const processSteps = [
  {
    step: "01",
    title: "Book",
    description:
      "Schedule your appointment online or call us. We respond within 15 minutes with a free, no-obligation quote.",
  },
  {
    step: "02",
    title: "Detail",
    description:
      "Our mobile team arrives at your location with professional-grade equipment and products, delivering a meticulous detail.",
  },
  {
    step: "03",
    title: "Protect",
    description:
      "We apply premium protection — ceramic coating, paint sealant, or window tint — to keep your vehicle looking flawless for years.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* ===== Hero ===== */}
      <Section
        className="relative min-h-screen flex items-center overflow-hidden pt-0 pb-0"
        id="hero"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.hero}
            alt="Professional auto detailing"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dac-black/80 via-dac-black/60 to-dac-black" />
        </div>

        <Container className="relative z-10 py-24 sm:py-28 lg:py-32">
          {/* Headline + CTAs */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Reveal>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-tight">
                <span className="text-gradient">
                  {BUSINESS.tagline}
                </span>
              </h1>
            </Reveal>

            <Reveal staggerIndex={1}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button href={BUSINESS.primaryCtas[0].href} size="lg">
                  {BUSINESS.primaryCtas[0].label}
                </Button>
                <Button
                  href={BUSINESS.primaryCtas[1].href}
                  variant="secondary"
                  size="lg"
                >
                  <Phone className="h-5 w-5" />
                  {BUSINESS.primaryCtas[1].label}
                </Button>
              </div>
            </Reveal>

            {/* Glass Stat Strip */}
            <Reveal staggerIndex={2}>
              <GlassCard className="inline-block mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 px-4 py-2">
                  {[
                    { value: BUSINESS.reviewsCount, label: "Reviews" },
                    { value: BUSINESS.experienceYears, label: "Years" },
                    { value: BUSINESS.vehiclesDetailed, label: "Vehicles" },
                    { value: "15 min", label: "Response" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="font-heading text-2xl sm:text-3xl font-bold text-dac-red">
                        {stat.value}
                      </div>
                      <div className="text-dac-muted text-xs font-medium uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>

            {/* Trust Badges */}
            <Reveal staggerIndex={3}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {BUSINESS.trust.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-dac-red/10 text-dac-red border border-dac-red/20"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {badge}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Area Marquee */}
          <div className="mt-16">
            <Marquee speed={40}>
              {AREAS.map((area) => (
                <span
                  key={area}
                  className="text-dac-muted text-sm font-medium px-6"
                >
                  {area}
                </span>
              ))}
            </Marquee>
          </div>
        </Container>
      </Section>

      {/* ===== Trust StatStrip ===== */}
      <Section id="trust">
        <Container>
          <StatStrip stats={STATS} />
        </Container>
      </Section>

      {/* ===== Services Grid ===== */}
      <Section id="services">
        <Container>
          <SectionHeading
            eyebrow="Our Services"
            title="Complete Auto Detailing Solutions"
            subtitle="From interior deep cleans to ceramic coatings, we offer a full range of mobile detailing services across Northern New Jersey."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={service.slug}
                service={service}
                index={index}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ===== Why Choose Us ===== */}
      <Section id="why-us">
        <Container>
          <SectionHeading
            eyebrow="Why Daniells Auto Care"
            title="The Difference Is in the Details"
            subtitle="We combine mobile convenience with factory-trained expertise and industry-leading warranties."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {whyChooseUs.map((item, index) => (
              <Reveal key={item.title} staggerIndex={index}>
                <GlassCard className="flex gap-6 items-start h-full">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-dac-red/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-dac-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white font-heading">
                      {item.title}
                    </h3>
                    <p className="text-sm text-dac-muted mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ===== Process Steps ===== */}
      <Section id="process">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="Book → Detail → Protect"
            subtitle="Three simple steps to a showroom-ready vehicle, all at your location."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {processSteps.map((step, index) => (
              <Reveal key={step.step} staggerIndex={index}>
                <GlassCard className="text-center h-full relative overflow-hidden">
                  <span className="block font-heading text-7xl sm:text-8xl font-bold text-dac-red/10 leading-none select-none">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-semibold text-white font-heading mt-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-dac-muted mt-3 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ===== Gallery Preview ===== */}
      <Section id="gallery">
        <Container>
          <SectionHeading
            eyebrow="Real Results"
            title="See Our Work"
            subtitle="A glimpse of the showroom finishes we deliver every day across Northern New Jersey."
          />
          <div className="mt-12 grid gap-4 grid-cols-2 md:grid-cols-3">
            {IMAGES.gallery.slice(0, 6).map((src, index) => (
              <Reveal key={src} staggerIndex={index}>
                <GlassCard className="relative aspect-[4/3] overflow-hidden p-0">
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" href="/gallery">
              View Full Gallery
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ===== Reviews ===== */}
      <Section id="reviews">
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by Hundreds of Clients"
            subtitle={`Rated 5.0 on Google with ${BUSINESS.googleReviews} reviews across Northern New Jersey.`}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <ReviewCard
                key={review.name}
                review={review}
                index={index}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ===== Service Areas Teaser + Marquee ===== */}
      <Section id="areas">
        <Container>
          <SectionHeading
            eyebrow="Service Areas"
            title="Proudly Serving Northern New Jersey"
            subtitle={`We bring our mobile detailing services to your doorstep across ${AREAS.length}+ communities.`}
          />
          <div className="mt-8">
            <Marquee speed={30}>
              {AREAS.map((area) => (
                <span
                  key={area}
                  className="text-dac-white/80 text-base font-medium px-6"
                >
                  {area}
                </span>
              ))}
            </Marquee>
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" href="/service-areas">
              See All Service Areas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ===== Quote CTA ===== */}
      <QuoteCTA />
    </>
  );
}