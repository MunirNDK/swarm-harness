import { Calendar, Percent, Truck, UserCheck, ClipboardList, PenTool } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { QuoteCTA } from "@/components/ui/quote-cta";
import { cn } from "@/lib/utils";

const { business, services } = site;
const fleetService = services.find((s) => s.slug === "fleet-detailing");

const features = [
  {
    icon: Truck,
    title: "On-Site Mobile Detailing",
    description:
      "We bring our commercial detailing rig directly to your office, depot, or jobsite — minimizing downtime and keeping your fleet on the road.",
  },
  {
    icon: Percent,
    title: "Volume Pricing",
    description:
      "Economies of scale built into every program: the more vehicles you enroll, the lower the per-unit cost.",
  },
  {
    icon: UserCheck,
    title: "Dedicated Account Manager",
    description:
      "One point of contact for scheduling, invoicing, and special requests — so you never have to repeat yourself.",
  },
  {
    icon: Calendar,
    title: "Scheduled Maintenance",
    description:
      "Regular detailing programs that keep your fleet consistently clean and protected, on a cadence that fits your operations.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Request a Fleet Assessment",
    description:
      "Tell us about your vehicles, locations, and detailing goals. We’ll respond within 15 minutes.",
  },
  {
    icon: PenTool,
    title: "Custom Program Design",
    description:
      "We’ll build a tailored plan with the right services, frequency, and pricing for your fleet.",
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
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-[#0A0A0A]">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0A0A0A]" />

        <Container className="relative z-10 py-24 md:py-32">
          <Reveal>
            <div className="max-w-3xl">
              <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#E80505]">
                Corporate Fleet Detailing
              </p>
              <h1 className="mt-4 font-sora text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
                Keep Your Entire Fleet{" "}
                <span className="bg-gradient-to-r from-white via-white to-[#E80505] bg-clip-text text-transparent">
                  Looking Professional
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-[#A1A1AA]">
                {fleetService?.long ||
                  "Dedicated corporate detailing programs with on-site mobile service, volume pricing and account management."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a href="/contact">Get Free Quote</a>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a href={business.phoneHref}>Call {business.phone}</a>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Program Features */}
      <Section id="features">
        <Container>
          <SectionHeading
            eyebrow="Fleet Solutions"
            title="Why Fleets Choose Daniells Auto Care"
            subtitle="A dedicated program built around your business — not the other way around."
          />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <Reveal key={feature.title} delay={idx * 0.05}>
                <GlassCard className="flex h-full flex-col items-start p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E80505]/10 text-[#E80505]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-sora text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[#A1A1AA]">{feature.description}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" background="ink">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="How Our Fleet Program Works"
            subtitle="Simple, transparent, and built for minimal disruption."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <Reveal key={step.title} delay={idx * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E80505]/30 bg-[#E80505]/10 text-[#E80505]">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-sora text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[#A1A1AA]">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA
        headline="Explore Fleet Programs"
        subheadline="Let’s design a program that fits your fleet size and budget."
      />
    </>
  );
}
