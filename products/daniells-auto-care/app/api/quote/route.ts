import { NextRequest, NextResponse } from 'next/server';

interface QuoteRequestBody {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequestBody = await request.json();

    // Basic validation
    const requiredFields: (keyof QuoteRequestBody)[] = ['name', 'phone', 'email', 'vehicle', 'service'];
    const missingFields = requiredFields.filter((field) => !body[field]?.trim());

    if (missingFields.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone minimal check (at least 10 digits)
    const phoneDigits = body.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { ok: false, error: 'Phone number must have at least 10 digits' },
        { status: 400 }
      );
    }

    // Stub: no real email backend yet
    // In production, send email/SMS here

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
