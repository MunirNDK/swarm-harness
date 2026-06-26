import { Button } from "@/components/ui/button";
import { business } from "@/lib/site";
import { cn } from "@/lib/utils";

interface QuoteCTAProps {
  className?: string;
}

export function QuoteCTA({ className }: QuoteCTAProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-r from-dac-red-dark via-dac-red to-dac-red-light p-8 md:p-12 shadow-2xl",
        className
      )}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready for a showroom finish?
          </h2>
          <p className="mt-2 text-white/80">
            Get your free quote in under 15 minutes.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {business.primaryCtas.map((cta) => (
            <Button
              key={cta.label}
              href={cta.href}
              variant={cta.variant}
              size="lg"
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
