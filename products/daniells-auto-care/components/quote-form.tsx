"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { services } from "@/lib/site";
import { cn } from "@/lib/utils";

export function QuoteForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[\d\s\(\)\-\+\.]+$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.vehicle.trim()) newErrors.vehicle = "Vehicle is required";
    if (!formData.service) newErrors.service = "Please select a service";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        vehicle: "",
        service: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  if (status === "success") {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-2xl font-bold text-white mb-2">
          Quote Request Sent!
        </div>
        <p className="text-dac-muted">
          We&apos;ll get back to you within {15} minutes.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn(
                "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-dac-faint focus:outline-none focus:ring-2 focus:ring-dac-red focus:border-transparent transition",
                errors.name && "border-red-500"
              )}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={cn(
                "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-dac-faint focus:outline-none focus:ring-2 focus:ring-dac-red focus:border-transparent transition",
                errors.phone && "border-red-500"
              )}
              placeholder="(123) 456-7890"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn(
              "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-dac-faint focus:outline-none focus:ring-2 focus:ring-dac-red focus:border-transparent transition",
              errors.email && "border-red-500"
            )}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="vehicle" className="block text-sm font-medium text-white mb-1">
              Vehicle *
            </label>
            <input
              type="text"
              id="vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className={cn(
                "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-dac-faint focus:outline-none focus:ring-2 focus:ring-dac-red focus:border-transparent transition",
                errors.vehicle && "border-red-500"
              )}
              placeholder="Year Make Model"
            />
            {errors.vehicle && (
              <p className="mt-1 text-xs text-red-400">{errors.vehicle}</p>
            )}
          </div>
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-white mb-1">
              Service *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={cn(
                "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-dac-faint focus:outline-none focus:ring-2 focus:ring-dac-red focus:border-transparent transition appearance-none",
                errors.service && "border-red-500"
              )}
            >
              <option value="" disabled className="bg-dac-black">
                Select a service
              </option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug} className="bg-dac-black">
                  {s.name}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="mt-1 text-xs text-red-400">{errors.service}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-dac-faint focus:outline-none focus:ring-2 focus:ring-dac-red focus:border-transparent transition resize-none"
            placeholder="Tell us about your vehicle or any special requests..."
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </span>
          ) : (
            "Get Free Quote"
          )}
        </Button>
        {status === "error" && (
          <p className="text-sm text-red-400 text-center">
            Something went wrong. Please try again or call us directly.
          </p>
        )}
      </form>
    </GlassCard>
  );
}
