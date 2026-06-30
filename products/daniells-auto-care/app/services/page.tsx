import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ServiceCard } from '@/components/service-card';
import { QuoteCTA } from '@/components/quote-cta';
import { SERVICES } from '@/lib/site';

export default function ServicesPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="What We Do"
            title="Premium Auto Care Services"
            subtitle="From quick interior cleans to full ceramic coating, our factory-trained team delivers showroom results — wherever you are."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </Section>
      <QuoteCTA />
    </>
  );
}