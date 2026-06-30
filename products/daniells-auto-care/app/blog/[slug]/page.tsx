import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { QuoteCTA } from '@/components/quote-cta';

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
};

const posts: Post[] = [
  {
    slug: 'ceramic-coating-worth-it',
    title: 'Is Ceramic Coating Worth It?',
    date: '2026-06-15',
    excerpt:
      "Everything you need to know about ceramic coating — cost, durability, and whether it's right for your vehicle.",
    content: [
      "Ceramic coating has become one of the most talked-about services in the auto detailing world, and for good reason. Unlike traditional wax or sealant, a ceramic coating forms a semi-permanent bond with your vehicle's clear coat, creating a hard, hydrophobic layer that repels water, dirt, and UV rays for years — not weeks.",
      "The upfront cost can feel steep compared to a standard wax job, but when you factor in the longevity — typically two to ten years depending on the product and maintenance — the value proposition becomes clear. You spend less time washing and more time enjoying a vehicle that looks freshly detailed every single day.",
      "Is it right for every vehicle? If your car sits in a garage and only sees sunny weekend drives, a high-quality sealant might suffice. But for daily drivers battling Northern New Jersey road salt, tree sap, and harsh winters, ceramic coating delivers real, measurable protection that pays for itself over time.",
      "At Daniells Auto Care, we use only professional-grade coatings backed by manufacturer warranties. Our factory-trained technicians perform a full decontamination and paint correction before application, ensuring the coating bonds perfectly for maximum durability and gloss.",
    ],
  },
  {
    slug: 'winter-car-care-tips',
    title: 'Winter Car Care Tips for NJ Drivers',
    date: '2026-05-28',
    excerpt:
      'Protect your vehicle from salt, grime, and freezing temperatures with these essential winter detailing tips.',
    content: [
      "Winter in New Jersey is tough on vehicles. Road salt, calcium chloride, and freezing temperatures team up to attack your car's paint, undercarriage, and interior. A proactive approach to winter car care can mean the difference between a vehicle that ages gracefully and one that shows premature wear.",
      "Start with a thorough pre-winter detail. A quality wash, clay bar treatment, and a durable sealant or ceramic coating creates a protective barrier before the first snowflake falls. Pay special attention to the undercarriage — salt and brine spray are the leading causes of rust in Northeast vehicles.",
      "Throughout the winter months, aim to wash your car every two weeks — especially after snowstorms when roads are heavily treated. Touchless washes are a good option for quick cleanings, but a hand wash with proper two-bucket technique will always deliver better results without introducing swirl marks.",
      "Don't forget the interior. Heavy-duty rubber floor mats catch slush and salt before they soak into your carpet. Keep a microfiber towel in the car to wipe down surfaces after tracking in snow, and consider a fabric protectant to guard against salt stains and moisture damage.",
    ],
  },
  {
    slug: 'paint-correction-vs-detailing',
    title: "Paint Correction vs. Detailing: What's the Difference?",
    date: '2026-05-10',
    excerpt:
      'Learn when your car needs paint correction and how it differs from a standard detail.',
    content: [
      "Many car owners use the terms 'detailing' and 'paint correction' interchangeably, but they address fundamentally different needs. A standard detail focuses on cleaning and protecting — thorough washing, clay bar decontamination, polish, and wax or sealant. The goal is a clean, shiny, protected vehicle.",
      "Paint correction goes a step further by physically removing imperfections from your clear coat. Using a machine polisher and graduated compounds, a skilled technician levels microscopic amounts of clear coat to eliminate swirl marks, light scratches, oxidation, and water spots. The result is a truly flawless, mirror-like finish that a standard detail alone cannot achieve.",
      "So when does your car need correction versus a detail? If you notice spider-webbing or swirl marks under direct light, water spots that won't wash off, or a general dullness despite regular washing, paint correction is likely the answer. For well-maintained vehicles with minimal defects, a thorough detail with a quality sealant is often sufficient.",
      "At Daniells Auto Care, every paint correction service begins with a comprehensive inspection under specialized lighting. We determine the precise level of correction needed — from a single-stage polish for light defects to a multi-stage compound for deeper imperfections — so your vehicle gets exactly what it needs without removing more clear coat than necessary.",
    ],
  },
];

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Daniells Auto Care Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12">
            <time className="text-sm text-dac-muted mb-3 block">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-dac-muted text-lg max-w-3xl">
              {post.excerpt}
            </p>
          </div>
        </Container>
      </Section>

      {/* Body */}
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
