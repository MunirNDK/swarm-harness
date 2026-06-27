import { NextRequest, NextResponse } from 'next/server';

interface QuoteRequestBody {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  message?: string;
}

// Field length caps to prevent oversized payloads / abuse.
const LIMITS: Record<keyof QuoteRequestBody, number> = {
  name: 100,
  phone: 30,
  email: 254,
  vehicle: 100,
  service: 60,
  message: 2000,
};

// Simple in-memory, per-IP rate limit (per server instance). For multi-instance,
// back this with a shared store (e.g. Upstash Redis).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 }
    );
  }

  try {
    const raw = (await request.json()) as Partial<QuoteRequestBody>;

    // Coerce to strings + trim, and enforce length caps.
    const body = {} as QuoteRequestBody;
    for (const key of Object.keys(LIMITS) as (keyof QuoteRequestBody)[]) {
      const value = typeof raw[key] === 'string' ? (raw[key] as string).trim() : '';
      if (value.length > LIMITS[key]) {
        return NextResponse.json(
          { ok: false, error: `${key} exceeds the maximum length of ${LIMITS[key]} characters.` },
          { status: 400 }
        );
      }
      body[key] = value;
    }

    const required: (keyof QuoteRequestBody)[] = ['name', 'phone', 'email', 'vehicle', 'service'];
    const missing = required.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email format' }, { status: 400 });
    }
    if (body.phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ ok: false, error: 'Phone number must have at least 10 digits' }, { status: 400 });
    }

    // Stub: integrate email/SMS/CRM here. Inputs are validated, trimmed, and length-capped.
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log internally; return a generic message to the client.
    console.error('quote submission error:', error);
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }
}
