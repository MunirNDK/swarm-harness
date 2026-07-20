import { wpFetch } from './client';
import { wpServiceSchema } from './schemas';
import { TAGS } from './tags';
import { transformService } from './transforms';
import type { Service } from './types';
import { WordPressValidationError } from './errors';

export async function getServices(): Promise<Service[]> {
  const raw = await wpFetch<unknown[]>(
    '/wp-json/wp/v2/services?per_page=100&_embed=wp:featuredmedia&orderby=title&order=asc',
    { tags: [TAGS.services] }
  );
  return raw.map((item) => {
    const parsed = wpServiceSchema.safeParse(item);
    if (!parsed.success) {
      throw new WordPressValidationError('Invalid service payload from WordPress', parsed.error.issues);
    }
    return transformService(parsed.data);
  });
}

export async function getService(slug: string): Promise<Service | null> {
  const raw = await wpFetch<unknown[]>(
    `/wp-json/wp/v2/services?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`,
    { tags: [TAGS.service(slug)] }
  );
  if (raw.length === 0) return null;
  const parsed = wpServiceSchema.safeParse(raw[0]);
  if (!parsed.success) {
    throw new WordPressValidationError('Invalid service payload from WordPress', parsed.error.issues);
  }
  return transformService(parsed.data);
}
