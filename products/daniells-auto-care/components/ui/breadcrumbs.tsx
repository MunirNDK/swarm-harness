import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href:  string;
}

interface BreadcrumbsProps {
  items:     BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs — Contract §10, DS-CS-019
 * Last item = current page (no link).
 * Emits nav data-track-* on each link.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center flex-wrap gap-pin', className)}
    >
      <ol className="flex items-center flex-wrap gap-pin list-none p-0 m-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-pin">
              {idx > 0 && (
                <span className="text-muted text-mono-sm mx-pin" aria-hidden="true">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className="text-fg-faint font-mono text-mono-sm uppercase tracking-label"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-fg-soft font-mono text-mono-sm uppercase tracking-label hover:text-accent transition-colors duration-fast ease-default"
                  data-track-category="navigation"
                  data-track-action="link_click"
                  data-track-label={item.href.replace(/^\//, '') || 'home'}
                  data-track-context="internal"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
