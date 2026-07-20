import { wpFetch } from './client';
import { wpPostSchema } from './schemas';
import { TAGS } from './tags';
import { transformPost } from './transforms';
import type { BlogPost } from './types';
import { WordPressValidationError } from './errors';

export async function getBlogPosts(): Promise<BlogPost[]> {
  const raw = await wpFetch<unknown[]>(
    '/wp-json/wp/v2/posts?per_page=100&_embed=wp:featuredmedia,wp:term&orderby=date&order=desc',
    { tags: [TAGS.posts] }
  );
  return raw.map((item) => {
    const parsed = wpPostSchema.safeParse(item);
    if (!parsed.success) {
      throw new WordPressValidationError('Invalid post payload from WordPress', parsed.error.issues);
    }
    return transformPost(parsed.data);
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const raw = await wpFetch<unknown[]>(
    `/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`,
    { tags: [TAGS.post(slug)] }
  );
  if (raw.length === 0) return null;
  const parsed = wpPostSchema.safeParse(raw[0]);
  if (!parsed.success) {
    throw new WordPressValidationError('Invalid post payload from WordPress', parsed.error.issues);
  }
  return transformPost(parsed.data);
}
