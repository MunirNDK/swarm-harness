import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';
import { QuoteCTA } from '@/components/quote-cta';
import { IMAGES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gallery',
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <Section className="pt-32 pb-16">
        <Container>
          <SectionHeading
            title="Gallery"
            subtitle="Before and after transformations, luxury details, and ceramic coating results."
          />
        </Container>
      </Section>

      <Section className="pb-32">
        <Container>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
            {IMAGES.gallery.map((src, index) => (
              <Reveal key={src} staggerIndex={index}>
                <GlassCard
                  hover
                  className="p-0 overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <QuoteCTA />
    </main>
  );
}
