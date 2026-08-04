import Link from 'next/link';
import Image from 'next/image';
import { Phone, Instagram, Youtube } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { business, logo, social } from '@/lib/site';
import type { Service, ServiceArea } from '@/lib/wordpress/types';

interface FooterProps {
  services: Service[];
  areas:    ServiceArea[];
}

/**
 * Footer — Contract §6, §10, DS-CS-011
 * Surface-dark, brand, sitemap columns (Services, Service Areas, Company),
 * social icons, phone, copyright current year, area pills.
 * Company column includes Our Team, Privacy, Terms per contract §6.
 */
export function Footer({ services, areas }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    /* pb-deck on mobile clears the fixed StickyCta bar */
    <footer className="bg-surface-dark border-t border-border pb-deck md:pb-0">
      <Container className="py-stall">
        {/* Grid: Brand | Services | Company | Service Areas on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-stall">

          {/* Brand column */}
          <div className="space-y-gauge col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block"
              data-track-category="navigation"
              data-track-action="link_click"
              data-track-label="logo"
              data-track-context="internal"
              aria-label={`${business.name} — home`}
            >
              <Image
                src={logo}
                alt={business.name}
                width={130}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="font-sans font-bold text-xl uppercase text-fg">
              Daniells<span className="text-accent"> Auto Care</span>
            </p>

            <p className="text-fg-soft text-sm leading-relaxed max-w-xs">
              Professional auto detailing across Northern New Jersey.
              Same-day service, 100% satisfaction guaranteed.
            </p>

            {/* Phone */}
            <a
              href={business.phoneHref}
              className="flex items-center gap-rivet text-sm font-bold text-accent hover:text-accent-mid transition-colors duration-fast ease-default"
              data-track-category="conversion"
              data-track-action="link_click"
              data-track-label="phone_call"
            >
              <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {business.phone}
            </a>

            {/* Availability */}
            <p className="font-mono text-mono-sm text-fg-faint uppercase tracking-label">
              {business.hours}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-bolt">
              {social.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  className="p-rivet rounded-sm border border-border text-fg-faint hover:text-accent hover:border-accent transition-colors duration-fast ease-default min-w-touch min-h-touch flex items-center justify-center"
                  aria-label={s.platform}
                  rel="noopener noreferrer"
                  target="_blank"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={s.label}
                  data-track-context="external"
                >
                  {s.platform === 'Instagram' && <Instagram className="h-4 w-4" aria-hidden="true" />}
                  {s.platform === 'YouTube' && <Youtube className="h-4 w-4" aria-hidden="true" />}
                  {s.platform === 'TikTok' && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Services column */}
          <div>
            <p className="font-mono text-mono-sm tracking-label text-accent uppercase mb-gauge">
              Services
            </p>
            <ul className="space-y-rivet">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-fg-soft hover:text-accent transition-colors duration-fast ease-default"
                    data-track-category="navigation"
                    data-track-action="link_click"
                    data-track-label={`service_${s.slug}`}
                    data-track-context="internal"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <p className="font-mono text-mono-sm tracking-label text-accent uppercase mb-gauge">
              Company
            </p>
            <ul className="space-y-rivet">
              {[
                { label: 'Our Team',      href: '/team' },
                { label: 'Gallery',       href: '/gallery' },
                { label: 'Blog',          href: '/blog' },
                { label: 'Contact',       href: '/contact' },
                { label: 'Privacy Policy',href: '/privacy' },
                { label: 'Terms of Use',  href: '/terms' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-soft hover:text-accent transition-colors duration-fast ease-default"
                    data-track-category="navigation"
                    data-track-action="link_click"
                    data-track-label={link.href.replace(/^\//, '')}
                    data-track-context="internal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas column — own column on desktop */}
          <div className="col-span-2 lg:col-span-1">
            <p className="font-mono text-mono-sm tracking-label text-accent uppercase mb-gauge">
              Service Areas
            </p>
            <div className="flex flex-wrap gap-rivet">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="font-mono text-mono-sm tracking-label text-fg-soft uppercase bg-surface border border-border rounded-full px-bolt py-pin hover:border-accent hover:text-accent transition-colors duration-fast ease-default"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={`area_${area.slug}`}
                  data-track-context="internal"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-stall pt-panel border-t border-border flex flex-col sm:flex-row items-center justify-between gap-bolt">
          <p className="font-mono text-mono-sm tracking-label text-fg-faint uppercase">
            &copy; {year} {business.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-gauge">
            <Link
              href="/privacy"
              className="font-mono text-mono-sm tracking-label text-fg-faint uppercase hover:text-accent transition-colors duration-fast ease-default"
              data-track-category="navigation"
              data-track-action="link_click"
              data-track-label="privacy"
              data-track-context="internal"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-mono text-mono-sm tracking-label text-fg-faint uppercase hover:text-accent transition-colors duration-fast ease-default"
              data-track-category="navigation"
              data-track-action="link_click"
              data-track-label="terms"
              data-track-context="internal"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
