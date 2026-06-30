import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { AreaList } from './area-list';

export const metadata: Metadata = {
  title: 'Service Areas',
  description:
    'Daniells Auto Care provides premium mobile detailing across Northern NJ — Franklin Lakes, Ridgewood, Tenafly, Chatham, Basking Ridge, and more.',
};

export default function ServiceAreasPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Where We Come to You"
            title="Serving Northern New Jersey"
            subtitle="We bring premium mobile detailing to your driveway. Same-day service available across our service area."
            centered
          />
          <AreaList />
        </Container>
      </Section>
    </>
  );
}