import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { QuoteCTA } from '@/components/quote-cta';
import { cn } from '@/lib/utils';

// Dark-toned luxury car detailing images from Unsplash (width/height set for CLS)
const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    width: 800,
    height: 534,
    alt: 'Before: Oxidized paint on hood before correction',
    label: 'Paint correction — before',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80',
    width: 800,
    height: 534,
    alt: 'After: Mirror-like finish after paint correction on black car',
    label: 'Paint correction — after',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Interior before deep cleaning with stains on seat',
    label: 'Interior detail — before',
    span: 'col-span-1 row-span-1 md:row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    width: 800,
    height: 534,
    alt: 'After: Pristine interior with conditioned leather seats',
    label: 'Interior detail — after',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    width: 800,
    height: 600,
    alt: 'Ceramic coating application on luxury vehicle',
    label: 'Ceramic coating',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    width: 800,
    height: 534,
    alt: 'Window tint installation on dark sedan',
    label: 'Window tinting',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1563720223185-1104c3e1b7a3?w=800&q=80',
    width: 800,
    height: 534,
    alt: 'Professional mobile detailing van at client location',
    label: 'Mobile detailing',
    span: 'col-span-1 row-span-1 md:col-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    width: 800,
    height: 534,
    alt: 'Luxury car exterior wash with foam cannon',
    label: 'Exterior detail',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    width: 800,
    height: 800,
    alt: 'Paint protection film applied to front bumper',
    label: 'Paint protection film',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
    width: 800,
    height: 534,
    alt: 'Fleet of luxury vehicles after professional detailing',
    label: 'Fleet detailing',
    span: 'col-span-1 row-span-1 md:col-span-2',
  },
];

export const metadata: Metadata = {
  title: 'Gallery — Before & After Auto Detailing | Daniells Auto Care',
  description:
    'See real before-and-after results and our craftsmanship in action. Professional auto detailing, ceramic coating, paint correction, and more across Northern New Jersey.',
  alternates: {
    canonical: '/gallery',
  },
};

const GalleryImage = ({
  image,
  index,
}: {
  image: (typeof galleryImages)[number];
  index: number;
}) => (
  <Reveal index={index} className={cn('overflow-hidden rounded-3xl', image.span)}>
    <figure className="group relative h-full w-full aspect-[4/3]">
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading={index < 4 ? 'eager' : 'lazy'}
        priority={index < 2}
      />
      {/* Glass overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
        {image.label}
      </figcaption>
    </figure>
  </Reveal>
);

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-32 pb-16">
        <Container>
          <SectionHeading
            eyebrow="Our Work"
            title="Before & After Gallery"
            subtitle="Real results from real projects across Northern New Jersey. Every image represents our commitment to showroom-quality craftsmanship."
          />
        </Container>
      </Section>

      {/* Gallery Grid */}
      <Section className="pb-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">
            {galleryImages.map((image, i) => (
              <GalleryImage key={`${image.src}-${i}`} image={image} index={i} />
            ))}
          </div>

          <Reveal index={galleryImages.length} className="mt-16 text-center">
            <p className="text-dac-muted mb-6">
              Every vehicle receives our signature attention to detail.
              <br className="hidden sm:block" />
              Ready to see what we can do for yours?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-dac-red px-8 py-4 text-white font-semibold transition-all hover:bg-dac-red-light hover:scale-105 focus:outline-none focus:ring-2 focus:ring-dac-red focus:ring-offset-2 focus:ring-offset-black"
            >
              Book Your Detail
            </Link>
          </Reveal>
        </Container>
      </Section>

      {/* Quote CTA */}
      <QuoteCTA />
    </main>
  );
}
