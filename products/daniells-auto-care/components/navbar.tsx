"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { nav, services, areas, business } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const dropdownContent = (type: "services" | "areas") => {
    if (type === "services") {
      return services.map((s) => (
        <Link
          key={s.slug}
          href={`/services/${s.slug}`}
          className="block px-4 py-2 text-sm text-dac-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {s.name}
        </Link>
      ));
    }
    return areas.map((area) => (
      <Link
        key={area}
        href={`/service-areas/${area.toLowerCase().replace(/\s+/g, "-")}`}
        className="block px-4 py-2 text-sm text-dac-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      >
        {area}
      </Link>
    ));
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-dac-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              Daniells<span className="text-dac-red"> Auto Care</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {nav.primary.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full transition-colors",
                        pathname.startsWith(item.href)
                          ? "text-white bg-white/10"
                          : "text-dac-muted hover:text-white hover:bg-white/5"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-dac-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                        {dropdownContent(item.children)}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-full transition-colors",
                    pathname === item.href
                      ? "text-white bg-white/10"
                      : "text-dac-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={business.phoneHref}
              className="flex items-center gap-2 text-sm font-medium text-dac-muted hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              {business.phone}
            </a>
            <Button href={nav.cta.href} size="sm">
              {nav.cta.label}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-dac-black/95 backdrop-blur-xl border-t border-white/10">
          <Container className="py-4 space-y-2">
            {nav.primary.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 text-left text-base font-medium text-white rounded-xl hover:bg-white/5"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform",
                          activeDropdown === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {dropdownContent(item.children)}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-white rounded-xl hover:bg-white/5"
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <a
                href={business.phoneHref}
                className="flex items-center gap-2 px-4 py-3 text-base font-medium text-dac-muted hover:text-white"
              >
                <Phone className="h-5 w-5" />
                {business.phone}
              </a>
              <Button href={nav.cta.href} className="w-full" size="lg">
                {nav.cta.label}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
