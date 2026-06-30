'use client';

import { useState, FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SERVICES, BUSINESS } from '@/lib/site';
import { Loader2, CheckCircle, Send } from 'lucide-react';

interface QuoteFormProps {
  className?: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  message: string;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  vehicle: '',
  service: '',
  message: '',
};

export function QuoteForm({ className }: QuoteFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email address';
    }
    if (!form.vehicle.trim()) errs.vehicle = 'Vehicle is required';
    if (!form.service) errs.service = 'Service is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setForm(initialForm);
      }
    } catch {
      setErrors({ name: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  if (success) {
    return (
      <div className={cn('glass-card p-8 sm:p-10 text-center', className)}>
        <CheckCircle className="w-12 h-12 text-dac-red mx-auto mb-4" />
        <h3 className="font-heading text-xl font-semibold text-dac-white mb-2">Quote Request Sent!</h3>
        <p className="text-dac-muted text-sm">
          We&apos;ll get back to you within {BUSINESS.responseTime}. Need immediate help? Call{' '}
          <a href={BUSINESS.phoneHref} className="text-dac-red hover:underline">{BUSINESS.phone}</a>.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Request Another Quote
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('glass-card p-6 sm:p-8', className)} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="sm:col-span-2">
          <h3 className="font-heading text-xl font-semibold text-dac-white mb-1">Get Your Free Quote</h3>
          <p className="text-dac-muted text-sm">Fill in the details and we&apos;ll respond within 15 minutes.</p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="q-name" className="block text-sm font-medium text-dac-white mb-1.5">
            Name <span className="text-dac-red">*</span>
          </label>
          <input
            id="q-name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={cn(
              'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-dac-white placeholder:text-dac-faint focus:outline-none focus:border-dac-red transition-colors',
              errors.name && 'border-dac-red',
            )}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-dac-red text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="q-phone" className="block text-sm font-medium text-dac-white mb-1.5">
            Phone <span className="text-dac-red">*</span>
          </label>
          <input
            id="q-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={cn(
              'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-dac-white placeholder:text-dac-faint focus:outline-none focus:border-dac-red transition-colors',
              errors.phone && 'border-dac-red',
            )}
            placeholder="(201) 555-0123"
          />
          {errors.phone && <p className="text-dac-red text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="q-email" className="block text-sm font-medium text-dac-white mb-1.5">
            Email <span className="text-dac-red">*</span>
          </label>
          <input
            id="q-email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={cn(
              'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-dac-white placeholder:text-dac-faint focus:outline-none focus:border-dac-red transition-colors',
              errors.email && 'border-dac-red',
            )}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-dac-red text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Vehicle */}
        <div>
          <label htmlFor="q-vehicle" className="block text-sm font-medium text-dac-white mb-1.5">
            Vehicle <span className="text-dac-red">*</span>
          </label>
          <input
            id="q-vehicle"
            type="text"
            value={form.vehicle}
            onChange={(e) => update('vehicle', e.target.value)}
            className={cn(
              'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-dac-white placeholder:text-dac-faint focus:outline-none focus:border-dac-red transition-colors',
              errors.vehicle && 'border-dac-red',
            )}
            placeholder="Year Make Model"
          />
          {errors.vehicle && <p className="text-dac-red text-xs mt-1">{errors.vehicle}</p>}
        </div>

        {/* Service */}
        <div className="sm:col-span-2">
          <label htmlFor="q-service" className="block text-sm font-medium text-dac-white mb-1.5">
            Service <span className="text-dac-red">*</span>
          </label>
          <select
            id="q-service"
            value={form.service}
            onChange={(e) => update('service', e.target.value)}
            className={cn(
              'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-dac-white focus:outline-none focus:border-dac-red transition-colors appearance-none',
              errors.service && 'border-dac-red',
            )}
          >
            <option value="" className="bg-dac-ink">Select a service</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.slug} className="bg-dac-ink">
                {s.name}
              </option>
            ))}
          </select>
          {errors.service && <p className="text-dac-red text-xs mt-1">{errors.service}</p>}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="q-message" className="block text-sm font-medium text-dac-white mb-1.5">
            Message <span className="text-dac-faint">(optional)</span>
          </label>
          <textarea
            id="q-message"
            rows={3}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-dac-white placeholder:text-dac-faint focus:outline-none focus:border-dac-red transition-colors resize-none"
            placeholder="Tell us about your vehicle or specific needs..."
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full mt-6"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Get Free Quote
          </>
        )}
      </Button>
    </form>
  );
}