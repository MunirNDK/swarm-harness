import { wpFetch } from './client';
import { wpServiceAreaSchema } from './schemas';
import { TAGS } from './tags';
import { transformServiceArea } from './transforms';
import type { ServiceArea } from './types';
import { WordPressValidationError } from './errors';

export async function getServiceAreas(): Promise<ServiceArea[]> {
  const raw = await wpFetch<unknown[]>(
    '/wp-json/wp/v2/service-areas?per_page=100&orderby=title&order=asc',
    { tags: [TAGS.serviceAreas] }
  );
  return raw.map((item) => {
    const parsed = wpServiceAreaSchema.safeParse(item);
    if (!parsed.success) {
      throw new WordPressValidationError('Invalid service area payload from WordPress', parsed.error.issues);
    }
    return transformServiceArea(parsed.data);
  });
}

export async function getServiceArea(slug: string): Promise<ServiceArea | null> {
  const raw = await wpFetch<unknown[]>(
    `/wp-json/wp/v2/service-areas?slug=${encodeURIComponent(slug)}`,
    { tags: [TAGS.serviceArea(slug)] }
  );
  if (raw.length === 0) return null;
  const parsed = wpServiceAreaSchema.safeParse(raw[0]);
  if (!parsed.success) {
    throw new WordPressValidationError('Invalid service area payload from WordPress', parsed.error.issues);
  }
  return transformServiceArea(parsed.data);
}
