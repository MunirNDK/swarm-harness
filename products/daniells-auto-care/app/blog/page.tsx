import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal } from '@/components/ui/reveal';

export const metadata: Metadata = {
  title: 'Blog | Daniells Auto Care',
  description: 'Tips, guides, and insights from our detailing experts.',
  openGraph: {
    title: 'Blog | Daniells Auto Care',
    description: 'Tips, guides, and insights from our detailing experts.',
    type: 'website',
  },
};

const blogPosts = [
  {
    slug: 'ceramic-coating-worth-it',
    title: 'Is Ceramic Coating Worth It?',
    excerpt:
      "Everything you need to know about ceramic coating — cost, durability, and whether it's right for your vehicle.",
    date: '2026-06-15',
  },
  {
    slug: 'winter-car-care-tips',
    title: 'Winter Car Care Tips for NJ Drivers',
    excerpt:
      'Protect your vehicle from salt, grime, and freezing temperatures with these essential winter detailing tips.',
    date: '2026-05-28',
  },
  {
    slug: 'paint-correction-vs-detailing',
    title: "Paint Correction vs. Detailing: What's the Difference?",
    excerpt:
      'Learn when your car needs paint correction and how it differs from a standard detail.',
    date: '2026-05-10',
  },
];

export default function BlogPage() {
  return (
    <>
      <Section className="pt-32 pb-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Blog"
              subtitle="Tips, guides, and insights from our detailing experts."
              centered
            />
          </Reveal>
        </Container>
      </Section>

      <Section className="pb-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Reveal key={post.slug} staggerIndex={index}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-dac-red focus-visible:ring-offset-2 focus-visible:ring-offset-dac-black rounded-3xl"
                  aria-label={`Read article: ${post.title}`}
                >
                  <GlassCard className="h-full flex flex-col p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:border-white/20">
                    <h3 className="text-xl font-semibold text-white font-heading tracking-tight mb-3 group-hover:text-dac-red transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-dac-muted text-sm leading-relaxed flex-1 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-dac-faint">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
