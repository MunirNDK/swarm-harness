'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV, BUSINESS, SERVICES, AREAS } from '@/lib/site';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const servicesChildren = SERVICES.map((s) => ({
    label: s.name,
    href: `/services/${s.slug}`,
  }));

  const areasChildren = AREAS.map((a) => ({
    label: a,
    href: `/service-areas/${a.toLowerCase().replace(/\s+/g, '-')}`,
  }));

  const childMap: Record<string, { label: string; href: string }[]> = {
    services: servicesChildren,
    areas: areasChildren,
  };

  const dropdownToggle = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-white/10 py-2'
          : 'py-4',
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-dac-white shrink-0">
          Daniells <span className="text-dac-red">Auto Care</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {NAV.primary.map((item) => {
            const hasChildren = (item as { children?: string }).children;
            const children = hasChildren ? childMap[hasChildren] : null;
            return (
              <div key={item.href} className="relative">
                {children ? (
                  <>
                    <button
                      onClick={() => dropdownToggle(hasChildren!)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors',
                        isActive(item.href)
                          ? 'text-dac-red bg-dac-red/10'
                          : 'text-dac-muted hover:text-dac-white hover:bg-white/5',
                      )}
                      aria-expanded={openDropdown === hasChildren}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 transition-transform',
                          openDropdown === hasChildren && 'rotate-180',
                        )}
                      />
                    </button>
                    {openDropdown === hasChildren && (
                      <div className="absolute top-full left-0 mt-2 w-56 py-2 glass-card rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        {children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-dac-muted hover:text-dac-white hover:bg-white/5 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'px-3 py-2 rounded-full text-sm font-medium transition-colors block',
                      isActive(item.href)
                        ? 'text-dac-red bg-dac-red/10'
                        : 'text-dac-muted hover:text-dac-white hover:bg-white/5',
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA + Phone (desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={BUSINESS.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-dac-muted hover:text-dac-white transition-colors"
          >
            <Phone className="w-4 h-4 text-dac-red" />
            {BUSINESS.phone}
          </a>
          <Button href={NAV.cta.href} size="sm">{NAV.cta.label}</Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-dac-white rounded-xl hover:bg-white/5 transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-dac-black/95 backdrop-blur-xl z-40 overflow-y-auto">
          <Container className="py-6 flex flex-col gap-2">
            {NAV.primary.map((item) => {
              const mHasChildren = (item as { children?: string }).children;
              const children = mHasChildren ? childMap[mHasChildren] : null;
              return (
                <div key={item.href}>
                  {children ? (
                    <>
                      <button
                        onClick={() => dropdownToggle(mHasChildren!)}
                        className={cn(
                          'flex items-center justify-between w-full p-3 rounded-xl text-base font-medium',
                          isActive(item.href)
                            ? 'text-dac-red bg-dac-red/10'
                            : 'text-dac-white hover:bg-white/5',
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform',
                            openDropdown === mHasChildren && 'rotate-180',
                          )}
                        />
                      </button>
                      {openDropdown === mHasChildren && (
                        <div className="ml-4 mt-1 border-l border-white/10 pl-4 space-y-1">
                          {children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2 text-sm text-dac-muted hover:text-dac-white transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'block p-3 rounded-xl text-base font-medium transition-colors',
                        isActive(item.href)
                          ? 'text-dac-red bg-dac-red/10'
                          : 'text-dac-white hover:bg-white/5',
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center gap-2 text-dac-muted hover:text-dac-white transition-colors p-2"
              >
                <Phone className="w-4 h-4 text-dac-red" />
                {BUSINESS.phone}
              </a>
              <Button href={NAV.cta.href} className="w-full">{NAV.cta.label}</Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}