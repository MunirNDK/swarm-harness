import type { Metadata } from 'next';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { business } from '@/lib/site';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { JsonLd } from '@/components/ui/jsonld';

const BREADCRUMBS = [
  { label: 'Home',              href: '/' },
  { label: 'Terms of Service',  href: '/terms' },
];

export const metadata: Metadata = pageMeta({
  title:       'Terms of Service',
  description:
    'Terms of service for Daniells Auto Care mobile auto detailing in Northern New Jersey. Understand our service agreement, cancellation policy, and liability terms.',
  path: '/terms',
});

const LAST_UPDATED = 'June 1, 2026';

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(BREADCRUMBS)} />

      {/* ── Breadcrumbs ── */}
      <div className="bg-surface-dark border-b border-border">
        <Container>
          <div className="py-3">
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
        </Container>
      </div>

      {/* ── Content ── */}
      <Section surface="bg" id="terms-content">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent mb-3">
              Legal
            </p>
            <h1
              className="font-sans font-bold uppercase tracking-[-0.02em] text-fg mb-6"
              style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', lineHeight: '1.1' }}
            >
              Terms of Service
            </h1>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint mb-10">
              Last updated: {LAST_UPDATED}
            </p>

            <div className="space-y-10 text-fg-soft leading-[1.8]">

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By using the website located at{' '}
                  <a
                    href="/"
                    className="text-accent hover:underline"
                    data-track-category="navigation"
                    data-track-action="link_click"
                    data-track-label="home"
                    data-track-context="internal"
                  >
                    daniellsautocare.com
                  </a>{' '}
                  or engaging {business.name} for auto detailing services, you agree to be bound
                  by these Terms of Service. If you do not agree, please do not use our website or
                  services.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  2. Services
                </h2>
                <p>
                  {business.name} provides mobile auto detailing services including, but not
                  limited to, interior detailing, exterior detailing, ceramic coating, paint
                  correction, paint protection film, and window tinting. The specific scope of each
                  service is agreed upon at the time of booking. All quotes are free and
                  non-binding until both parties confirm in writing or verbally.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  3. Quotes and Pricing
                </h2>
                <p>
                  All prices are quoted based on vehicle size, condition, and requested services.
                  Quotes are provided free of charge and carry no obligation. Final pricing is
                  confirmed before work begins. We reserve the right to adjust the quoted price if
                  the vehicle&apos;s actual condition differs materially from what was described
                  at the time of the quote.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  4. Scheduling and Cancellations
                </h2>
                <p>
                  Appointments may be cancelled or rescheduled with reasonable advance notice.
                  We reserve the right to cancel or reschedule appointments due to weather
                  conditions, equipment issues, or other circumstances beyond our control. We will
                  make every effort to notify you as early as possible and offer alternative times.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  5. Customer Responsibilities
                </h2>
                <p>
                  You agree to provide accurate information about your vehicle and its condition
                  when requesting a quote. You are responsible for ensuring a safe and accessible
                  location for us to work. Any pre-existing damage, modifications, or conditions
                  should be disclosed before service begins.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  6. Limitation of Liability
                </h2>
                <p>
                  {business.name} will take all reasonable care when working on your vehicle.
                  However, we are not liable for pre-existing defects, damage resulting from
                  undisclosed conditions, or damage that could not reasonably have been avoided
                  during the delivery of standard auto detailing services. Our liability is
                  limited to the cost of the services rendered.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  7. Satisfaction Guarantee
                </h2>
                <p>
                  We stand behind our work. If you are unsatisfied with the results of any service,
                  contact us promptly and we will make reasonable efforts to address the issue. Our
                  goal is your complete satisfaction on every visit.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  8. Website Use
                </h2>
                <p>
                  The content on this website is provided for informational purposes only. You may
                  not reproduce, distribute, or use any content from this site without prior written
                  permission from {business.name}. We are not responsible for errors or omissions
                  in the website content.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  9. Governing Law
                </h2>
                <p>
                  These Terms of Service are governed by the laws of the State of New Jersey,
                  without regard to its conflict of law provisions. Any disputes arising from
                  these terms or from the services provided will be resolved in the courts of
                  New Jersey.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  10. Changes to These Terms
                </h2>
                <p>
                  We may update these Terms of Service from time to time. When we do, we will
                  revise the &ldquo;Last updated&rdquo; date at the top of this page. Your
                  continued use of the website or services after any changes constitutes acceptance
                  of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  11. Contact
                </h2>
                <p>
                  Questions about these Terms of Service may be directed to {business.name} by
                  phone at{' '}
                  <a
                    href={business.phoneHref}
                    className="text-accent hover:underline"
                    data-track-category="conversion"
                    data-track-action="link_click"
                    data-track-label="phone_call"
                  >
                    {business.phone}
                  </a>{' '}
                  or through our{' '}
                  <a
                    href="/contact"
                    className="text-accent hover:underline"
                    data-track-category="navigation"
                    data-track-action="link_click"
                    data-track-label="contact"
                    data-track-context="internal"
                  >
                    contact form
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
