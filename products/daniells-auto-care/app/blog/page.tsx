import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { business } from '@/lib/site';
import { blogPosts } from '@/lib/blog';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { Button } from '@/components/ui/button';
import { QuoteButton } from '@/components/quote-modal';

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
];

export const metadata: Metadata = pageMeta({
  title:       'Auto Detailing Tips & Guides — Blog',
  description:
    'Expert advice on car detailing, ceramic coating, paint protection, and seasonal car care from the Daniells Auto Care team in Northern New Jersey.',
  path: '/blog',
});

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(BREADCRUMBS)} />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-3">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Header ── */}
      <Section surface="bg" id="blog-header">
        <Container>
          <Reveal>
            <div className="text-center mb-12">
              <p className="mb-3 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent">
                Expert Insights
              </p>
              <h1
                className="font-sans font-bold uppercase tracking-[-0.01em] text-fg"
                style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: '1.1' }}
              >
                The Daniells Auto Care Blog
              </h1>
              <p className="mt-4 text-md text-fg-soft leading-relaxed max-w-[40rem] mx-auto">
                Tips, guides, and car-care advice from professional detailers in Northern New Jersey.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Blog Cards (DEV-CR-008) ── */}
      <Section surface="surface" id="blog-grid">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-bay">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 60} className="h-full">
                {/* Single link wrapping the whole card — no nested anchors */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="block h-full"
                  aria-label={`Read article: ${post.title}`}
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={`blog_${post.slug}`}
                  data-track-context="internal"
                >
                  <GlowCard className="h-full flex flex-col overflow-hidden">
                    {/* Featured Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw"
                        className="object-cover transition-transform duration-base ease-default group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top,rgba(10,10,10,0.6),transparent)',
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col flex-1 p-6 gap-3">
                      {/* Category badge + Date */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.08em] uppercase text-accent bg-accent-soft border border-[rgba(232,5,5,0.2)] rounded-full px-2 py-0.5">
                          <Tag className="w-3 h-3" aria-hidden="true" />
                          {post.category}
                        </span>
                        <time
                          dateTime={post.date}
                          className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint"
                        >
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day:   'numeric',
                            year:  'numeric',
                          })}
                        </time>
                      </div>

                      {/* Title (heading — no nested anchor) */}
                      <p className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-base leading-snug hover:text-accent transition-colors duration-fast">
                        {post.title}
                      </p>

                      {/* Excerpt ≤160 chars */}
                      <p className="text-fg-soft text-sm leading-relaxed flex-1">{post.excerpt}</p>

                      {/* Read more indicator (not a link — card itself is the link) */}
                      <div className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.08em] uppercase text-accent mt-auto min-h-[44px]">
                        Read Article
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── CTA Band ── */}
      <Section surface="surface-dark-2" id="blog-cta">
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2
                className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-3"
                style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}
              >
                Ready to Get Started?
              </h2>
              <p className="text-fg-soft mb-6 leading-relaxed">
                We serve {business.serviceArea}. Get a free, no-obligation quote in{' '}
                {business.responseTime}.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <QuoteButton
                  size="lg"
                  track={{
                    category: 'conversion',
                    action:   'button_click',
                    label:    'blog_cta_get_quote',
                  }}
                />
                <Button
                  href={business.phoneHref}
                  variant="phone"
                  size="lg"
                  track={{ category: 'conversion', action: 'link_click', label: 'phone_call' }}
                >
                  {business.phone}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
