import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { BUSINESS, SERVICES, AREAS, NAV } from '@/lib/site';
import { Phone, MapPin, Clock, Shield } from 'lucide-react';

const footerLinks = [
  {
    title: 'Services',
    links: SERVICES.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  },
  {
    title: 'Service Areas',
    links: AREAS.map((a) => ({ label: a, href: `/service-areas/${a.toLowerCase().replace(/\s+/g, '-')}` })),
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Team', href: '/team' },
      { label: 'Fleet', href: '/fleet' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dac-black/50 backdrop-blur-xl">
      <Container className="py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-heading font-bold text-xl tracking-tight text-dac-white">
              Daniells <span className="text-dac-red">Auto Care</span>
            </Link>
            <p className="mt-3 text-dac-muted text-sm leading-relaxed max-w-sm">
              {BUSINESS.tagline}
            </p>
            <div className="mt-5 space-y-2 text-sm text-dac-muted">
              <a href={BUSINESS.phoneHref} className="flex items-center gap-2 hover:text-dac-white transition-colors">
                <Phone className="w-4 h-4 text-dac-red shrink-0" />
                {BUSINESS.phone}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-dac-red shrink-0" />
                {BUSINESS.serviceArea}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-dac-red shrink-0" />
                {BUSINESS.hours}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-dac-faint">
              <Shield className="w-3.5 h-3.5 text-dac-red shrink-0" />
              Licensed &amp; Insured
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading font-semibold text-dac-white text-sm mb-4 tracking-tight">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-dac-muted text-sm hover:text-dac-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dac-faint">
          <p>&copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-dac-white transition-colors">Contact</Link>
            <Button href={NAV.cta.href} variant="primary" size="sm">{NAV.cta.label}</Button>
          </div>
        </div>
      </Container>
    </footer>
  );
}