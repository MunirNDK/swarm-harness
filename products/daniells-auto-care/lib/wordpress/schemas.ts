import { z } from 'zod';

/**
 * Raw WordPress REST response shapes — validated before anything touches
 * transforms.ts. Shapes confirmed empirically against the live staging
 * instance (see Implementation Log), not just assumed from docs.
 */

const renderedField = z.object({ rendered: z.string() });

export const wpMediaSchema = z.object({
  id: z.number(),
  source_url: z.string(),
  alt_text: z.string().default(''),
  media_details: z
    .object({ width: z.number().optional(), height: z.number().optional() })
    .optional(),
});

/**
 * Featured media only appears when the request includes `_embed=wp:featuredmedia`
 * (see client.ts). WP nests it as a one-element array; absent entirely if
 * featured_media is 0. Never trust `featured_media_resolved`-style flattened
 * fields — that's not a real WP REST shape.
 *
 * The array element is deliberately `z.unknown()`, not `wpMediaSchema` —
 * WordPress can return a `{code: "rest_forbidden", ...}` error object in
 * that slot instead of real media (observed for real: an attachment
 * cross-linked to a since-deleted post came back 401/forbidden on an
 * unauthenticated request, even though `featured_media` was a valid ID).
 * transforms.ts's toMedia() re-validates each element against
 * `wpMediaSchema` itself and treats a mismatch as "no image" rather than
 * failing the entire page/post — one bad embed must never take down page
 * generation for everything else.
 */
const embeddedFeaturedMedia = z
  .object({ 'wp:featuredmedia': z.array(z.unknown()).optional() })
  .optional();

export const wpServiceSchema = z.object({
  id: z.number(),
  slug: z.string(),
  status: z.string(),
  title: renderedField,
  meta: z.object({
    short_description: z.string().default(''),
    long_description: z.string().default(''),
    icon: z.string().default(''),
    seo_description: z.string().default(''),
    benefits_title: z.string().default(''),
    benefits_subtitle: z.string().default(''),
    benefits: z.array(z.string()).default([]),
    process_title: z.string().default(''),
    process_subtitle: z.string().default(''),
    process_steps: z
      .array(z.object({ title: z.string(), desc: z.string() }))
      .default([]),
    faq_title: z.string().default(''),
    faq_subtitle: z.string().default(''),
    faq_items: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    pricing_title: z.string().default(''),
    pricing_subtitle: z.string().default(''),
    // `includes` is a single newline-delimited textarea in wp-admin (the
    // repeater_object model only supports flat string subfields); transforms.ts
    // splits it into a string[] on the way out.
    pricing_tiers: z
      .array(
        z.object({
          name: z.string().default(''),
          price: z.string().default(''),
          meta: z.string().default(''),
          badge: z.string().default(''),
          includes: z.string().default(''),
        })
      )
      .default([]),
    pricing_note: z.string().default(''),
    addons_title: z.string().default(''),
    addons: z
      .array(
        z.object({
          name: z.string().default(''),
          price: z.string().default(''),
          price_type: z.string().default(''),
          details: z.string().default(''),
        })
      )
      .default([]),
  }),
  related_service_area_slugs: z.array(z.string()).default([]),
  _embedded: embeddedFeaturedMedia,
});

export const wpServiceAreaSchema = z.object({
  id: z.number(),
  slug: z.string(),
  status: z.string(),
  title: renderedField,
  meta: z.object({
    local_introduction: z.string().default(''),
    seo_description: z.string().default(''),
  }),
  related_service_slugs: z.array(z.string()).default([]),
});

export const wpPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  status: z.string(),
  title: renderedField,
  excerpt: renderedField,
  content: renderedField,
  date: z.string(),
  modified: z.string(),
  _embedded: z
    .object({
      'wp:featuredmedia': z.array(z.unknown()).optional(), // see embeddedFeaturedMedia comment above
      'wp:term': z
        .array(z.array(z.object({ name: z.string(), taxonomy: z.string() })))
        .optional(),
    })
    .optional(),
});

export const wpPageSchema = z.object({
  id: z.number(),
  slug: z.string(),
  status: z.string(),
  title: renderedField,
  content: renderedField,
  modified: z.string(),
});
