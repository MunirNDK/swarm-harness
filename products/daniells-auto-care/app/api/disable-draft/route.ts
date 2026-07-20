import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  draftMode().disable(); // Next.js 14 — draftMode() is synchronous (async only from v15)
  return NextResponse.redirect(new URL('/', request.url));
}
