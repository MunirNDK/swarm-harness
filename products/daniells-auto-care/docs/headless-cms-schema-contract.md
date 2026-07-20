# Headless WordPress Schema Contract — Daniells Auto Care

Phase 2 deliverable per `headless-wordpress-nextjs-orchestrator-context.md`.
Source of truth for both the WordPress plugin (Phase 3) and the Next.js
`lib/wordpress/` client (Phase 4). Any change here must be reflected in both
sides — see `Headless CMS Implementation Log.md` at the repo root for the
discovery this is based on and any deviations made after this was written.

Field lists are scoped to what the existing Next.js templates actually
render (per Phase 1 discovery), not the full generic list in the spec doc —
no field exists here that isn't used somewhere in `products/daniells-auto-care`.

---

## 1. Post types

| Content | Post type | `rest_base` | Owner |
|---|---|---|---|
| Services | `service` (custom) | `services` | site-headless-integration plugin |
| Service areas | `service_area` (custom) | `service-areas` | site-headless-integration plugin |
| Blog posts | native `post` | `posts` | WordPress core |
| Legal pages (privacy, terms) | native `page` | `pages` | WordPress core |

Both custom CPTs registered via plain `register_post_type()` in plugin PHP
(not JetEngine's post-type module — see Implementation Log architecture
decision). `show_in_rest: true`, `supports: ['title','editor','excerpt','thumbnail','revisions']`.

`service` has no archive-relevant taxonomy. `service_area` has none either —
both are flat lists today (9 services, 10 areas), consistent with current
`lib/site.ts`.

---

## 2. `service` fields

All custom fields registered via `register_post_meta()` with
`show_in_rest` (schema below), editable in wp-admin as plain custom fields
(optionally wrapped in a JetEngine Meta Box later for a nicer editor UI —
cosmetic only, not the source of truth).

| Field | Type | Maps to (current lib/site.ts) | Notes |
|---|---|---|---|
| `title` (native) | string | `name` | |
| `slug` (native) | string | `slug` | **must be preserved exactly** — it's the live URL segment (`/services/{slug}`); this is the `migration_source_id` equivalent for services (see §6) |
| `featured_media` (native) | int (attachment ID) | `image` | |
| `short_description` | string | `short` | used by `ServiceCard` on listing pages |
| `long_description` | string (rich) | `long` | hero paragraph + `serviceLd()` JSON-LD description |
| `icon` | string | `icon` | lucide-react icon name; Next.js keeps the icon→component map in code (spec allows code-owned mapping tables) |
| `benefits` | array\<string\> | `benefits[]` | rendered conditionally if non-empty |
| `process_steps` | array\<{title, desc}\> | `process[]` | rendered conditionally if non-empty |
| `faq_items` | array\<{q, a}\> | `faq[]` | rendered conditionally if non-empty; also feeds `faqLd()` |
| `seo_description` | string | `metaDescription` | used only in `generateMetadata`, never rendered on-page |
| `related_service_areas` | relationship → `service_area[]` | *(none today)* | new: JetEngine relation, see §5 |

Not carried over as a field: `service.slug`-derived related-services list —
stays **computed** in Next.js (`services.filter(s => s.slug !== current)`),
matching current behavior; no need to store it in WP.

---

## 3. `service_area` fields

| Field | Type | Maps to (current lib/site.ts) | Notes |
|---|---|---|---|
| `title` (native) | string | town name (`areas[]` entries are plain strings today) | |
| `slug` (native) | string | `slugify(town)` (computed client-side today) | **must be preserved exactly** — becomes the real stored slug instead of a runtime-computed one |
| `local_introduction` | string (rich) | *(none — currently only the generic `areaIntro(town)` template sentence)* | **new content field, empty by default.** Per spec §5.3, do not auto-generate town-specific claims during migration — leave blank/use the existing generic sentence as a Next.js fallback until the owner writes real per-area copy |
| `seo_description` | string | *(none — computed inline in `generateMetadata`)* | optional; falls back to computed string if empty |
| `related_services` | relationship → `service[]` | *(none — every area shows all services today)* | new: JetEngine relation, see §5. Until populated, Next.js should fall back to "all services" to match current behavior exactly |

---

## 4. Blog posts (native `post`) and legal pages (native `page`)

Blog: direct 1:1 migration of `lib/blog.ts`'s `BlogPost` shape onto native
WP fields — `title`→title, `slug`→slug, `excerpt`→excerpt, `date`→`date`
(native publish date), `category`→WP category taxonomy term, `image`+`imageAlt`
→featured media + its attachment alt text, `body[]` (paragraph array)→
`content` (each array entry becomes one paragraph block). No custom meta
needed; this is the one content type with no existing schema gap.

Legal pages: native WP page, `post_content` = the existing hardcoded prose
(migrated once, then owner-editable), `post_modified` native date replaces
the current hardcoded `LAST_UPDATED` constant.

---

## 5. Relationships

Single relationship, many-to-many: **`service` ↔ `service_area`**, via
JetEngine's Relations module (spec §4.3 explicitly allows JetEngine for
relationships; see Implementation Log for the full architecture decision).

Until an admin actually sets relationships in wp-admin, both sides default
to "show everything" in the Next.js normalizer layer, to exactly match
today's hardcoded behavior (every service page currently links all 10
areas; every area page currently shows all 9 services).

---

## 6. Migration identifiers

No separate `migration_source_id` meta field is needed for `service` /
`service_area` — **the slug itself is stable and already the canonical
identifier** (it's the live URL segment today, sourced directly from
`lib/site.ts`'s `slug` field / the town name). Migration scripts upsert by
slug, not by an opaque ID. Blog posts use their existing `slug` the same way.

---

## 7. Frontend contract (TypeScript, `src/lib/wordpress/types.ts` — Phase 4)

```ts
export interface Media {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface FaqItem { q: string; a: string; }
export interface ProcessStep { title: string; desc: string; }

export interface Service {
  slug: string;
  name: string;
  featuredImage: Media | null;
  shortDescription: string;
  longDescription: string;
  icon: string;
  benefits: string[];
  processSteps: ProcessStep[];
  faqItems: FaqItem[];
  seoDescription: string;
  relatedServiceAreaSlugs: string[]; // empty => caller falls back to "all areas"
}

export interface ServiceArea {
  slug: string;
  name: string;
  localIntroduction: string | null; // null => caller falls back to areaIntro(name) template
  seoDescription: string | null;
  relatedServiceSlugs: string[]; // empty => caller falls back to "all services"
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO 8601
  category: string;
  featuredImage: Media;
  body: string[]; // paragraphs
}

export interface LegalPage {
  slug: 'privacy' | 'terms';
  title: string;
  contentHtml: string;
  lastModified: string; // ISO 8601, from WP post_modified
}
```

Runtime validation (Zod, added in Phase 4) mirrors these interfaces exactly
and rejects/logs any WP response that doesn't match — per spec §6.2.

---

## 8. Deliberately out of scope for this pass

- **Team members** (`lib/site.ts` `team[]`) — low-churn (6 people, name/role/
  image only), no individual pages reference them beyond the team grid.
  Candidate for a JetEngine Options Page repeater later, but not required
  for the integration to function; stays code-owned for now per spec §10.1
  ("remain in Next.js source only when... unsuitable for editorial
  management" — revisit if the owner wants to edit staff without a deploy).
- **Reviews** (`lib/site.ts` `reviews[]`) — sourced from Google, not
  hand-authored; out of scope unless the owner wants manual curation in WP.
- **Homepage sections, nav, footer, business info** (`business`, `nav`,
  `stats`, `whyChooseUs`, `processSteps`, `social`) — global site
  configuration, not per-item editorial content. Could become a JetEngine
  Options Page later (spec allows this) but isn't required by the "services/
  service-areas/blog become manageable" success criteria in spec §1.
- **Fleet/Team/Gallery page-specific hardcoded arrays** (`CREDENTIALS`,
  `BENEFITS`, `TIERS` in `app/team`/`app/fleet`) — flagged in the
  Implementation Log as existing hardcoded content, not part of this pass's
  CPT design. Same reasoning as team members above.
