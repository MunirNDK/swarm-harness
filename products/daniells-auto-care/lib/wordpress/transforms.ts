import { z } from 'zod';
import type { BlogPost, LegalPage, Media, Service, ServiceArea } from './types';
import {
  wpMediaSchema,
  type wpPageSchema,
  type wpPostSchema,
  type wpServiceAreaSchema,
  type wpServiceSchema,
} from './schemas';

function decodeEntities(html: string): string {
  // WP renders titles/excerpts with HTML entities (e.g. &amp;). Minimal
  // decode for the handful that actually show up in this content — not a
  // general HTML sanitizer (content fields keep their HTML for dangerouslySetInnerHTML).
  return html
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, '’')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—');
}

/**
 * The embedded featured-media slot is `z.unknown()` at the schema level —
 * WordPress can put a `{code: "rest_forbidden", ...}` error object there
 * instead of real media (seen for real in production: an attachment
 * cross-linked to a deleted post came back 401 on an unauthenticated
 * request). Re-validate here and treat a mismatch as "no image" rather
 * than letting one bad embed take down the whole page.
 */
function toMedia(embedded?: { 'wp:featuredmedia'?: unknown[] }): Media | null {
  const parsed = wpMediaSchema.safeParse(embedded?.['wp:featuredmedia']?.[0]);
  if (!parsed.success) return null;
  const m = parsed.data;
  return {
    id: m.id,
    url: m.source_url,
    alt: m.alt_text,
    width: m.media_details?.width ?? 0,
    height: m.media_details?.height ?? 0,
  };
}

export function transformService(raw: z.infer<typeof wpServiceSchema>): Service {
  return {
    slug: raw.slug,
    name: decodeEntities(raw.title.rendered),
    featuredImage: toMedia(raw._embedded),
    shortDescription: raw.meta.short_description,
    longDescription: raw.meta.long_description,
    icon: raw.meta.icon,
    benefitsTitle: raw.meta.benefits_title || null,
    benefitsSubtitle: raw.meta.benefits_subtitle || null,
    benefits: raw.meta.benefits,
    processTitle: raw.meta.process_title || null,
    processSubtitle: raw.meta.process_subtitle || null,
    processSteps: raw.meta.process_steps,
    faqTitle: raw.meta.faq_title || null,
    faqSubtitle: raw.meta.faq_subtitle || null,
    faqItems: raw.meta.faq_items,
    seoDescription: raw.meta.seo_description,
    relatedServiceAreaSlugs: raw.related_service_area_slugs,
  };
}

export function transformServiceArea(raw: z.infer<typeof wpServiceAreaSchema>): ServiceArea {
  return {
    slug: raw.slug,
    name: decodeEntities(raw.title.rendered),
    localIntroduction: raw.meta.local_introduction || null,
    seoDescription: raw.meta.seo_description || null,
    relatedServiceSlugs: raw.related_service_slugs,
  };
}

export function transformPost(raw: z.infer<typeof wpPostSchema>): BlogPost {
  const category = raw._embedded?.['wp:term']?.[0]?.find((t) => t.taxonomy === 'category');
  return {
    slug: raw.slug,
    title: decodeEntities(raw.title.rendered),
    excerpt: decodeEntities(raw.excerpt.rendered).replace(/<[^>]+>/g, '').trim(),
    date: raw.date,
    modifiedDate: raw.modified,
    category: category?.name ?? 'Detailing Tips',
    featuredImage: toMedia(raw._embedded),
    body: raw.content.rendered
      .split(/<\/p>\s*<p>|^<p>|<\/p>$/)
      .map((p) => p.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean),
  };
}

export function transformPage(raw: z.infer<typeof wpPageSchema>, slug: 'privacy' | 'terms'): LegalPage {
  return {
    slug,
    title: decodeEntities(raw.title.rendered),
    contentHtml: raw.content.rendered,
    lastModified: raw.modified,
  };
}
