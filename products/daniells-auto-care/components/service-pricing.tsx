import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { GlowCard } from '@/components/ui/glow-card';
import { QuoteButton } from '@/components/quote-modal';
import { cn } from '@/lib/utils';
import type { Service } from '@/lib/wordpress/types';

type SurfaceVariant = 'bg' | 'surface' | 'surface-dark' | 'surface-dark-2';

interface ServicePricingProps {
  service: Service;
  /** Surface for the pricing Section — pass to keep page-level alternation clean. */
  surface?: SurfaceVariant;
  /** Override the section heading (else CMS pricingTitle, else default). */
  title?: string;
  /** Override the section subtitle (else CMS pricingSubtitle, else default). */
  subtitle?: string;
}

/**
 * ServicePricing — packages/tiers grid + optional "Popular Add-Ons" block.
 *
 * Data comes from the CMS (service.pricingTiers / service.addons). The whole
 * section is only rendered by the caller when pricingTiers is non-empty; the
 * add-ons sub-block hides itself when the service has no add-ons — so services
 * without add-ons simply don't show that block (per pricing spec).
 *
 * "Includes" bullets reuse the red-dot pattern from the Benefits section, and
 * a `badge` (e.g. "Most Popular") lifts a tier with an accent ring — matching
 * the site's Showroom Precision design language.
 */
export function ServicePricing({ service, surface = 'surface', title, subtitle }: ServicePricingProps) {
  const {
    slug,
    pricingTitle,
    pricingSubtitle,
    pricingTiers,
    pricingNote,
    addonsTitle,
    addons,
  } = service;

  if (pricingTiers.length === 0) return null;

  return (
    <Section surface={surface} id="service-pricing">
      <Container>
        <SectionHeading
          kicker="Packages & Pricing"
          title={title || pricingTitle || 'Packages & Pricing'}
          subtitle={
            subtitle ||
            pricingSubtitle ||
            'Transparent starting prices. Final quotes depend on vehicle size, condition, and any add-ons — we confirm everything before we start.'
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-panel">
          {pricingTiers.map((tier, i) => {
            const featured = Boolean(tier.badge);
            return (
              <Reveal key={`${tier.name}-${i}`} delay={i * 80} className="h-full">
                <GlowCard
                  className={cn(
                    'h-full flex flex-col',
                    featured && 'border-accent shadow-red'
                  )}
                  style={featured ? { borderColor: 'var(--accent)' } : undefined}
                >
                  <div className="p-panel md:p-7 flex flex-col flex-1 gap-gauge">
                    {/* Header — name + optional badge */}
                    <div className="flex items-start justify-between gap-bolt">
                      <h3 className="text-lg leading-snug">
                        {tier.name}
                      </h3>
                      {tier.badge && (
                        <span className="flex-shrink-0 rounded-full bg-accent px-bolt py-pin font-mono text-mono-sm tracking-label uppercase text-cta-fg">
                          {tier.badge}
                        </span>
                      )}
                    </div>

                    {/* Price + optional descriptor */}
                    <div>
                      <p
                        className="font-sans font-bold text-accent text-2xl"
                      >
                        {tier.price}
                      </p>
                      {tier.meta && (
                        <p className="mt-pin font-mono text-mono-sm tracking-label uppercase text-fg-faint">
                          {tier.meta}
                        </p>
                      )}
                    </div>

                    {/* Includes list */}
                    {tier.includes.length > 0 && (
                      <ul className="space-y-bolt flex-1">
                        {tier.includes.map((item, j) => (
                          <li key={j} className="flex items-start gap-bolt">
                            <span
                              className="flex-shrink-0 mt-rivet w-2 h-2 rounded-full"
                              style={{ background: 'var(--accent)' }}
                              aria-hidden="true"
                            />
                            <span className="text-fg-soft text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-rivet">
                      <QuoteButton
                        variant={featured ? 'primary' : 'outline'}
                        size="md"
                        className="w-full"
                        prefill={{ service: slug }}
                        track={{
                          category: 'conversion',
                          action: 'button_click',
                          label: `${slug}_pricing_get_quote`,
                        }}
                      >
                        Get This Quote
                      </QuoteButton>
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>

        {pricingNote && (
          <p className="mt-bay max-w-3xl text-fg-faint text-sm leading-relaxed">
            {pricingNote}
          </p>
        )}

        {/* ── Popular Add-Ons — hidden entirely when the service has none ── */}
        {addons.length > 0 && (
          <div className="mt-deck">
            <div className="mb-bay">
              <p className="mb-bolt font-mono text-mono-sm tracking-label uppercase text-accent">
                Enhance Your Service
              </p>
              <h3 className="text-2xl">
                {addonsTitle || 'Popular Add-Ons'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gauge">
              {addons.map((addon, i) => (
                <Reveal key={`${addon.name}-${i}`} delay={i * 60}>
                  <GlowCard className="h-full">
                    <div className="p-gauge md:p-panel flex flex-col gap-rivet h-full">
                      <div className="flex items-baseline justify-between gap-gauge">
                        <h4 className="text-base leading-snug">
                          {addon.name}
                        </h4>
                        <span className="flex-shrink-0 font-sans font-bold text-accent text-lg whitespace-nowrap">
                          {addon.price}
                        </span>
                      </div>
                      {addon.priceType && (
                        <p className="font-mono text-mono-sm tracking-label uppercase text-fg-faint">
                          {addon.priceType}
                        </p>
                      )}
                      {addon.details && (
                        <p className="text-fg-soft text-sm leading-relaxed">{addon.details}</p>
                      )}
                    </div>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
