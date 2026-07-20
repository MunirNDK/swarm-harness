import type { z } from 'zod';
import type { BlogPost, LegalPage, Media, Service, ServiceArea } from './types';
import type {
  wpPageSchema,
  wpPostSchema,
  wpServiceAreaSchema,
  wpServiceSchema,
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

function toMedia(embedded?: {
  'wp:featuredmedia'?: Array<{
    id: number;
    source_url: string;
    alt_text: string;
    media_details?: { width?: number; height?: number };
  }>;
}): Media | null {
  const m = embedded?.['wp:featuredmedia']?.[0];
  if (!m) return null;
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
