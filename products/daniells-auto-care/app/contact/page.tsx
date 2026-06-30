import { Metadata } from "next";
import { Phone, Clock, MapPin, Timer, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuoteForm } from "@/components/quote-form";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a free, no-obligation quote for mobile auto detailing in Northern New Jersey. Same-day service, 15-minute response.",
};

export default function ContactPage() {
  return (
    <>
      <Section id="hero" className="relative overflow-hidden pt-32 pb-20">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dac-red/10 blur-3xl rounded-full" />
        </div>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Contact Us"
              title="Get Your Free Quote"
              subtitle="Fill out the form below and we'll respond within 15 minutes — no strings attached."
              centered
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-6 mx-auto max-w-2xl text-center">
            <p className="text-lg text-dac-muted">
              Daniells Auto Care brings professional mobile detailing to your
              doorstep across {BUSINESS.serviceArea}. Whether you need a
              one-time detail or a regular maintenance plan, our team is ready
              to deliver a spotless finish with same-day service and a 100%
              satisfaction guarantee.
            </p>
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
                <QuoteForm />
              </Reveal>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-2">
              <Reveal delay={0.1}>
                <GlassCard className="p-6 sm:p-8 space-y-6">
                  <h3 className="text-xl font-semibold text-dac-white font-heading">
                    Contact Info
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-muted">Phone</p>
                        <a
                          href={BUSINESS.phoneHref}
                          className="text-dac-white font-medium hover:text-dac-red transition-colors"
                        >
                          {BUSINESS.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-muted">Hours</p>
                        <p className="text-dac-white font-medium">{BUSINESS.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-muted">Service Area</p>
                        <p className="text-dac-white font-medium">{BUSINESS.serviceArea}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Timer className="h-5 w-5 text-dac-red mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-dac-muted">Response Time</p>
                        <p className="text-dac-white font-medium">{BUSINESS.responseTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-dac-muted uppercase tracking-wider mb-3">
                      Trust Badges
                    </h4>
                    <ul className="space-y-2">
                      {BUSINESS.trust.map((badge) => (
                        <li
                          key={badge}
                          className="flex items-center gap-2 text-sm text-dac-white"
                        >
                          <ShieldCheck className="h-4 w-4 text-dac-red shrink-0" />
                          {badge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
