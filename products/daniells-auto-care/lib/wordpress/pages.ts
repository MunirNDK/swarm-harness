import { wpFetch } from './client';
import { wpPageSchema } from './schemas';
import { TAGS } from './tags';
import { transformPage } from './transforms';
import type { LegalPage } from './types';
import { WordPressValidationError } from './errors';

export async function getLegalPage(slug: 'privacy' | 'terms'): Promise<LegalPage | null> {
  const raw = await wpFetch<unknown[]>(`/wp-json/wp/v2/pages?slug=${slug}`, {
    tags: [TAGS.page(slug)],
  });
  if (raw.length === 0) return null;
  const parsed = wpPageSchema.safeParse(raw[0]);
  if (!parsed.success) {
    throw new WordPressValidationError('Invalid page payload from WordPress', parsed.error.issues);
  }
  return transformPage(parsed.data, slug);
}
