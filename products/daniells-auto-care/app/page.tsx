import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StarRating } from "@/components/ui/star-rating";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard } from "@/components/service-card";
import { StatStrip } from "@/components/stat-strip";
import { ReviewCard } from "@/components/review-card";
import { QuoteCTA } from "@/components/quote-cta";
import { Marquee } from "@/components/marquee";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  CarFront,
  Armchair,
  ShieldCheck,
  Wand2,
  Layers,
  SunDim,
  Truck,
  Phone,
  Clock,
  Shield,
  BadgeCheck,
  CalendarCheck,
  SprayCan,
  Sparkles as SparklesIcon,
} from "lucide-react";

const processSteps = [
  {
    icon: CalendarCheck,
    title: "Book",
    description:
      "Schedule your appointment online or call us. We respond within 15 minutes with a free, no-obligation quote.",
  },
  {
    icon: SprayCan,
    title: "Detail",
    description:
      "Our mobile team arrives at your location with professional-grade equipment and products, delivering a meticulous detail.",
  },
  {
    icon: ShieldCheck,
    title: "Protect",
    description:
      "We apply premium protection — ceramic coating, paint sealant, or window tint — to keep your vehicle looking flawless for years.",
  },
];

const whyChooseUs = [
  {
    icon: Truck,
    title: "Mobile Service",
    description:
      "We come to your home or office across Northern New Jersey — same-day service available.",
  },
  {
    icon: BadgeCheck,
    title: "Licensed & Insured",
    description:
      "Fully licensed and insured for your peace of mind. Professional, factory-trained technicians.",
  },
  {
    icon: Shield,
    title: "Industry-Leading Warranties",
    description:
      "2–10 year ceramic coating warranty and lifetime window tint warranty — protection you can trust.",
  },
  {
    icon: Clock,
    title: "15-Minute Quote Response",
    description:
      "We value your time. Get a detailed, transparent quote within 15 minutes of your inquiry.",
  },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    alt: "Professional car detailing in progress",
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    alt: "Luxury car with glossy finish after detailing",
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    alt: "Interior detailing with steam cleaning",
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
    alt: "Ceramic coating application on a sports car",
    width: 800,
    height: 600,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80"
            alt="Dark luxury car detailing background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dac-black/80 via-dac-ink/60 to-dac-ink" />
        </div>

        <Container className="relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Reveal>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-white via-white to-dac-red bg-clip-text text-transparent">
                    {site.business.tagline}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-lg text-dac-muted max-w-xl">
                  Premium mobile auto detailing across Northern New Jersey.
                  Same-day service, 100% satisfaction guaranteed, and a
                  15-minute quote response.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <a href={site.business.primaryCtas[0].href}>
                      {site.business.primaryCtas[0].label}
                    </a>
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <a href={site.business.primaryCtas[1].href}>
                      <Phone className="mr-2 h-5 w-5" />
                      {site.business.primaryCtas[1].label}
                    </a>
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="lg:justify-self-end">
              <GlassCard className="p-6 sm:p-8 space-y-6 max-w-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dac-faint">Response Time</p>
                    <p className="text-2xl font-bold text-white">
                      {site.business.responseTime}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-dac-red/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-dac-red" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-dac-red h-2 rounded-full"
                    style={{ width: "75%" }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Same-Day Service",
                    "Licensed & Insured",
                    "2–10 Year Warranty",
                  ].map((pill) => (
                    <span
                      key={pill}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-dac-red/10 text-dac-red border border-dac-red/20"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="text-sm text-dac-faint">
                    Trusted by{" "}
                    <span className="text-white font-semibold">
                      {site.stats[0].value}
                    </span>{" "}
                    clients across{" "}
                    <span className="text-white font-semibold">
                      {site.areas.length}+ towns
                    </span>
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          </div>

          {/* Area Marquee */}
          <div className="mt-16">
            <Marquee items={site.areas} speed={40} />
          </div>
        </Container>
      </Section>

      {/* Trust StatStrip */}
      <Section id="trust">
        <Container>
          <Reveal>
            <StatStrip stats={site.stats} />
          </Reveal>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section id="services">
        <Container>
          <SectionHeading
            eyebrow="Our Services"
            title="Complete Auto Detailing Solutions"
            subtitle="From interior deep cleans to ceramic coatings, we offer a full range of mobile detailing services."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {site.services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Choose Us */}
      <Section id="why-us">
        <Container>
          <SectionHeading
            eyebrow="Why Daniells Auto Care"
            title="The Difference Is in the Details"
            subtitle="We combine mobile convenience with factory-trained expertise and industry-leading warranties."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <GlassCard className="p-6 text-center h-full">
                  <div className="mx-auto w-12 h-12 rounded-full bg-dac-red/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-dac-red" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-dac-muted">{item.description}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Process Steps */}
      <Section id="process">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="Book → Detail → Protect"
            subtitle="Three simple steps to a showroom-ready vehicle, all at your location."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.15}>
                <div className="relative text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-dac-red/10 border border-dac-red/20 flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-dac-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-dac-muted">{step.description}</p>
                  {index < processSteps.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-dac-red/50 to-transparent" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Gallery Preview */}
      <Section id="gallery">
        <Container>
          <SectionHeading
            eyebrow="Our Work"
            title="Results That Speak for Themselves"
            subtitle="A glimpse of our recent detailing projects across Northern New Jersey."
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dac-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" asChild>
              <a href="/gallery">View Full Gallery</a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Reviews */}
      <Section id="reviews">
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by Hundreds of Clients"
            subtitle={
              <>
                Rated{" "}
                <span className="text-dac-red font-semibold">5.0</span> on
                Google with{" "}
                <span className="text-dac-red font-semibold">
                  {site.business.googleReviews}
                </span>{" "}
                reviews
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {site.reviews.map((review, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Service Areas Teaser + Marquee */}
      <Section id="areas">
        <Container>
          <SectionHeading
            eyebrow="Service Areas"
            title="Proudly Serving Northern New Jersey"
            subtitle="We bring our mobile detailing services to your doorstep across dozens of communities."
          />
          <div className="mt-8">
            <Marquee items={site.areas} speed={30} />
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" asChild>
              <a href="/service-areas">See All Service Areas</a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA />
    </>
  );
}
