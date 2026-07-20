import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { getServices } from '@/lib/wordpress/services';
import { getServiceAreas } from '@/lib/wordpress/service-areas';
import { getBlogPosts } from '@/lib/wordpress/posts';

/**
 * app/sitemap.ts — Contract §7 / SEO rules
 * Covers: all static pages + dynamic service / area / blog routes, sourced
 * from WordPress so published/unpublished state is always current — spec
 * §1: "Removing or unpublishing an item must remove it from relevant
 * listings after cache invalidation."
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const [services, areas, blogPosts] = await Promise.all([
    getServices(),
    getServiceAreas(),
    getBlogPosts(),
  ]);

  /* ── Service detail pages ─────────────────────────────── */
  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url:             `${siteUrl}/services/${s.slug}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.85,
  }));

  /* ── Service-area detail pages ───────────────────────── */
  const areaEntries: MetadataRoute.Sitemap = areas.map((area) => ({
    url:             `${siteUrl}/service-areas/${area.slug}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }));

  /* ── Blog post pages ─────────────────────────────────── */
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url:             `${siteUrl}/blog/${post.slug}`,
    lastModified:    new Date(post.modifiedDate || post.date),
    changeFrequency: 'yearly' as const,
    priority:        0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...areaEntries, ...blogEntries];
}
