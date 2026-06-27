import { Metadata } from "next";
import { Phone, Clock, MapPin, Timer, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuoteForm } from "@/components/quote-form";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get Your Free Quote | Mobile Auto Detailing | Daniells Auto Care",
  description:
    "Request a free, no-obligation quote for mobile auto detailing in Northern New Jersey. Same-day service, 15-minute response. We serve Franklin Lakes, Ridgewood, Tenafly and beyond.",
};

const faqs = [
  {
    q: "How quickly will I receive my quote?",
    a: "We respond to all quote requests within 15 minutes during business hours. Our goal is to provide an accurate, no-obligation estimate so you can make an informed decision.",
  },
  {
    q: "Do you service my area?",
    a: "We provide mobile detailing throughout Northern New Jersey, including Franklin Lakes, Ridgewood, Tenafly, Chatham, Madison and many other towns. View our full service areas list for details.",
  },
  {
    q: "Is the quote really free?",
    a: "Yes — the quote is 100% free with no obligation. We’ll assess your vehicle’s needs and provide a transparent price before any work begins.",
  },
];

export default function ContactPage() {
  const { business, areas } = site;

  return (
    <>
      {/* Hero + Intro */}
      <Section id="hero" className="relative overflow-hidden pt-32 pb-20">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E80505]/10 blur-3xl rounded-full" />
        </div>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Contact Us"
              title="Get Your Free Quote"
              subtitle="Fill out the form below and we‘ll respond within 15 minutes — no strings attached."
              centered
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-6 mx-auto max-w-2xl text-center">
            <p className="text-lg text-[#A1A1AA]">
              Daniells Auto Care brings professional mobile detailing to your
              doorstep across {business.serviceArea}. Whether you need a
              one-time detail or a regular maintenance plan, our team is ready
              to deliver a spotless finish with same‑day service and a 100%
              satisfaction guarantee. Call us at{" "}
              <a
                href={business.phoneHref}
                className="text-[#E80505] underline underline-offset-2 hover:text-white transition-colors"
              >
                {business.phone}
              </a>{" "}
              or request a free quote online.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 flex justify-center">
            <Button asChild variant="primary" size="lg">
              <a href="tel:+19739167868">
                <Phone className="mr-2 h-5 w-5" />
                Call (973) 916-7868
              </a>
            </Button>
          </Reveal>
        </Container>
      </Section>

      {/* Quote Form + Contact Details */}
      <Section id="quote-form" className="pb-24">
        <Container>
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal>
                <GlassCard className="p-6 sm:p-8">
                  <QuoteForm />
                </GlassCard>
              </Reveal>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-2">
              <Reveal delay={0.1}>
                <GlassCard className="p-6 sm:p-8 space-y-6">
                  <h3 className="text-xl font-semibold text-white font-heading">
                    Contact Info
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-faint">Phone</p>
                        <a
                          href={business.phoneHref}
                          className="text-white font-medium hover:text-dac-red transition-colors"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-faint">Hours</p>
                        <p className="text-white font-medium">{business.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-faint">Service Area</p>
                        <p className="text-white font-medium">{business.serviceArea}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Timer className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-faint">Response Time</p>
                        <p className="text-white font-medium">{business.responseTime}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section id="faq" background="ink">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            title="Quote & Service Questions"
            subtitle="Here are answers to common questions before you reach out."
          />
          <div className="mt-12 mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, idx) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <GlassCard className="p-6">
                  <h3 className="font-sora text-lg font-semibold text-white">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-[#A1A1AA]">{faq.a}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Service Areas Note */}
      <Section id="service-areas" className="pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Service Areas"
              title="Serving Northern New Jersey"
              subtitle="We bring our mobile detailing service directly to your doorstep."
              centered
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <GlassCard className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {areas.map((area) => (
                  <div
                    key={area}
                    className="text-center text-dac-muted text-sm py-2 px-3 rounded-xl bg-white/5 border border-white/5 hover:border-dac-red/30 hover:text-white transition-colors"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      {/* Internal links */}
      <Section id="related-links" background="ink" className="pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              title="Explore More"
              subtitle="Learn about our services and coverage areas."
              centered
            />
          </Reveal>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/services">
                <ExternalLink className="mr-2 h-5 w-5" />
                View All Services
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/service-areas">
                <ExternalLink className="mr-2 h-5 w-5" />
                Service Areas
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
