import type { MetadataRoute } from 'next';
import { siteUrl, services, areas } from '@/lib/site';
import { blogPosts } from '@/lib/blog';

/**
 * app/sitemap.ts — Contract §7 / SEO rules
 * Covers: all static pages + dynamic service / area / blog routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /* ── Static pages ─────────────────────────────────────── */
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url:             siteUrl,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        1.0,
    },
    {
      url:             `${siteUrl}/services`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${siteUrl}/service-areas`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${siteUrl}/fleet`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.8,
    },
    {
      url:             `${siteUrl}/gallery`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.7,
    },
    {
      url:             `${siteUrl}/contact`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.8,
    },
    {
      url:             `${siteUrl}/team`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.5,
    },
    {
      url:             `${siteUrl}/blog`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        0.7,
    },
    {
      url:             `${siteUrl}/privacy`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.3,
    },
    {
      url:             `${siteUrl}/terms`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.3,
    },
  ];

  /* ── Service detail pages ─────────────────────────────── */
  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url:             `${siteUrl}/services/${s.slug}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.85,
  }));

  /* ── Service-area detail pages ───────────────────────── */
  const areaEntries: MetadataRoute.Sitemap = areas.map((area) => ({
    url:             `${siteUrl}/service-areas/${area.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }));

  /* ── Blog post pages ─────────────────────────────────── */
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url:             `${siteUrl}/blog/${post.slug}`,
    lastModified:    new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority:        0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...areaEntries, ...blogEntries];
}
