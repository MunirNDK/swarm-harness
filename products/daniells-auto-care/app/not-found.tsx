'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { SearchX, Phone, Home, Layers, Mail, Search } from 'lucide-react';
import { business } from '@/lib/site';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

/**
 * 404 — Contract §6 / §10
 * Client component for the inline search form (submits to Google site: search).
 * Dark/red system, no carousel/tabs, no fabricated data.
 * data-track on the 404 view container.
 */
export default function NotFound() {
  const [query, setQuery] = useState('');

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = `site:daniellsautocare.com ${query.trim()}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener noreferrer');
  }

  return (
    <main
      id="main-content"
      className="min-h-[80vh] flex items-center justify-center bg-bg py-16"
      data-track-category="content"
      data-track-action="view"
      data-track-label="page_not_found"
    >
      <Container>
        <div className="max-w-xl mx-auto text-center">

          {/* ── 404 Stamp ── */}
          <p
            className="font-mono font-bold text-accent mb-2 select-none"
            style={{
              fontSize:      'clamp(4rem,12vw,8rem)',
              letterSpacing: '-0.02em',
              lineHeight:    '1',
            }}
            aria-hidden="true"
          >
            404
          </p>
          <div className="flex justify-center mb-6">
            <SearchX
              className="w-12 h-12 text-fg-faint"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          {/* ── Heading ── */}
          <h1
            className="font-sans font-bold uppercase tracking-[-0.01em] text-fg mb-3"
            style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}
          >
            Page Not Found
          </h1>
          <p className="text-fg-soft mb-8 leading-relaxed">
            That page doesn&apos;t exist or may have moved. Use the links below to find what
            you need, or search our site.
          </p>

          {/* ── Search Form — GET to Google site: search ── */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 mb-10 max-w-sm mx-auto"
            data-track-category="form"
            data-track-action="form_submit"
            data-track-label="site_search"
          >
            <label htmlFor="not-found-search" className="sr-only">
              Search this site
            </label>
            <input
              id="not-found-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this site…"
              className="field-input flex-1"
              style={{ minWidth: 0 }}
            />
            <button
              type="submit"
              className="min-w-[44px] min-h-[44px] px-4 py-2 bg-accent text-fg font-mono text-xs uppercase tracking-[0.08em] rounded-sm hover:bg-accent-mid transition-colors duration-fast flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          {/* ── Navigation Links ── */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Button
              href="/"
              variant="primary"
              size="md"
              track={{ category: 'navigation', action: 'link_click', label: 'home', context: 'internal' }}
            >
              <Home className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Home
            </Button>
            <Button
              href="/services"
              variant="outline"
              size="md"
              track={{ category: 'navigation', action: 'link_click', label: 'services', context: 'internal' }}
            >
              <Layers className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Services
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="md"
              track={{ category: 'navigation', action: 'link_click', label: 'contact', context: 'internal' }}
            >
              <Mail className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Contact
            </Button>
            <Button
              href="/blog"
              variant="ghost"
              size="md"
              track={{ category: 'navigation', action: 'link_click', label: 'blog', context: 'internal' }}
            >
              Blog
            </Button>
          </div>

          {/* ── Phone CTA ── */}
          <Button
            href={business.phoneHref}
            variant="phone"
            size="lg"
            track={{ category: 'conversion', action: 'link_click', label: 'phone_call' }}
          >
            <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
            {business.phone}
          </Button>
        </div>
      </Container>
    </main>
  );
}
