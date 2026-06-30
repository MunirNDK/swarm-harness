import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { BUSINESS } from '@/lib/site';
import { Phone } from 'lucide-react';

interface QuoteCTAProps {
  headline?: string;
  className?: string;
}

export function QuoteCTA({ headline, className }: QuoteCTAProps) {
  return (
    <section className={className}>
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-dac-red/20 via-dac-red/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,5,5,0.15),transparent_70%)]" />

        <Container className="relative py-16 sm:py-20 lg:py-24 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">
              {headline ?? 'Ready for a Showroom Finish?'}
            </h2>
          </Reveal>
          <Reveal staggerIndex={1}>
            <p className="text-dac-muted text-base sm:text-lg max-w-xl mx-auto mb-8">
              Get your free, no-obligation quote in 15 minutes. Same-day service available across {BUSINESS.serviceArea}.
            </p>
          </Reveal>
          <Reveal staggerIndex={2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/contact" size="lg">
                Get Free Quote
              </Button>
              <Button
                href={BUSINESS.phoneHref}
                variant="secondary"
                size="lg"
              >
                <Phone className="w-4 h-4" />
                Call {BUSINESS.phone}
              </Button>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}