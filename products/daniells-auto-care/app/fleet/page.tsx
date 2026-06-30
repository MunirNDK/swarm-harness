import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { QuoteCTA } from "@/components/quote-cta";
import { BUSINESS, IMAGES } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  Truck,
  Layers,
  Shield,
  CheckCircle,
  ClipboardList,
  PenTool,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fleet Detailing",
};

const programs = [
  {
    icon: Truck,
    title: "On-Site Mobile Service",
    description: "We come to your location, minimizing vehicle downtime.",
  },
  {
    icon: Layers,
    title: "Volume Pricing",
    description: "Competitive rates that scale with your fleet size.",
  },
  {
    icon: Shield,
    title: "Dedicated Account Management",
    description:
      "One point of contact for scheduling, billing and quality.",
  },
  {
    icon: CheckCircle,
    title: "Scheduled Maintenance",
    description: "Recurring detailing on your preferred cadence.",
  },
];

const processSteps = [
  {
    icon: ClipboardList,
    title: "Request a Fleet Assessment",
    description:
      "Tell us about your vehicles, locations, and detailing goals. We'll respond within 15 minutes.",
  },
  {
    icon: PenTool,
    title: "Custom Program Design",
    description:
      "We'll build a tailored plan with the right services, frequency, and pricing for your fleet.",
  },
  {
    icon: Truck,
    title: "On-Site Execution",
    description:
      "Our mobile unit arrives at your scheduled time, completes the work, and leaves your fleet looking its best.",
  },
];

export default function FleetPage() {
  return (
    <>
      {/* Hero */}
      <Section
        className="relative min-h-[70vh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.fleet}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/70 to-dac-black" />

        <Container className="relative z-10 py-24 md:py-32">
          <Reveal>
            <GlassCard className="max-w-2xl p-8 sm:p-10" glow>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dac-white leading-tight">
                Corporate Fleet Detailing
              </h1>
              <p className="mt-4 text-dac-muted text-base sm:text-lg leading-relaxed max-w-xl">
                Keep your business fleet looking professional at all times.
                Dedicated corporate detailing programs with on-site mobile
                service, volume pricing, and account management across{" "}
                {BUSINESS.serviceArea}.
              </p>
              <div className="mt-6">
                <Button href="/contact" size="lg">
                  Explore Fleet Programs
                </Button>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      {/* Program Features */}
      <Section className="bg-dac-black">
        <Container>
          <SectionHeading
            eyebrow="Fleet Programs"
            title="Built for Business"
            subtitle="Everything you need to keep your fleet looking its best, without disrupting operations."
            centered
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program, index) => (
              <Reveal key={program.title} delay={index * 0.1}>
                <GlassCard className="p-6 h-full text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-dac-red/10 flex items-center justify-center mb-4">
                    <program.icon className="h-6 w-6 text-dac-red" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-dac-white mb-2">
                    {program.title}
                  </h3>
                  <p className="text-sm text-dac-muted">
                    {program.description}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="bg-dac-ink">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="Three Steps to a Spotless Fleet"
            subtitle="Simple, transparent, and built for minimal disruption."
            centered
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.15}>
                <div className="relative text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-dac-red/10 border border-dac-red/20 flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-dac-red" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-dac-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-dac-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA headline="Explore Fleet Programs" />
    </>
  );
}
