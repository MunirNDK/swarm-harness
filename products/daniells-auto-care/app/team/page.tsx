import type { Metadata } from "next"
import { Shield, Award, CheckCircle, Star } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"
import { GlassCard } from "@/components/ui/glass-card"
import { QuoteCTA } from "@/components/quote-cta"
import { BUSINESS } from "@/lib/site"

export const metadata: Metadata = {
  title: "Our Team",
}

const certifications = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description:
      "Fully licensed and insured, giving you complete peace of mind with every service.",
  },
  {
    icon: Award,
    title: "Factory-Trained Technicians",
    description:
      "Our detailers undergo intensive factory training to deliver precision and quality.",
  },
  {
    icon: CheckCircle,
    title: "2–10 Year Ceramic Coating Warranty",
    description:
      "We stand behind our work with a manufacturer-backed ceramic coating warranty.",
  },
  {
    icon: Star,
    title: "Lifetime Window Tint Warranty",
    description:
      "Our premium window tint is backed by a lifetime warranty against bubbling, peeling, and fading.",
  },
] as const

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,5,5,0.08),transparent_60%)]" />
        <Container className="relative text-center">
          <Reveal>
            <SectionHeading
              title="Our Team"
              subtitle={`Backed by ${BUSINESS.experienceYears} years of experience, our factory-trained technicians deliver the highest standard of care for every vehicle — wherever you are in ${BUSINESS.serviceArea}.`}
              centered
            />
          </Reveal>
        </Container>
      </Section>

      {/* Story / Values */}
      <Section>
        <Container>
          <Reveal>
            <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-6">
                Driven by Quality. Delivered with Convenience.
              </h2>
              <div className="space-y-4 text-dac-muted text-base sm:text-lg leading-relaxed">
                <p>
                  At{" "}
                  <span className="text-white font-medium">{BUSINESS.name}</span>
                  , we believe every vehicle deserves showroom-level attention.
                  Our commitment to quality starts with factory-trained
                  technicians who treat every car like their own — and it
                  doesn&apos;t stop until you&apos;re completely satisfied.
                </p>
                <p>
                  We bring professional auto detailing directly to you with our
                  fully mobile service. No waiting rooms, no drop-offs — just
                  premium results on your schedule, backed by our{" "}
                  <span className="text-white font-medium">
                    100% satisfaction guarantee
                  </span>
                  . With {BUSINESS.vehiclesDetailed} vehicles detailed and{" "}
                  {BUSINESS.reviewsCount} five-star reviews, our reputation
                  speaks for itself.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      {/* Certifications */}
      <Section className="bg-dac-black/50">
        <Container>
          <SectionHeading
            eyebrow="Trust & Credentials"
            title="Backed by Real Warranties"
            subtitle="Every service is backed by manufacturer warranties — not promises, protection."
            centered
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <Reveal key={cert.title} staggerIndex={idx}>
                <GlassCard className="p-8 h-full flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-dac-red/10 flex items-center justify-center mb-6">
                    <cert.icon className="w-7 h-7 text-dac-red" />
                  </div>
                  <h3 className="text-lg font-semibold font-sora text-white mb-3">
                    {cert.title}
                  </h3>
                  <p className="text-dac-muted text-sm">{cert.description}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA />
    </>
  )
}