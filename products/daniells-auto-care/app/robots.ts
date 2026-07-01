import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * app/robots.ts — Contract §7 / SEO robots-txt rules
 * Allow all crawlers; point to sitemap; set canonical host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow:     '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host:    siteUrl,
  };
}
