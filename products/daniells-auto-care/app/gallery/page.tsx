import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { QuoteCTA } from '@/components/quote-cta';
import { BeforeAfter } from '@/components/before-after';
import { beforeAfter } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Detailing Gallery — Before & After | Daniells Auto Care',
  description:
    'See real before-and-after results from our professional auto detailing, ceramic coating, paint correction, window tinting, and fleet services across Northern New Jersey.',
  alternates: {
    canonical: '/gallery',
  },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-32 pb-16">
        <Container>
          <SectionHeading
            eyebrow="Our Work"
            title="Before & After Gallery"
            subtitle="Real results from real projects across Northern New Jersey. Drag the slider to reveal the transformation each vehicle receives."
          />
        </Container>
      </Section>

      {/* Before/After Grid */}
      <Section className="pb-32">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beforeAfter.map((item, index) => (
              <Reveal key={item.id} index={index} className="flex flex-col">
                <BeforeAfter
                  before={item.before}
                  after={item.after}
                  title={item.title}
                  tag={item.tag}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA />
    </main>
  );
}
