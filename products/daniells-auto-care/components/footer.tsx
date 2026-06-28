import Link from "next/link";
import { Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { business, services, areas, logo } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dac-black">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Daniells Auto Care" className="h-10 w-auto" />
            <Link href="/" className="text-xl font-bold text-white">
              Daniells<span className="text-dac-red"> Auto Care</span>
            </Link>
            <p className="text-dac-muted text-sm leading-relaxed">
              Professional auto detailing across Northern New Jersey. Same-day
              service, 100% satisfaction guaranteed.
            </p>
            <div className="space-y-2 text-sm text-dac-muted">
              <a
                href={business.phoneHref}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                {business.phone}
              </a>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {business.hours}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-dac-muted hover:text-white transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-white font-semibold mb-4">Service Areas</h3>
            <ul className="space-y-2">
              {areas.map((area) => (
                <li key={area}>
                  <Link
                    href={`/service-areas/${area.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-dac-muted hover:text-white transition-colors"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/team"
                  className="text-sm text-dac-muted hover:text-white transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-sm text-dac-muted hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-dac-muted hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-dac-muted hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-dac-faint">
          <p>
            &copy; {new Date().getFullYear()} Daniells Auto Care. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {business.trust.slice(0, 2).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
