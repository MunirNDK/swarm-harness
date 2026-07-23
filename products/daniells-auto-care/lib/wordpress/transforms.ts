import { z } from 'zod';
import { servicePricing } from '../site';
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
    ...transformPricing(raw),
    seoDescription: raw.meta.seo_description,
    relatedServiceAreaSlugs: raw.related_service_area_slugs,
  };
}

/**
 * Pricing/add-ons mapping with a code-owned fallback. WordPress is the source
 * of truth once its `pricing_*` meta is populated (via the migration), but
 * until then we fall back to the `servicePricing` seed keyed by slug — the
 * same "WP wins, else fall back to code" pattern already used for featured
 * images (see toMedia / fallback-images.ts). `includes` is stored in wp-admin
 * as one newline-delimited textarea and split back into a list here.
 */
function transformPricing(
  raw: z.infer<typeof wpServiceSchema>
): Pick<
  Service,
  'pricingTitle' | 'pricingSubtitle' | 'pricingTiers' | 'pricingNote' | 'addonsTitle' | 'addons'
> {
  const wpTiers = raw.meta.pricing_tiers.map((t) => ({
    name: t.name,
    price: t.price,
    meta: t.meta || null,
    badge: t.badge || null,
    includes: t.includes
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
  }));

  const seed = servicePricing[raw.slug];
  const useSeed = wpTiers.length === 0 && Boolean(seed);

  if (useSeed && seed) {
    return {
      pricingTitle: raw.meta.pricing_title || null,
      pricingSubtitle: raw.meta.pricing_subtitle || null,
      pricingTiers: seed.tiers.map((t) => ({
        name: t.name,
        price: t.price,
        meta: t.meta || null,
        badge: t.badge || null,
        includes: t.includes,
      })),
      pricingNote: raw.meta.pricing_note || seed.note || null,
      addonsTitle: raw.meta.addons_title || null,
      addons: seed.addons.map((a) => ({
        name: a.name,
        price: a.price,
        priceType: a.priceType,
        details: a.details,
      })),
    };
  }

  return {
    pricingTitle: raw.meta.pricing_title || null,
    pricingSubtitle: raw.meta.pricing_subtitle || null,
    pricingTiers: wpTiers,
    pricingNote: raw.meta.pricing_note || null,
    addonsTitle: raw.meta.addons_title || null,
    addons: raw.meta.addons.map((a) => ({
      name: a.name,
      price: a.price,
      priceType: a.price_type,
      details: a.details,
    })),
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
