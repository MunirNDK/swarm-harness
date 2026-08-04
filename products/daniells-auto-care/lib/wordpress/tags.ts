/** Cache tag naming — must match the revalidate route and the WP webhook payload. Spec §7.1. */

export const TAGS = {
  services: 'services',
  service: (slug: string) => `service:${slug}`,
  serviceAreas: 'service-areas',
  serviceArea: (slug: string) => `service-area:${slug}`,
  posts: 'posts',
  post: (slug: string) => `post:${slug}`,
  page: (slug: string) => `page:${slug}`,
} as const;

const CONTENT_TYPE_TO_TAGS: Record<string, (slug: string) => string[]> = {
  service: (slug) => [TAGS.services, TAGS.service(slug)],
  service_area: (slug) => [TAGS.serviceAreas, TAGS.serviceArea(slug)],
  post: (slug) => [TAGS.posts, TAGS.post(slug)],
  page: (slug) => [TAGS.page(slug)],
};

/** Maps a WP webhook payload's contentType to the Next.js cache tags to invalidate. */
export function tagsForContentType(contentType: string, slug: string): string[] {
  return CONTENT_TYPE_TO_TAGS[contentType]?.(slug) ?? [];
}
