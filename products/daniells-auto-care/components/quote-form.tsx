'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { services, business } from '@/lib/site';
import { cn } from '@/lib/utils';

interface FormData {
  name:     string;
  phone:    string;
  zip:      string;
  vehicle:  string;
  service:  string;
  _honey:   string; // honeypot
}

const INITIAL: FormData = {
  name:    '',
  phone:   '',
  zip:     '',
  vehicle: '',
  service: '',
  _honey:  '',
};

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * QuoteForm — Contract §10, §6, §12.8
 * Fields: name, phone, zip, vehicle, service
 * Honeypot: _honey (hidden field)
 * POST → /api/quote
 * data-track on form: category=form, action=form_submit, label=quote_request
 */
export function QuoteForm() {
  const [data, setData]   = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim())    e.name    = 'Name is required';
    if (!data.phone.trim())   e.phone   = 'Phone is required';
    else if (!/^[\d\s()\-+.]+$/.test(data.phone)) e.phone = 'Invalid phone number';
    if (!data.zip.trim())     e.zip     = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(data.zip.trim())) e.zip = 'Invalid ZIP code';
    if (!data.vehicle.trim()) e.vehicle = 'Vehicle is required';
    if (!data.service)        e.service = 'Please select a service';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (data._honey) return; // honeypot triggered — silent reject
    if (!validate()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    data.name,
          phone:   data.phone,
          zip:     data.zip,
          vehicle: data.vehicle,
          service: data.service,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setData(INITIAL);
    } catch {
      setStatus('error');
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormData];
        return next;
      });
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <p className="font-sans font-bold text-2xl uppercase text-fg mb-2">
          Quote Request Sent!
        </p>
        <p className="text-fg-soft text-sm">
          We&apos;ll respond within {business.responseTime}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-track-category="form"
      data-track-action="form_submit"
      data-track-label="quote_request"
    >
      {/* Honeypot — hidden from real users, bots fill it */}
      <input
        type="text"
        name="_honey"
        value={data._honey}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
      />

      <div className="space-y-4">
        {/* Name + Phone row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-bolt">
          <FieldGroup label="Full Name" htmlFor="q-name" required error={errors.name}>
            <input
              type="text"
              id="q-name"
              name="name"
              value={data.name}
              onChange={handleChange}
              autoComplete="name"
              className={cn('field-input', errors.name && 'error')}
              placeholder="Your full name"
              required
            />
          </FieldGroup>
          <FieldGroup label="Phone" htmlFor="q-phone" required error={errors.phone}>
            <input
              type="tel"
              id="q-phone"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              autoComplete="tel"
              className={cn('field-input', errors.phone && 'error')}
              placeholder="(123) 456-7890"
              required
            />
          </FieldGroup>
        </div>

        {/* ZIP + Vehicle row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-bolt">
          <FieldGroup label="ZIP Code" htmlFor="q-zip" required error={errors.zip}>
            <input
              type="text"
              id="q-zip"
              name="zip"
              value={data.zip}
              onChange={handleChange}
              autoComplete="postal-code"
              className={cn('field-input', errors.zip && 'error')}
              placeholder="07417"
              inputMode="numeric"
              required
            />
          </FieldGroup>
          <FieldGroup label="Vehicle" htmlFor="q-vehicle" required error={errors.vehicle}>
            <input
              type="text"
              id="q-vehicle"
              name="vehicle"
              value={data.vehicle}
              onChange={handleChange}
              className={cn('field-input', errors.vehicle && 'error')}
              placeholder="Year Make Model"
              required
            />
          </FieldGroup>
        </div>

        {/* Service select */}
        <FieldGroup label="Service" htmlFor="q-service" required error={errors.service}>
          <select
            id="q-service"
            name="service"
            value={data.service}
            onChange={handleChange}
            className={cn('field-select', errors.service && 'error')}
            required
          >
            <option value="" disabled>Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug} style={{ background: 'var(--bg)' }}>
                {s.name}
              </option>
            ))}
          </select>
        </FieldGroup>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === 'loading'}
          track={{ category: 'conversion', action: 'button_click', label: 'quote_form_schedule_now' }}
        >
          {status === 'loading' ? 'Sending…' : 'Schedule Now'}
        </Button>

        {status === 'error' && (
          <p className="text-sm text-accent text-center" role="alert">
            Something went wrong. Please try again or call us directly.
          </p>
        )}
      </div>
    </form>
  );
}

/* Sub-component: labeled field group */
function FieldGroup({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label:     string;
  htmlFor:   string;
  required?: boolean;
  error?:    string;
  children:  React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[0.65rem] tracking-[0.1em] uppercase text-fg-faint mb-1.5"
      >
        {label}
        {required && <span className="text-accent ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
