import { WordPressFetchError } from './errors';

// The staging WordPress host is a small shared Cloudways box and has shown
// intermittent slowness under concurrent load during testing — 8s was too
// tight and caused real (not sandbox-networking) timeouts. Cache tags +
// the 1hr fallback revalidate make occasional slow origin fetches cheap to
// tolerate; see Implementation Log, Phase 4, "gotcha #5".
const TIMEOUT_MS = 15000;

function baseUrl(): string {
  const url = process.env.WORDPRESS_API_URL;
  if (!url) {
    throw new WordPressFetchError('WORDPRESS_API_URL is not set');
  }
  return url.replace(/\/$/, '');
}

function authHeader(): string | null {
  const user = process.env.WORDPRESS_APP_USERNAME;
  const pass = process.env.WORDPRESS_APP_PASSWORD;
  if (!user || !pass) return null;
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

interface WpFetchOptions {
  /** Include Basic Auth — only needed to read draft/unpublished content (preview mode). */
  authenticated?: boolean;
  /** Next.js cache tags for on-demand revalidation. */
  tags?: string[];
  /** Fallback revalidation interval (seconds) as a safety net alongside tag-based revalidation. */
  revalidate?: number | false;
}

/**
 * Thin wrapper around fetch() for the WordPress REST API. Never call fetch()
 * directly against WORDPRESS_API_URL elsewhere — this is the one place that
 * knows about auth, timeouts, and error normalization (spec §6.1).
 */
export async function wpFetch<T = unknown>(
  path: string,
  options: WpFetchOptions = {}
): Promise<T> {
  const url = `${baseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (options.authenticated) {
    const auth = authHeader();
    if (!auth) {
      throw new WordPressFetchError(
        'Authenticated request requested but WORDPRESS_APP_USERNAME/PASSWORD are not set'
      );
    }
    headers.Authorization = auth;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers,
      signal: controller.signal,
      next: {
        tags: options.tags,
        revalidate: options.revalidate ?? 3600, // fallback safety net — spec §6.6
      },
    });

    if (!res.ok) {
      // Never include response body — WP error responses can echo back
      // request details we don't want duplicated into logs.
      throw new WordPressFetchError(`WordPress request failed (${res.status})`, res.status, path);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof WordPressFetchError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new WordPressFetchError(`WordPress request timed out after ${TIMEOUT_MS}ms`, undefined, path);
    }
    throw new WordPressFetchError(
      `WordPress request errored: ${err instanceof Error ? err.message : String(err)}`,
      undefined,
      path
    );
  } finally {
    clearTimeout(timeout);
  }
}
