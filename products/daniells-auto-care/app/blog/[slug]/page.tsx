import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { QuoteCTA } from '@/components/quote-cta';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  content: string[];
};

const posts: Post[] = [
  {
    slug: 'benefits-of-ceramic-coating',
    title: 'Ceramic Coating: Ultimate Protection for Your Car',
    date: 'May 15, 2024',
    excerpt: 'Discover how ceramic coating can protect your vehicle’s finish, deepen its gloss, and reduce maintenance.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&crop=center&fm=webp',
    imageWidth: 1200,
    imageHeight: 800,
    content: [
      'Keeping your car looking brand new isn’t just about regular washes—it’s about lasting protection. Ceramic coating forms a liquid polymer layer that bonds with your paint, delivering hydrophobic properties and a deep, reflective shine that lasts for years.',
      'Unlike traditional waxes and sealants that wear off after a few months, a professional ceramic coating can last between two and ten years depending on the package. It repels water, dirt, and road grime, making routine cleaning effortless.',
      'At Daniells Auto Care, we apply our ceramic coatings in a controlled environment, using rigorous prep work including paint decontamination and correction to ensure a flawless bond. The result is a finish that not only looks incredible but also resists UV oxidation, bird droppings, and minor scratches.',
      'Ready to give your vehicle long-term protection? Our certified technicians are just a quote away. Contact us today to learn which coating is right for your car.'
    ]
  },
  {
    slug: 'paint-correction-basics',
    title: 'Paint Correction: Restore Your Car’s Factory Shine',
    date: 'April 28, 2024',
    excerpt: 'Swirl marks and scratches can dull your paint. Learn how paint correction brings back that showroom finish.',
    image: 'https://images.unsplash.com/photo-1551524559-8bc7cfa3fea5?w=1200&h=800&fit=crop&crop=center&fm=webp',
    imageWidth: 1200,
    imageHeight: 800,
    content: [
      'Over time, even the most carefully maintained cars develop swirl marks, micro-scratches, and oxidation. Paint correction is a multi-stage polishing process that removes these imperfections by leveling a microscopic amount of clear coat, revealing a flawless surface underneath.',
      'Professional corrections can range from a single-stage polish for light defects to a multi-stage compound and polish for deeper scratches. Here at Daniells Auto Care, we analyze your paint with special lighting to determine the best approach, ensuring no more clear coat is removed than necessary.',
      'After correction, we often recommend a sealant or ceramic coating to lock in the results and keep your paint protected for the long haul. The transformation is dramatic: deeper gloss, mirror-like reflections, and a true factory-fresh appearance.'
    ]
  },
  {
    slug: 'interior-detailing-tips',
    title: 'Interior Detailing: Deep Clean Techniques for a Showroom Cabin',
    date: 'April 10, 2024',
    excerpt: 'From steam extraction to leather conditioning, learn the methods that make your interior look and feel brand new.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&h=800&fit=crop&crop=center&fm=webp',
    imageWidth: 1200,
    imageHeight: 800,
    content: [
      'Your car’s interior experiences daily wear—dust, spills, pet hair, and UV rays. A professional interior detail goes beyond vacuuming; it includes steam extraction, enzyme treatments for odors, and careful conditioning of leather and vinyl surfaces.',
      'At Daniells Auto Care, we use hot-water extraction for fabric seats and carpets, followed by a deodorizing ozone treatment. For leather, we apply pH-balanced cleaners and premium conditioners that restore suppleness without leaving a greasy film.',
      'Our process also addresses touchpoints like steering wheels, shift knobs, and door panels to eliminate bacteria and embedded dirt. We finish with a streak-free application of UV-blocking protection on all interior plastics, leaving the cabin immaculate and healthy.'
    ]
  }
];

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Daniells Auto Care Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      {/* Article Header */}
      <Section className="pt-24 md:pt-32 pb-8">
        <Container>
          <Button
            variant="ghost"
            size="sm"
            className="mb-8 -ml-2 text-dac-muted hover:text-white"
            asChild
          >
            <a href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </a>
          </Button>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <div className="aspect-[3/2] md:aspect-[3/1] relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dac-black via-dac-black/60 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <time className="text-sm text-dac-muted mb-2 block">{post.date}</time>
              <h1 className="font-heading text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-dac-red bg-clip-text text-transparent leading-tight">
                {post.title}
              </h1>
              <p className="mt-4 text-dac-muted text-lg max-w-2xl">{post.excerpt}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Body (placeholder copy) */}
      <Section className="pt-8 pb-16">
        <Container>
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-dac-red text-dac-muted/90">
              {post.content.map((paragraph, idx) => (
                <p key={idx} className="mb-6 last:mb-0 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* QuoteCTA */}
      <QuoteCTA />
    </>
  );
}
