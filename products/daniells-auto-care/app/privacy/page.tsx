import type { Metadata } from 'next';
import { pageMeta, breadcrumbLd } from '@/lib/seo';
import { business, siteUrl } from '@/lib/site';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { JsonLd } from '@/components/ui/jsonld';

const BREADCRUMBS = [
  { label: 'Home',            href: '/' },
  { label: 'Privacy Policy',  href: '/privacy' },
];

export const metadata: Metadata = pageMeta({
  title:       'Privacy Policy',
  description:
    'Privacy policy for Daniells Auto Care. Learn how we collect, use, and protect information submitted through our website and quote forms.',
  path: '/privacy',
});

const LAST_UPDATED = 'June 1, 2026';

export default function PrivacyPage() {
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
      <Section surface="bg" id="privacy-content">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent mb-3">
              Legal
            </p>
            <h1
              className="font-sans font-bold uppercase tracking-[-0.02em] text-fg mb-6"
              style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', lineHeight: '1.1' }}
            >
              Privacy Policy
            </h1>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-faint mb-10">
              Last updated: {LAST_UPDATED}
            </p>

            <div className="space-y-10 text-fg-soft leading-[1.8]">

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  1. About This Policy
                </h2>
                <p>
                  {business.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
                  operates {siteUrl}. This Privacy Policy explains what personal information we
                  collect when you visit our website or use our services, how we use it, and your
                  rights regarding that information.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  2. Information We Collect
                </h2>
                <p className="mb-3">We collect information you provide directly, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-fg">Contact details:</strong> name, email address, and
                    phone number submitted through our contact or quote forms.
                  </li>
                  <li>
                    <strong className="text-fg">Vehicle information:</strong> year, make, model, and
                    ZIP code provided when requesting a quote.
                  </li>
                  <li>
                    <strong className="text-fg">Messages:</strong> any free-text content you submit
                    via our contact form.
                  </li>
                </ul>
                <p className="mt-3">
                  We may also collect standard technical data automatically, such as browser type,
                  referring URL, and pages visited, through standard web analytics tools. We do not
                  use cookies for advertising or cross-site tracking.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To respond to your quote requests and schedule services.</li>
                  <li>To communicate about your appointment and follow up after service.</li>
                  <li>To improve the content and functionality of our website.</li>
                  <li>
                    To comply with legal obligations and enforce our terms of service.
                  </li>
                </ul>
                <p className="mt-3">
                  We do not sell, rent, or trade your personal information to third parties for
                  marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  4. Third-Party Services
                </h2>
                <p>
                  Our website may use third-party analytics (such as Google Analytics) to
                  understand how visitors use the site. These services may set cookies and collect
                  information in accordance with their own privacy policies. We do not share your
                  personally identifiable contact data with these analytics providers.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  5. Data Retention
                </h2>
                <p>
                  We retain contact and quote information for as long as reasonably necessary to
                  provide our services and fulfill the purposes described in this policy, unless a
                  longer retention period is required by law. If you would like your information
                  deleted, please contact us directly.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  6. Your Rights
                </h2>
                <p>
                  You have the right to request access to, correction of, or deletion of your
                  personal information. To exercise these rights, contact us at{' '}
                  <a
                    href={business.phoneHref}
                    className="text-accent hover:underline"
                    data-track-category="conversion"
                    data-track-action="link_click"
                    data-track-label="phone_call"
                  >
                    {business.phone}
                  </a>
                  . We will respond within a reasonable time.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  7. Security
                </h2>
                <p>
                  We use reasonable administrative and technical measures to protect the information
                  you submit. However, no method of internet transmission or storage is 100% secure.
                  We encourage you to take care when sharing personal information online.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  8. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. When we do, we will revise
                  the &ldquo;Last updated&rdquo; date at the top of this page. Your continued use
                  of the site after any changes constitutes your acceptance of the revised policy.
                </p>
              </section>

              <section>
                <h2 className="font-sans font-bold uppercase tracking-[-0.01em] text-fg text-xl mb-3">
                  9. Contact
                </h2>
                <p>
                  If you have questions about this Privacy Policy, please contact{' '}
                  {business.name} by phone at{' '}
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
                  <a href="/contact" className="text-accent hover:underline"
                     data-track-category="navigation"
                     data-track-action="link_click"
                     data-track-label="contact"
                     data-track-context="internal">
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
