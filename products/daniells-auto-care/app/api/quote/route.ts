import { NextRequest, NextResponse } from "next/server";

interface QuoteRequestBody {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  message?: string;
}

const LIMITS: Record<keyof QuoteRequestBody, number> = {
  name: 100,
  phone: 30,
  email: 254,
  vehicle: 100,
  service: 60,
  message: 2000,
};

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
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, errors: ["Too many requests. Please try again shortly."] },
      { status: 429 }
    );
  }

  try {
    const raw = (await request.json()) as Partial<QuoteRequestBody>;

    // Coerce to strings and trim
    const body = {} as QuoteRequestBody;
    for (const key of Object.keys(LIMITS) as (keyof QuoteRequestBody)[]) {
      const value =
        typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
      if (value.length > LIMITS[key]) {
        return NextResponse.json(
          {
            ok: false,
            errors: [
              `${key} exceeds the maximum length of ${LIMITS[key]} characters.`,
            ],
          },
          { status: 400 }
        );
      }
      body[key] = value;
    }

    // Validate required fields
    const required: (keyof QuoteRequestBody)[] = [
      "name",
      "phone",
      "email",
      "vehicle",
      "service",
    ];
    const missing = required.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          errors: missing.map((f) => `${f} is required`),
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { ok: false, errors: ["Invalid email format"] },
        { status: 400 }
      );
    }

    // Validate phone — at least 10 digits
    if (body.phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { ok: false, errors: ["Phone number must have at least 10 digits"] },
        { status: 400 }
      );
    }

    // Stub: no email backend
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Invalid request body"] },
      { status: 400 }
    );
  }
}
