import { Metadata } from "next";
import { Phone, Clock, MapPin, Timer } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuoteForm } from "@/components/quote-form";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Quote | Daniells Auto Care",
  description:
    "Request a free, no-obligation quote for mobile auto detailing in Northern New Jersey. Same-day service, 15-minute response.",
};

export default function ContactPage() {
  const { business, areas } = site;

  return (
    <>
      {/* Hero */}
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
              subtitle="Fill out the form below and we’ll respond within 15 minutes — no strings attached."
              centered
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex justify-center">
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
    </>
  );
}
