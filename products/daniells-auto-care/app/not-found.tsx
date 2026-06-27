import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { site } from '@/lib/site';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <Container className="relative z-10">
        <Section className="flex flex-col items-center text-center">
          <Reveal>
            <GlassCard className="p-8 sm:p-12 md:p-16 max-w-2xl mx-auto relative">
              {/* Red glow behind card */}
              <div
                className="absolute -inset-4 bg-dac-red/10 blur-3xl rounded-3xl"
                aria-hidden="true"
              />

              {/* 404 Number */}
              <h1 className="font-sora text-8xl sm:text-9xl font-bold bg-gradient-to-r from-white via-white to-dac-red bg-clip-text text-transparent leading-none mb-6">
                404
              </h1>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <SearchX className="w-16 h-16 text-dac-red" strokeWidth={1.5} />
              </div>

              {/* Heading */}
              <SectionHeading
                eyebrow="Page Not Found"
                title="We couldn't find that page"
                subtitle="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
                className="mb-8"
              />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/contact">Get Free Quote</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <a href={site.business.phoneHref}>
                    Call {site.business.phone}
                  </a>
                </Button>
              </div>
            </GlassCard>
          </Reveal>
        </Section>
      </Container>
    </div>
  );
}
