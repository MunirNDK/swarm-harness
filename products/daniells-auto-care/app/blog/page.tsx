import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Local brand asset — replace with a real blog hero image when available
import blogHero from '@/public/assets/services/ceramic-coating.webp';

export const metadata: Metadata = {
  title: 'Blog | Daniells Auto Care',
  description: 'Expert tips, guides, and insights on auto detailing, ceramic coatings, paint protection, and more from the professionals at Daniells Auto Care.',
  openGraph: {
    title: 'Blog | Daniells Auto Care',
    description: 'Expert tips, guides, and insights on auto detailing, ceramic coatings, paint protection, and more.',
    type: 'website',
  },
};

// Placeholder blog posts — these would normally come from a CMS or content layer.
// Using real topics aligned with the business services and areas.
const blogPosts = [
  {
    slug: 'ceramic-coating-worth-it',
    title: 'Is Ceramic Coating Worth It? A Complete Guide for New Jersey Drivers',
    excerpt: 'From road salt to tree sap, Northern New Jersey presents unique challenges for your vehicle\'s finish. We break down the cost, benefits, and real-world performance of ceramic coatings.',
    category: 'Ceramic Coating',
    readTime: '6 min read',
    date: '2025-01-15',
    image: blogHero,
    imageAlt: 'Luxury car with glossy ceramic coating finish',
  },
  {
    slug: 'paint-correction-before-after',
    title: 'Paint Correction: What It Is and Why Your Car Needs It',
    excerpt: 'Swirl marks, scratches, and oxidation don\'t have to be permanent. Learn how our multi-stage paint correction process restores a flawless, mirror-like finish.',
    category: 'Paint Correction',
    readTime: '5 min read',
    date: '2025-01-10',
    image: blogHero,
    imageAlt: 'Close-up of polished car paint with perfect reflection',
  },
  {
    slug: 'winter-detailing-tips',
    title: 'Winter Detailing Tips: Protecting Your Car from Salt and Ice',
    excerpt: 'Winter in Bergen County and Morris County means road salt, freezing temperatures, and harsh conditions. Follow our professional winter detailing routine to keep your vehicle protected.',
    category: 'Detailing Tips',
    readTime: '7 min read',
    date: '2025-01-05',
    image: blogHero,
    imageAlt: 'Car being washed in winter conditions with steam',
  },
  {
    slug: 'window-tint-benefits',
    title: 'The Hidden Benefits of Premium Window Tinting',
    excerpt: 'Beyond the sleek look, quality window film delivers serious heat rejection, UV protection, and glare reduction. Discover why our lifetime-warranty tint is a year-round upgrade.',
    category: 'Window Tinting',
    readTime: '4 min read',
    date: '2024-12-20',
    image: blogHero,
    imageAlt: 'Car window with premium tint film applied',
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-32 pb-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Expert Insights"
              title="The Daniells Auto Care Blog"
              subtitle="Tips, guides, and industry secrets from Northern New Jersey's premier detailing team."
              centered
            />
          </Reveal>
        </Container>
      </Section>

      {/* Blog Post Grid */}
      <Section className="pb-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Reveal key={post.slug} index={index}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-dac.red focus-visible:ring-offset-2 focus-visible:ring-offset-dac.ink rounded-3xl"
                  aria-label={`Read article: ${post.title}`}
                >
                  <GlassCard className="h-full overflow-hidden p-0 flex flex-col transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:border-white/20">
                    {/* Image */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={index > 1 ? 'lazy' : undefined}
                      />
                      {/* Gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dac.ink/80 via-dac.ink/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-dac.faint">
                        <span className="inline-flex items-center gap-1.5">
                          <Tag className="w-4 h-4" />
                          {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-dac.white font-heading tracking-tight mb-2 group-hover:text-dac.red transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-dac.muted text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Date + Read More */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                        <span className="inline-flex items-center gap-1.5 text-xs text-dac.faint">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-dac.red group-hover:gap-2 transition-all">
                          Read more
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Empty state fallback (if no posts) — not shown since we have 4 posts, but good practice */}
          {blogPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-dac.muted text-lg">No blog posts yet. Check back soon for expert detailing tips and guides.</p>
            </div>
          )}

          {/* CTA Banner */}
          <Reveal index={4}>
            <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-dac.red-dark/30 via-dac.red-med/20 to-dac.red/10 border border-dac.red/20 backdrop-blur-xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-dac.white font-heading mb-4">
                Ready for a showroom finish?
              </h2>
              <p className="text-dac.muted max-w-2xl mx-auto mb-8">
                Whether you need ceramic coating, paint correction, or a full detail, our team brings factory-trained expertise to your driveway.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/contact">
                    Get Free Quote
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href={site.business.phoneHref}>
                    Call {site.business.phone}
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
