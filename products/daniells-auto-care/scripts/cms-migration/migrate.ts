/**
 * Idempotent content migration — spec §10.2. Upserts services, service
 * areas, and blog posts from the existing code-owned data
 * (lib/site.ts / lib/blog.ts) into WordPress. Safe to re-run: every write
 * is a lookup-by-slug-then-create-or-update, never a blind create.
 *
 * Does NOT touch media (images stay served from local /assets/* — the
 * Next.js transform layer already falls back to those when WP has no
 * featured image, so nothing breaks) and does NOT create relationships
 * (the current live site shows every service on every area page and vice
 * versa — leaving JetEngine relations empty preserves that exact behavior
 * via the fallback logic already built into the service-area/service
 * detail pages; see docs/headless-cms-schema-contract.md §5).
 *
 * Run with: node scripts/cms-migration/migrate.ts
 * (Node 22+ native TS support — no build step, no ts-node dependency.)
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { services, areas } from '../../lib/site.ts';
import { blogPosts } from '../../lib/blog.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal(): Record<string, string> {
  const path = join(__dirname, '../../.env.local');
  const raw = readFileSync(path, 'utf-8');
  const env: Record<string, string> = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

const env = loadEnvLocal();
const BASE = env.WORDPRESS_API_URL;
const AUTH = 'Basic ' + Buffer.from(`${env.WP_MIGRATION_AGENT_USERNAME}:${env.WP_MIGRATION_AGENT_APP_PASSWORD}`).toString('base64');

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

async function wp(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: AUTH, ...(init.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function findBySlug(restBase: string, slug: string): Promise<{ id: number } | null> {
  const results = await wp(`/wp-json/wp/v2/${restBase}?slug=${encodeURIComponent(slug)}&status=any`);
  return results[0] ?? null;
}

async function upsert(restBase: string, slug: string, body: Record<string, unknown>): Promise<'created' | 'updated'> {
  const existing = await findBySlug(restBase, slug);
  if (existing) {
    await wp(`/wp-json/wp/v2/${restBase}/${existing.id}`, { method: 'POST', body: JSON.stringify(body) });
    return 'updated';
  }
  await wp(`/wp-json/wp/v2/${restBase}`, { method: 'POST', body: JSON.stringify({ slug, status: 'publish', ...body }) });
  return 'created';
}

async function migrateServices() {
  console.log(`\n— Services (${services.length}) —`);
  for (const s of services) {
    const result = await upsert('services', s.slug, {
      title: s.name,
      meta: {
        short_description: s.short,
        long_description: s.long,
        icon: s.icon,
        seo_description: s.metaDescription,
        benefits: s.benefits,
        process_steps: s.process,
        faq_items: s.faq,
      },
    });
    console.log(`  ${result.padEnd(8)} service/${s.slug}`);
  }
}

async function migrateServiceAreas() {
  console.log(`\n— Service areas (${areas.length}) —`);
  for (const town of areas) {
    const slug = slugify(town);
    const result = await upsert('service-areas', slug, { title: town });
    console.log(`  ${result.padEnd(8)} service-area/${slug}`);
  }
}

async function migrateBlogPosts() {
  console.log(`\n— Blog posts (${blogPosts.length}) —`);
  for (const p of blogPosts) {
    const result = await upsert('posts', p.slug, {
      title: p.title,
      excerpt: p.excerpt,
      content: p.body.map((para) => `<p>${para}</p>`).join('\n'),
      date: `${p.date}T00:00:00`,
    });
    console.log(`  ${result.padEnd(8)} post/${p.slug}`);
  }
}

async function main() {
  if (!BASE || !env.WP_MIGRATION_AGENT_USERNAME || !env.WP_MIGRATION_AGENT_APP_PASSWORD) {
    throw new Error('Missing WORDPRESS_API_URL / WP_MIGRATION_AGENT_* in .env.local');
  }
  await migrateServices();
  await migrateServiceAreas();
  await migrateBlogPosts();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message);
  process.exit(1);
});
