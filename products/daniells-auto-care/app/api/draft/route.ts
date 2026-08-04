import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Draft preview entry point — the WordPress plugin's includes/previews.php
 * points the wp-admin "Preview" button here. Spec §8.
 */

const TYPE_TO_PATH_PREFIX: Record<string, string> = {
  service: '/services',
  service_area: '/service-areas',
  post: '/blog',
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');

  if (!secret || secret !== process.env.SHI_PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 });
  }
  if (!type || !slug) {
    return NextResponse.json({ error: 'Missing type or slug' }, { status: 400 });
  }

  const prefix = TYPE_TO_PATH_PREFIX[type];
  if (!prefix) {
    return NextResponse.json({ error: `Unknown preview type: ${type}` }, { status: 400 });
  }

  draftMode().enable(); // Next.js 14 — draftMode() is synchronous (async only from v15)
  return NextResponse.redirect(new URL(`${prefix}/${slug}`, request.url));
}
