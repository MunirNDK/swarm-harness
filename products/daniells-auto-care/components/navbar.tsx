'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { services, areas, business, logo } from '@/lib/site';
import { QuoteButton } from '@/components/quote-modal';
import { Container } from '@/components/ui/container';

/**
 * Navbar — Contract §6, §10, DS-CS-009
 * Exactly 7 top-level items: Home, Services▾, Service Areas▾, Fleet, Gallery, Blog, Contact
 * Our Team is in footer only (not in top nav per contract §6).
 * Desktop: hover dropdowns; Mobile: accordion + Escape + outside-click close.
 */

const NAV_ITEMS = [
  { label: 'Home',          href: '/' },
  { label: 'Services',      href: '/services',      dropdown: 'services' as const },
  { label: 'Service Areas', href: '/service-areas', dropdown: 'areas'    as const },
  { label: 'Fleet',         href: '/fleet' },
  { label: 'Gallery',       href: '/gallery' },
  { label: 'Blog',          href: '/blog' },
  { label: 'Contact',       href: '/contact' },
] as const;

type DropdownType = 'services' | 'areas';

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

export function Navbar() {
  const pathname                                       = usePathname();
  const [scrolled, setScrolled]                        = useState(false);
  const [mobileOpen, setMobileOpen]                    = useState(false);
  const [activeDropdown, setActiveDropdown]            = useState<string | null>(null);
  const mobileMenuRef                                   = useRef<HTMLDivElement>(null);

  /* Scroll transition */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  /* Escape key — close mobile menu */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileOpen(false);
      setActiveDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* Outside-click — close mobile menu */
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [mobileOpen]);

  /* Body scroll lock when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function renderDropdown(type: DropdownType) {
    if (type === 'services') {
      return services.map((s) => (
        <Link
          key={s.slug}
          href={`/services/${s.slug}`}
          className="block px-4 py-2 text-sm text-fg-soft hover:text-fg hover:bg-surface2 rounded-sm transition-colors duration-fast ease-default"
          data-track-category="navigation"
          data-track-action="link_click"
          data-track-label={`service_${s.slug}`}
          data-track-context="internal"
        >
          {s.name}
        </Link>
      ));
    }
    return areas.map((area) => (
      <Link
        key={area}
        href={`/service-areas/${slugify(area)}`}
        className="block px-4 py-2 text-sm text-fg-soft hover:text-fg hover:bg-surface2 rounded-sm transition-colors duration-fast ease-default"
        data-track-category="navigation"
        data-track-action="link_click"
        data-track-label={`area_${slugify(area)}`}
        data-track-context="internal"
      >
        {area}
      </Link>
    ));
  }

  return (
    <header
      ref={mobileMenuRef}
      className={cn(
        'sticky top-0 left-0 right-0 z-50 transition-all duration-base ease-default',
        scrolled
          ? 'bg-surface-dark/90 backdrop-blur-xl border-b border-border shadow-md'
          : 'bg-surface-dark'
      )}
    >
      <Container>
        <nav
          className="flex items-center justify-between"
          style={{ height: 'var(--nav-h)' }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            data-track-category="navigation"
            data-track-action="link_click"
            data-track-label="logo"
            data-track-context="internal"
            aria-label={`${business.name} — home`}
          >
            <Image
              src={logo}
              alt={business.name}
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              if ('dropdown' in item && item.dropdown) {
                return (
                  <div key={item.label} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-sm transition-colors duration-fast ease-default',
                        isActive ? 'text-fg' : 'text-fg-soft hover:text-fg'
                      )}
                      data-track-category="navigation"
                      data-track-action="link_click"
                      data-track-label={item.href.replace(/^\//, '') || 'home'}
                      data-track-context="internal"
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                    </Link>

                    {/* Hover dropdown */}
                    <div className="absolute top-full left-0 mt-1 w-52 bg-surface-dark border border-border rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-base ease-default">
                      {renderDropdown(item.dropdown)}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-sm transition-colors duration-fast ease-default',
                    isActive ? 'text-fg' : 'text-fg-soft hover:text-fg'
                  )}
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={item.href.replace(/^\//, '') || 'home'}
                  data-track-context="internal"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={business.phoneHref}
              className="flex items-center gap-1.5 text-sm font-bold text-accent hover:text-accent-mid transition-colors duration-fast ease-default"
              data-track-category="conversion"
              data-track-action="link_click"
              data-track-label="phone_call"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>{business.phone}</span>
            </a>
            <QuoteButton
              variant="primary"
              size="md"
              track={{ category: 'conversion', action: 'button_click', label: 'nav_get_free_quote' }}
            >
              Get Free Quote
            </QuoteButton>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-fg min-w-[44px] min-h-[44px] flex items-center justify-center rounded-sm"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            data-track-category="navigation"
            data-track-action="toggle"
            data-track-label="mobile_menu"
          >
            {mobileOpen
              ? <X className="h-6 w-6" aria-hidden="true" />
              : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </nav>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-surface-dark/95 backdrop-blur-xl border-t border-border"
        >
          <Container className="py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              if ('dropdown' in item && item.dropdown) {
                const isOpen = activeDropdown === item.label;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 text-left text-base font-medium text-fg rounded-sm hover:bg-surface2 transition-colors duration-fast ease-default min-h-[44px]"
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-base ease-default',
                          isOpen && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-4">
                        {renderDropdown(item.dropdown)}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-fg rounded-sm hover:bg-surface2 transition-colors duration-fast ease-default min-h-[44px]"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={item.href.replace(/^\//, '') || 'home'}
                  data-track-context="internal"
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile CTAs */}
            <div className="pt-4 border-t border-border space-y-3">
              <a
                href={business.phoneHref}
                className="flex items-center gap-2 px-4 py-3 text-base font-bold text-accent min-h-[44px]"
                data-track-category="conversion"
                data-track-action="link_click"
                data-track-label="phone_call"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {business.phone}
              </a>
              <QuoteButton
                variant="primary"
                size="lg"
                className="w-full"
                track={{ category: 'conversion', action: 'button_click', label: 'mobile_nav_get_free_quote' }}
              >
                Get Free Quote
              </QuoteButton>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
