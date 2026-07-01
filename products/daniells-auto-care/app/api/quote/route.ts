import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/quote
 * Handles two payload modes without external dependencies:
 *
 * QUOTE mode  — name, phone, vehicle, service (+ optional zip)
 * CONTACT mode — name, email, message (+ optional phone)
 *
 * Both: optional honeypot field `_honey` — reject if non-empty.
 * Rate-limited: 5 requests per IP per 60 seconds.
 */

/* ── Field length caps ──────────────────────────────────────────── */
const LIMITS: Record<string, number> = {
  name:    100,
  phone:   30,
  email:   254,
  zip:     10,
  vehicle: 100,
  service: 60,
  message: 2000,
  _honey:  0,   // honeypot must be empty
};

/* ── Rate limiting (in-memory, per-instance) ────────────────────── */
const WINDOW_MS     = 60_000;
const MAX_PER_WINDOW = 5;
const hits           = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now    = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v: string): boolean {
  return v.replace(/\D/g, '').length >= 10;
}

function err(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/* ── Route handler ───────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return err('Too many requests. Please try again shortly.', 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return err('Invalid request body', 400);
  }

  /* ── Coerce all known fields to trimmed strings + enforce caps ── */
  const fields: Record<string, string> = {};
  for (const [key, maxLen] of Object.entries(LIMITS)) {
    const value =
      typeof raw[key] === 'string' ? (raw[key] as string).trim() : '';
    if (value.length > maxLen) {
      return err(`${key} exceeds the maximum allowed length.`, 400);
    }
    fields[key] = value;
  }

  /* ── Honeypot check: bots fill hidden fields, humans don't ──── */
  if (fields._honey) {
    // Silent reject — return 200 to not signal to bots
    return NextResponse.json({ ok: true });
  }

  /* ── Detect payload mode ─────────────────────────────────────── */
  // Contact mode: message is present
  // Quote mode: service or vehicle is present
  const isContactMode = Boolean(fields.message);

  if (isContactMode) {
    /* ── CONTACT payload validation ── */
    if (!fields.name)    return err('Name is required.', 400);
    if (!fields.email)   return err('Email is required.', 400);
    if (!isValidEmail(fields.email))
      return err('Invalid email address.', 400);
    if (!fields.message) return err('Message is required.', 400);
    if (fields.phone && !isValidPhone(fields.phone))
      return err('Phone number must have at least 10 digits.', 400);

    // Stub: forward to email/CRM here. Inputs are validated and length-capped.
    console.log('[contact]', {
      name:    fields.name,
      email:   '[REDACTED]',
      phone:   fields.phone ? '[REDACTED]' : undefined,
      message: fields.message.slice(0, 40) + (fields.message.length > 40 ? '…' : ''),
    });

    return NextResponse.json({ ok: true });
  }

  /* ── QUOTE payload validation ── */
  if (!fields.name)    return err('Name is required.', 400);
  if (!fields.phone)   return err('Phone is required.', 400);
  if (!isValidPhone(fields.phone))
    return err('Phone number must have at least 10 digits.', 400);
  if (!fields.vehicle) return err('Vehicle is required.', 400);
  if (!fields.service) return err('Service is required.', 400);

  // Stub: forward to scheduling system/CRM here.
  console.log('[quote]', {
    name:    fields.name,
    phone:   '[REDACTED]',
    zip:     fields.zip || undefined,
    vehicle: fields.vehicle,
    service: fields.service,
  });

  return NextResponse.json({ ok: true });
}
