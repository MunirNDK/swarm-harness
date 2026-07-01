import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { pageMeta, articleLd, breadcrumbLd } from '@/lib/seo';
import { business } from '@/lib/site';
import { blogPosts, getBlogPost } from '@/lib/blog';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { GlowCard } from '@/components/ui/glow-card';
import { Reveal } from '@/components/ui/reveal';
import { JsonLd } from '@/components/ui/jsonld';
import { Button } from '@/components/ui/button';
import { QuoteButton } from '@/components/quote-modal';
import { TrustMarquee } from '@/components/trust-marquee';

/** SSG: generate all blog routes at build time */
export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

/** Per-post metadata (DEV-CR-009) */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return pageMeta({
    title:       post.title,
    description: post.excerpt,
    path:        `/blog/${post.slug}`,
    image:       post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post     = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const BREADCRUMBS = [
    { label: 'Home',    href: '/' },
    { label: 'Blog',    href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            title:         post.title,
            description:   post.excerpt,
            slug:          post.slug,
            datePublished: post.date,
          }),
          breadcrumbLd(BREADCRUMBS),
        ]}
      />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-3">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Article Header (DEV-CR-009) ── */}
      <Section surface="bg" id="post-header">
        <Container>
          {/* Back link */}
          <Reveal>
            <Button
              href="/blog"
              variant="ghost"
              size="sm"
              className="mb-6 -ml-1"
              track={{ category: 'navigation', action: 'link_click', label: 'blog', context: 'internal' }}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Back to Blog
            </Button>
          </Reveal>

          {/* Featured image — lazy (not LCP; hero section below is) */}
          <Reveal delay={40}>
            <div className="relative aspect-[3/1] min-h-[200px] overflow-hidden rounded-lg mb-8">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width:768px) 100vw,1200px"
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top,rgba(10,10,10,0.75) 0%,transparent 60%)',
                }}
                aria-hidden="true"
              />
            </div>
          </Reveal>

          {/* h1, date, category */}
          <Reveal delay={80}>
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
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
                    month: 'long',
                    day:   'numeric',
                    year:  'numeric',
                  })}
                </time>
              </div>

              <h1
                className="font-sans font-bold uppercase tracking-[-0.02em] text-fg"
                style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', lineHeight: '1.1' }}
              >
                {post.title}
              </h1>
              <p className="mt-4 text-fg-soft text-lg leading-relaxed">{post.excerpt}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Article Body ── */}
      <Section surface="surface" id="post-body">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {post.body.map((paragraph, i) => (
                <Reveal key={i} delay={i * 40}>
                  <p className="text-fg-soft leading-[1.8] text-base">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* In-article CTA */}
            <Reveal delay={200}>
              <div
                className="mt-12 rounded-lg p-6 md:p-8"
                style={{ background: 'linear-gradient(135deg,#E80505,#980404)' }}
              >
                <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-fg/60 mb-2">
                  Northern NJ Mobile Detailing
                </p>
                <h2
                  className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-2 text-xl"
                >
                  Ready for a Free Quote?
                </h2>
                <p className="text-fg/80 text-sm mb-4 leading-relaxed">
                  We respond within {business.responseTime} and come to your home, office, or any
                  location in {business.serviceArea}.
                </p>
                <div className="flex flex-wrap gap-3">
                  <QuoteButton
                    size="md"
                    track={{
                      category: 'conversion',
                      action:   'button_click',
                      label:    'blog_post_cta_get_quote',
                    }}
                  />
                  <Button
                    href={business.phoneHref}
                    variant="outline"
                    size="md"
                    className="border-fg/40 text-fg hover:border-fg"
                    track={{ category: 'conversion', action: 'link_click', label: 'phone_call' }}
                  >
                    {business.phone}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <Section surface="bg" id="related-posts">
          <Container>
            <Reveal>
              <h2
                className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-8"
                style={{ fontSize: 'clamp(1.25rem,2vw,1.75rem)' }}
              >
                Related Articles
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-bay">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 60}>
                  <GlowCard className="flex gap-4 p-4 min-h-[44px]">
                    <div className="relative w-24 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={r.image}
                        alt={r.imageAlt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-mono text-[0.6rem] tracking-[0.08em] uppercase text-accent">
                        {r.category}
                      </span>
                      <Link
                        href={`/blog/${r.slug}`}
                        className="font-sans font-bold text-sm uppercase tracking-tight text-fg hover:text-accent transition-colors duration-fast leading-snug"
                        data-track-category="navigation"
                        data-track-action="link_click"
                        data-track-label={`blog_related_${r.slug}`}
                        data-track-context="internal"
                      >
                        {r.title}
                      </Link>
                      <span className="flex items-center gap-1 font-mono text-[0.6rem] tracking-[0.08em] uppercase text-fg-faint mt-auto">
                        Read more{' '}
                        <ArrowRight className="w-2.5 h-2.5" aria-hidden="true" />
                      </span>
                    </div>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── Trust Marquee ── */}
      <TrustMarquee />
    </>
  );
}
