import type { Metadata } from 'next';
import { business, siteUrl, areas, services, stats, faqs } from '@/lib/site';

/* ═══════════════════════════════════════════════════════════════
   PAGE META — Next.js Metadata API helper
   Contract §7 / §10
   ═══════════════════════════════════════════════════════════════ */

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function pageMeta({
  title,
  description,
  path,
  image,
}: PageMetaOptions): Metadata {
  const url     = `${siteUrl}${path}`;
  const ogImage = image ?? '/assets/og.webp';

  // Normalize: strip any brand suffix a caller may have included, then append it
  // exactly once. `title.absolute` bypasses the root layout template so root and
  // nested pages are consistent (Next applies templates only to nested segments).
  const base      = title.replace(/\s*[|–—-]\s*Daniells Auto Care\s*$/i, '').trim();
  const fullTitle = `${base} | ${business.name}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title:    fullTitle,
      description,
      url,
      siteName: business.name,
      locale:   'en_US',
      type:     'website',
      images: [
        {
          url:    `${siteUrl}${ogImage}`,
          width:  1200,
          height: 630,
          alt:    fullTitle,
        },
      ],
    },
    twitter: {
      card:        'summary_large_image',
      title:       fullTitle,
      description,
      images:      [`${siteUrl}${ogImage}`],
    },
  };
}

/* ═══════════════════════════════════════════════════════════════
   JSON-LD BUILDER FUNCTIONS — plain objects, no JSX
   Contract §7 / §10
   ═══════════════════════════════════════════════════════════════ */

export function localBusinessLd(): object {
  return {
    '@context':   'https://schema.org',
    '@type':      ['AutoDetailing', 'LocalBusiness'],
    name:         business.name,
    telephone:    business.phone,
    url:          siteUrl,
    description:  business.tagline,
    areaServed:   areas.map((a) => ({ '@type': 'City', name: a })),
    sameAs:       [],
    openingHours: 'Mo-Su 00:00-24:00',
    priceRange:   '$$',
    aggregateRating: {
      '@type':       'AggregateRating',
      ratingValue:   5,
      bestRating:    5,
      worstRating:   1,
      reviewCount:   300,
    },
  };
}

export function organizationLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       business.name,
    url:        siteUrl,
    telephone:  business.phone,
    logo:       `${siteUrl}/assets/logo.webp`,
  };
}

interface ServiceLdInput {
  name: string;
  description: string;
  slug: string;
}

export function serviceLd(service: ServiceLdInput, areaName?: string): object {
  const base = {
    '@context':    'https://schema.org',
    '@type':       'Service',
    name:          service.name,
    description:   service.description,
    url:           `${siteUrl}/services/${service.slug}`,
    provider: {
      '@type': 'LocalBusiness',
      name:    business.name,
      url:     siteUrl,
    },
    areaServed: areaName
      ? { '@type': 'City', name: areaName }
      : areas.map((a) => ({ '@type': 'City', name: a })),
  };
  return base;
}

interface FaqItem {
  q: string;
  a: string;
}

export function faqLd(items: FaqItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name:    item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    item.a,
      },
    })),
  };
}

interface ArticleLdInput {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
}

export function articleLd(post: ArticleLdInput): object {
  return {
    '@context':     'https://schema.org',
    '@type':        'Article',
    headline:       post.title,
    description:    post.description,
    url:            `${siteUrl}/blog/${post.slug}`,
    datePublished:  post.datePublished,
    dateModified:   post.dateModified ?? post.datePublished,
    author: {
      '@type': 'Organization',
      name:    business.name,
    },
    publisher: {
      '@type': 'Organization',
      name:    business.name,
      logo: {
        '@type': 'ImageObject',
        url:     `${siteUrl}/assets/logo.webp`,
      },
    },
  };
}

export interface BreadcrumbItem {
  label: string;
  href:  string;
}

export function breadcrumbLd(items: BreadcrumbItem[]): object {
  return {
    '@context':  'https://schema.org',
    '@type':     'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type':   'ListItem',
      position:  idx + 1,
      name:      item.label,
      item:      `${siteUrl}${item.href}`,
    })),
  };
}

/* Re-export commonly-used site data for convenience */
export { stats, faqs, services, areas };
