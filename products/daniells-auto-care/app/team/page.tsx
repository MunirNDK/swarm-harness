import Image from "next/image"
import {
  Shield,
  GraduationCap,
  ShieldCheck,
  BadgeCheck,
  Check,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { QuoteCTA } from "@/components/quote-cta"
import { site } from "@/lib/site"

const values = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "Fully licensed and insured, giving you complete peace of mind with every service.",
  },
  {
    icon: GraduationCap,
    title: "Factory-Trained Technicians",
    description: "Our detailers undergo intensive factory training to deliver precision and quality.",
  },
  {
    icon: ShieldCheck,
    title: "2–10 Year Ceramic Coating Warranty",
    description: "We stand behind our work with a manufacturer-backed ceramic coating warranty.",
  },
  {
    icon: BadgeCheck,
    title: "Lifetime Window Tint Warranty",
    description: "Our premium window tint is backed by a lifetime warranty against bubbling, peeling, and fading.",
  },
]

const certifications = site.business.trust

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <Section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden bg-dac-ink">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={site.images.hero}
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-dac-ink" />
        </div>
        <Container className="relative z-10 text-center">
          <Reveal>
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold font-sora tracking-tight">
                <span className="bg-gradient-to-r from-white via-white to-dac-red bg-clip-text text-transparent">
                  Passionate Detailers. <br />Perfectionists. <br />Your Car&apos;s Best Friends.
                </span>
              </h1>
              <p className="text-dac-muted text-lg md:text-xl max-w-2xl mx-auto">
                Backed by over 8 years of experience, our factory-trained team delivers the highest standard of care for every vehicle that rolls into our bay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" asChild>
                  <a href="/contact">Get Free Quote</a>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href="tel:+19739167868">Call (973) 916-7868</a>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Values */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Why We're Different"
            title="Core Values"
            subtitle="What drives every detail and every service at Daniells Auto Care."
          />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <Reveal key={idx} index={idx}>
                <GlassCard className="p-8 h-full flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-dac-red/10 flex items-center justify-center mb-6">
                    <value.icon className="w-7 h-7 text-dac-red" />
                  </div>
                  <h3 className="text-xl font-semibold font-sora text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-dac-muted">{value.description}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Certifications */}
      <Section className="bg-dac-black/50">
        <Container>
          <SectionHeading
            eyebrow="Trust & Credentials"
            title="Licensed, Insured & Factory-Trained"
            subtitle="We don't just talk about quality — we back it with real credentials and warranties."
          />
          <div className="mt-16">
            <Reveal>
              <GlassCard className="p-8 md:p-12 max-w-3xl mx-auto">
                <ul className="space-y-6">
                  {certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-dac-red/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-dac-red" />
                      </div>
                      <span className="text-lg text-white">{cert}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA />
    </>
  )
}
