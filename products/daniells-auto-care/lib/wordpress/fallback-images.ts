/**
 * Local fallback images, keyed by slug — used only when a service/post has
 * no WordPress featured image set yet. Restores the pre-CMS behavior where
 * every service/post had its own distinct image, instead of every one
 * falling back to the same generic hero image once a featured image isn't
 * set. Once real featured images are uploaded in WordPress, those take
 * priority automatically (see transforms.ts / the *ImageUrl helpers below).
 */

export const SERVICE_FALLBACK_IMAGES: Record<string, string> = {
  'car-detailing': '/assets/services/car-detailing.webp',
  'exterior-detailing': '/assets/services/exterior-detailing.webp',
  'interior-detailing': '/assets/services/interior-detailing.webp',
  'ceramic-coating': '/assets/services/ceramic-coating.webp',
  'paint-correction': '/assets/services/paint-correction.webp',
  'paint-protection-film': '/assets/services/paint-protection-film.webp',
  'window-tinting': '/assets/services/window-tinting.webp',
  'fleet-detailing': '/assets/services/fleet-detailing.webp',
};

export const BLOG_FALLBACK_IMAGES: Record<string, string> = {
  'how-often-should-you-detail-your-car': '/assets/services/car-detailing.webp',
  'ceramic-coating-vs-wax': '/assets/services/ceramic-coating.webp',
  'preparing-your-car-for-nj-winter': '/assets/services/exterior-detailing.webp',
};

const DEFAULT_FALLBACK = '/assets/hero.webp';

export function serviceImageUrl(slug: string, featuredUrl: string | undefined | null): string {
  return featuredUrl ?? SERVICE_FALLBACK_IMAGES[slug] ?? DEFAULT_FALLBACK;
}

export function blogImageUrl(slug: string, featuredUrl: string | undefined | null): string {
  return featuredUrl ?? BLOG_FALLBACK_IMAGES[slug] ?? DEFAULT_FALLBACK;
}
