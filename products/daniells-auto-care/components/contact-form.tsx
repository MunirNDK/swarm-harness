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

interface FormData {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
  _honey:  string; // honeypot
}

const INITIAL: FormData = {
  name:    '',
  email:   '',
  phone:   '',
  message: '',
  _honey:  '',
};

type Status = 'idle' | 'loading' | 'success' | 'error';

const FORM_ANALYTICS: LeadFormAnalytics = {
  form_type: 'contact',
  form_identifier: 'contact-request-form',
  form_name: 'contact request',
  click_text: 'send message',
  event_section: 'body',
};

/**
 * ContactForm — Contract §10, §6
 * Fields: name, email, phone (optional), message, honeypot
 * Full validation per contract §6.
 * POST → /api/quote
 * Analytics context is declared through native form semantics + data-attribute.
 */
export function ContactForm() {
  const [data, setData]     = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  function validate(): Partial<Record<keyof FormData, string>> {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim())                        e.name    = 'Name is required';
    if (!data.email.trim())                       e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email address';
    if (data.phone.trim() && !/^[\d\s()\-+.]+$/.test(data.phone)) e.phone = 'Invalid phone number';
    if (!data.message.trim())                     e.message = 'Message is required';
    else if (data.message.trim().length < 10)     e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (data._honey) {
      trackLeadFormError(FORM_ANALYTICS, {
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
        field === 'email'
          ? 'invalid_email'
          : field === 'phone'
            ? 'invalid_phone'
            : validationErrors[field]?.toLowerCase().includes('required')
              ? 'required_field_missing'
              : 'invalid_format';
      trackLeadFormError(FORM_ANALYTICS, {
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
          name:    data.name,
          email:   data.email,
          phone:   data.phone || undefined,
          message: data.message,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      trackLeadFormResult(FORM_ANALYTICS, 'successful');
      setStatus('success');
      setData(INITIAL);
    } catch {
      setStatus('error');
      trackLeadFormError(FORM_ANALYTICS, {
        interaction_type: 'system_error',
        error_name: 'lead_form_submission_failed',
        error_type: navigator.onLine ? 'js_exception' : 'network_offline',
      });
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <div className="text-center py-8">
        <p className="font-sans font-bold text-2xl uppercase text-fg mb-2">Message Sent!</p>
        <p className="text-fg-soft text-sm">
          We&apos;ll respond quickly.
        </p>
      </div>
    );
  }

  return (
    <form
      id={FORM_ANALYTICS.form_identifier}
      aria-label={FORM_ANALYTICS.form_name}
      onSubmit={handleSubmit}
      noValidate
      data-attribute={FORM_ANALYTICS.form_type}
    >
      {/* Honeypot */}
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

      <div className="space-y-5">
        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-bolt">
          <FieldGroup label="Full Name" htmlFor="c-name" required error={errors.name}>
            <input
              type="text"
              id="c-name"
              name="name"
              value={data.name}
              onChange={handleChange}
              autoComplete="name"
              className={cn('field-input', errors.name && 'error')}
              placeholder="Your full name"
              required
            />
          </FieldGroup>
          <FieldGroup label="Email" htmlFor="c-email" required error={errors.email}>
            <input
              type="email"
              id="c-email"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              className={cn('field-input', errors.email && 'error')}
              placeholder="you@example.com"
              required
            />
          </FieldGroup>
        </div>

        {/* Phone (optional) */}
        <FieldGroup label="Phone" htmlFor="c-phone" error={errors.phone}>
          <input
            type="tel"
            id="c-phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            autoComplete="tel"
            className={cn('field-input', errors.phone && 'error')}
            placeholder="(973) 916-7868 — optional"
          />
        </FieldGroup>

        {/* Message */}
        <FieldGroup label="Message" htmlFor="c-message" required error={errors.message}>
          <textarea
            id="c-message"
            name="message"
            rows={5}
            value={data.message}
            onChange={handleChange}
            className={cn('field-textarea resize-none', errors.message && 'error')}
            placeholder="Tell us about your vehicle and what you need..."
            required
          />
        </FieldGroup>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === 'loading'}
          track={{ category: 'conversion', action: 'button_click', label: 'contact_form_send_message' }}
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </Button>

        {status === 'error' && (
          <p className="text-sm text-accent text-center" role="alert">
            Something went wrong. Please try again or call{' '}
            <a
              href={business.phoneHref}
              className="underline"
              data-track-category="conversion"
              data-track-action="link_click"
              data-track-label="phone_call"
            >
              {business.phone}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

/* Field group with label */
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
