import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { pageMeta, articleLd, breadcrumbLd } from '@/lib/seo';
import { business } from '@/lib/site';
import { getBlogPost, getBlogPosts } from '@/lib/wordpress/posts';
import { blogImageUrl } from '@/lib/wordpress/fallback-images';
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
export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((p) => ({ slug: p.slug }));
}

/** Per-post metadata (DEV-CR-009) */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return pageMeta({
    title:       post.title,
    description: post.excerpt,
    path:        `/blog/${post.slug}`,
    image:       post.featuredImage?.url,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post     = await getBlogPost(slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

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
          <div className="py-bolt">
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
              className="mb-panel -ml-pin"
              track={{ category: 'navigation', action: 'link_click', label: 'blog', context: 'internal' }}
            >
              <ArrowLeft className="w-4 h-4 mr-rivet" aria-hidden="true" />
              Back to Blog
            </Button>
          </Reveal>

          {/* Featured image — lazy (not LCP; hero section below is) */}
          <Reveal delay={40}>
            <div className="relative aspect-[3/1] min-h-[200px] overflow-hidden rounded-lg mb-bay">
              <Image
                src={blogImageUrl(post.slug, post.featuredImage?.url)}
                alt={post.featuredImage?.alt || post.title}
                fill
                sizes="(max-width:768px) 100vw,1200px"
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, var(--overlay) 0%, transparent 60%)',
                }}
                aria-hidden="true"
              />
            </div>
          </Reveal>

          {/* h1, date, category */}
          <Reveal delay={80}>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-bolt mb-gauge">
                <span className="flex items-center gap-rivet font-mono text-mono-sm tracking-label uppercase text-accent bg-accent-soft border border-accent-soft rounded-full px-rivet py-pin">
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  {post.category}
                </span>
                <time
                  dateTime={post.date}
                  className="flex items-center gap-rivet font-mono text-mono-sm tracking-label uppercase text-fg-faint"
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
                className="tracking-tighter text-3xl"
              >
                {post.title}
              </h1>
              <p className="mt-gauge text-fg-soft text-lg leading-relaxed">{post.excerpt}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Article Body ── */}
      <Section surface="surface" id="post-body">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-panel">
              {post.body.map((paragraph, i) => (
                <Reveal key={i} delay={i * 40}>
                  <p className="text-fg-soft leading-relaxed text-base">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* In-article CTA */}
            <Reveal delay={200}>
              <div
                className="mt-stall rounded-lg p-panel md:p-bay bg-cta-gradient"
              >
                <p className="font-mono text-mono-sm tracking-label uppercase text-cta-fg/60 mb-rivet">
                  Northern NJ Mobile Detailing
                </p>
                <h2
                  className="text-cta-fg mb-rivet text-xl"
                >
                  Ready for a Free Quote?
                </h2>
                <p className="text-cta-fg/80 text-sm mb-gauge leading-relaxed">
                  We respond quickly and come to your home, office, or any
                  location in {business.serviceArea}.
                </p>
                <div className="flex flex-wrap gap-bolt">
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
                    className="border-cta-fg/40 text-cta-fg hover:border-cta-fg hover:text-cta-fg"
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
                className="mb-bay text-xl"
              >
                Related Articles
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-bay">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 60}>
                  <GlowCard className="relative flex gap-gauge p-gauge min-h-touch">
                    <div className="relative w-24 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={blogImageUrl(r.slug, r.featuredImage?.url)}
                        alt={r.featuredImage?.alt || r.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-pin min-w-0">
                      <span className="font-mono text-mono-sm tracking-label uppercase text-accent">
                        {r.category}
                      </span>
                      <div className="font-sans font-bold text-sm uppercase tracking-tight text-fg leading-snug">
                        {r.title}
                      </div>
                      <span className="flex items-center gap-pin font-mono text-mono-sm tracking-label uppercase text-fg-faint mt-auto">
                        Read more{' '}
                        <ArrowRight className="w-2.5 h-2.5" aria-hidden="true" />
                      </span>
                    </div>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="absolute inset-0"
                      aria-label={`Read: ${r.title}`}
                      data-track-category="navigation"
                      data-track-action="link_click"
                      data-track-label={`blog_related_${r.slug}`}
                      data-track-context="internal"
                    />
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
