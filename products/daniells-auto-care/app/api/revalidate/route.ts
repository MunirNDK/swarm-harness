import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { tagsForContentType } from '@/lib/wordpress/tags';

/**
 * On-demand revalidation, called by the WordPress plugin's
 * includes/revalidation.php on publish/update/delete. Spec §7.2.
 */

const KNOWN_CONTENT_TYPES = ['service', 'service_area', 'post', 'page'];

function validSignature(body: string, signature: string | null): boolean {
  const secret = process.env.SHI_REVALIDATE_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-shi-signature-256');

  if (!validSignature(body, signature)) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
  }

  let payload: { event?: string; contentType?: string; slug?: string; timestamp?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { contentType, slug } = payload;
  if (!contentType || !slug || !KNOWN_CONTENT_TYPES.includes(contentType)) {
    return NextResponse.json({ ok: false, error: 'Unknown or missing contentType/slug' }, { status: 400 });
  }

  const tags = tagsForContentType(contentType, slug);
  tags.forEach((tag) => revalidateTag(tag));

  return NextResponse.json({ ok: true, revalidated: tags });
}
