'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { business } from '@/lib/site';
import {
  trackLeadFormError,
  trackLeadFormResult,
  type LeadFormAnalytics,
} from '@/lib/analytics/track';
import { cn } from '@/lib/utils';
import type { Service } from '@/lib/wordpress/types';

interface FormData {
  name:             string;
  phone:            string;
  zip:              string;
  vehicle:          string;
  service:          string;
  fleetSize:        string;
  vehicleType:      string;
  serviceFrequency: string;
  notes:            string;
  _honey:           string; // honeypot
}

const INITIAL: FormData = {
  name:             '',
  phone:            '',
  zip:              '',
  vehicle:          '',
  service:          '',
  fleetSize:        '',
  vehicleType:      '',
  serviceFrequency: '',
  notes:            '',
  _honey:           '',
};

type Status = 'idle' | 'loading' | 'success' | 'error';

const FORM_ANALYTICS_BASE = {
  form_type: 'quote',
  form_name: 'get a quote',
  click_text: 'schedule now',
} as const;

/**
 * QuoteForm — Contract §10, §6, §12.8
 * Fields: name, phone, zip, vehicle, service, fleetSize, notes
 * Honeypot: _honey (hidden field)
 * POST → /api/quote
 * Analytics context is declared through native form semantics + data-attribute.
 */
interface QuoteFormProps {
  prefill?: { service?: string; fleetSize?: string; vehicleType?: string; serviceFrequency?: string };
  services: Service[];
  eventSection?: LeadFormAnalytics['event_section'];
}

export function QuoteForm({ prefill, services, eventSection = 'body' }: QuoteFormProps) {
  const formAnalytics: LeadFormAnalytics = {
    ...FORM_ANALYTICS_BASE,
    form_identifier:
      eventSection === 'popup_form' ? 'quote-modal-request-form' : 'quote-request-form',
    event_section: eventSection,
  };
  const [data, setData] = useState<FormData>({
    ...INITIAL,
    service:          prefill?.service          ?? '',
    fleetSize:        prefill?.fleetSize        ?? '',
    vehicleType:      prefill?.vehicleType      ?? '',
    serviceFrequency: prefill?.serviceFrequency ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  function validate(): Partial<Record<keyof FormData, string>> {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim())    e.name    = 'Name is required';
    if (!data.phone.trim())   e.phone   = 'Phone is required';
    else if (!/^[\d\s()\-+.]+$/.test(data.phone)) e.phone = 'Invalid phone number';
    if (!data.zip.trim())     e.zip     = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(data.zip.trim())) e.zip = 'Invalid ZIP code';
    if (!data.vehicle.trim()) e.vehicle = 'Vehicle is required';
    if (!data.service)        e.service = 'Please select a service';
    if (data.service === 'fleet-detailing') {
      if (!data.fleetSize.trim()) {
        e.fleetSize = 'Number of vehicles is required';
      } else if (!/^\d+$/.test(data.fleetSize.trim()) || Number(data.fleetSize) < 1) {
        e.fleetSize = 'Enter a valid number of vehicles';
      }
      if (!data.vehicleType)      e.vehicleType      = 'Please select a vehicle type';
      if (!data.serviceFrequency) e.serviceFrequency = 'Please select a frequency';
    }
    setErrors(e);
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (data._honey) {
      trackLeadFormError(formAnalytics, {
        interaction_type: 'spam_error',
        error_name: 'honeypot_triggered',
        error_type: 'bot_detected',
      });
      return;
    }

    const validationErrors = validate();
    const invalidFields = Object.keys(validationErrors) as (keyof FormData)[];
    if (invalidFields.length > 0) {
      const field = invalidFields[0];
      const errorType =
        field === 'phone'
          ? 'invalid_phone'
          : validationErrors[field]?.toLowerCase().includes('required')
            ? 'required_field_missing'
            : 'invalid_format';
      trackLeadFormError(formAnalytics, {
        interaction_type: 'form_error',
        error_name: 'field_validation_failed',
        error_type: errorType,
        field_id: field,
        error_count: invalidFields.length,
      });
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:      data.name,
          phone:     data.phone,
          zip:       data.zip,
          vehicle:   data.vehicle,
          service:   data.service,
          fleetSize: data.fleetSize,
          vehicleType: data.vehicleType,
          serviceFrequency: data.serviceFrequency,
          notes:     data.notes,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      trackLeadFormResult(formAnalytics, 'successful');
      setStatus('success');
      setData(INITIAL);
    } catch {
      setStatus('error');
      trackLeadFormError(formAnalytics, {
        interaction_type: 'system_error',
        error_name: 'lead_form_submission_failed',
        error_type: navigator.onLine ? 'js_exception' : 'network_offline',
      });
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
          We&apos;ll respond quickly.
        </p>
      </div>
    );
  }

  return (
    <form
      id={formAnalytics.form_identifier}
      aria-label={formAnalytics.form_name}
      onSubmit={handleSubmit}
      noValidate
      data-attribute={formAnalytics.form_type}
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

        {data.service === 'fleet-detailing' && (
          <>
            <FieldGroup label="Number of Vehicles" htmlFor="q-fleet-size" required error={errors.fleetSize}>
              <input
                type="number"
                id="q-fleet-size"
                name="fleetSize"
                value={data.fleetSize}
                onChange={handleChange}
                min="1"
                inputMode="numeric"
                className={cn('field-input', errors.fleetSize && 'error')}
                placeholder="e.g. 12"
                required
              />
            </FieldGroup>
            <FieldGroup label="Vehicle Type" htmlFor="q-vehicle-type" required error={errors.vehicleType}>
              <select
                id="q-vehicle-type"
                name="vehicleType"
                value={data.vehicleType}
                onChange={handleChange}
                className={cn('field-select', errors.vehicleType && 'error')}
                required
              >
                <option value="" disabled>Select vehicle type</option>
                <option value="Cars / Sedans" style={{ background: 'var(--bg)' }}>Cars / Sedans</option>
                <option value="SUVs / Crossovers" style={{ background: 'var(--bg)' }}>SUVs / Crossovers</option>
                <option value="Vans / Sprinters" style={{ background: 'var(--bg)' }}>Vans / Sprinters</option>
                <option value="Trucks" style={{ background: 'var(--bg)' }}>Trucks</option>
                <option value="Mixed Fleet" style={{ background: 'var(--bg)' }}>Mixed Fleet</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Service Frequency" htmlFor="q-service-frequency" required error={errors.serviceFrequency}>
              <select
                id="q-service-frequency"
                name="serviceFrequency"
                value={data.serviceFrequency}
                onChange={handleChange}
                className={cn('field-select', errors.serviceFrequency && 'error')}
                required
              >
                <option value="" disabled>Select frequency</option>
                <option value="Weekly" style={{ background: 'var(--bg)' }}>Weekly</option>
                <option value="Bi-Weekly" style={{ background: 'var(--bg)' }}>Bi-Weekly</option>
                <option value="Monthly" style={{ background: 'var(--bg)' }}>Monthly</option>
                <option value="Quarterly" style={{ background: 'var(--bg)' }}>Quarterly</option>
                <option value="Annually" style={{ background: 'var(--bg)' }}>Annually</option>
                <option value="One-Time Service" style={{ background: 'var(--bg)' }}>One-Time Service</option>
              </select>
            </FieldGroup>
          </>
        )}

        <FieldGroup label="Additional Details" htmlFor="q-notes">
          <textarea
            id="q-notes"
            name="notes"
            value={data.notes}
            onChange={handleChange}
            className="field-input"
            rows={3}
            placeholder="Anything else we should know? (optional)"
          />
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
