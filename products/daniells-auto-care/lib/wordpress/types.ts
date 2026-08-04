/**
 * Frontend contract types — normalized shapes Next.js components consume.
 * Never the raw WordPress REST shape; see transforms.ts for the mapping.
 * Source of truth: docs/headless-cms-schema-contract.md §7.
 */

export interface Media {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ProcessStep {
  title: string;
  desc: string;
}

export interface PricingTier {
  name: string;
  price: string;
  /** null => no small descriptor line under the name */
  meta: string | null;
  /** null => no accent badge pill (e.g. "Most Popular") */
  badge: string | null;
  includes: string[];
}

export interface Addon {
  name: string;
  price: string;
  priceType: string;
  details: string;
}

export interface Service {
  slug: string;
  name: string;
  featuredImage: Media | null;
  shortDescription: string;
  longDescription: string;
  icon: string;
  /** null => caller falls back to the "{name} Package" template */
  benefitsTitle: string | null;
  benefitsSubtitle: string | null;
  benefits: string[];
  /** null => caller falls back to the "How We Deliver {name}" template */
  processTitle: string | null;
  processSubtitle: string | null;
  processSteps: ProcessStep[];
  /** null => caller falls back to the "{name} Questions" template */
  faqTitle: string | null;
  faqSubtitle: string | null;
  faqItems: FaqItem[];
  /** null => caller falls back to the "Packages & Pricing" template */
  pricingTitle: string | null;
  pricingSubtitle: string | null;
  /** Empty => pricing section is not rendered at all */
  pricingTiers: PricingTier[];
  /** null => no fine-print line under the pricing tiers */
  pricingNote: string | null;
  /** null => caller falls back to the "Popular Add-Ons" template */
  addonsTitle: string | null;
  /** Empty => add-ons section is not rendered at all */
  addons: Addon[];
  seoDescription: string;
  /** Empty => caller falls back to "all areas" (matches pre-CMS behavior) */
  relatedServiceAreaSlugs: string[];
}

export interface ServiceArea {
  slug: string;
  name: string;
  /** null => caller falls back to the areaIntro(name) template */
  localIntroduction: string | null;
  seoDescription: string | null;
  /** Empty => caller falls back to "all services" (matches pre-CMS behavior) */
  relatedServiceSlugs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO 8601
  modifiedDate: string; // ISO 8601
  category: string;
  featuredImage: Media | null;
  body: string[]; // paragraphs
}

export interface LegalPage {
  slug: 'privacy' | 'terms';
  title: string;
  contentHtml: string;
  lastModified: string; // ISO 8601
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}
