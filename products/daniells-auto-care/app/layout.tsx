import type { Metadata } from 'next';
import { Montserrat, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { business, siteUrl, images } from '@/lib/site';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StickyCta } from '@/components/sticky-cta';
import { QuoteModalProvider, QuoteModal } from '@/components/quote-modal';
import { Analytics } from '@/lib/analytics/analytics';
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/lib/analytics/gtm';
import { getServices } from '@/lib/wordpress/services';
import { getServiceAreas } from '@/lib/wordpress/service-areas';

const montserrat = Montserrat({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
  weight:   ['400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
  weight:   ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:  business.name,
    template: `%s | Daniells Auto Care`,
  },
  description: business.tagline,
  openGraph: {
    title:       business.name,
    description: business.tagline,
    url:         siteUrl,
    siteName:    business.name,
    locale:      'en_US',
    type:        'website',
    images: [
      {
        url:    images.og,
        width:  1200,
        height: 630,
        alt:    business.name,
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       business.name,
    description: business.tagline,
    images:      [images.og],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, areas] = await Promise.all([getServices(), getServiceAreas()]);

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg font-sans antialiased">
        {/* Google Tag Manager — next/script hoists the loader into <head> */}
        <GoogleTagManager />
        {/* Google Tag Manager (noscript) — must stay first inside <body> */}
        <GoogleTagManagerNoScript />

        {/* Skip to main content — accessibility */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-cta-fg focus:rounded-sm focus:font-sans focus:text-sm"
        >
          Skip to main content
        </a>

        {/* Status strip §12.11 */}
        <div
          className="relative z-[60] bg-surface-dark border-b border-border overflow-hidden"
          aria-hidden="true"
        >
          <div className="flex items-center justify-center gap-6 py-2 font-mono text-xs tracking-widest text-fg-faint uppercase whitespace-nowrap">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full bg-success animate-pulse-dot-green"
                aria-hidden="true"
              />
              Available 24/7
            </span>
            <span className="hidden sm:block text-muted">·</span>
            <span className="hidden sm:block">Quick quote response</span>
            <span className="hidden md:block text-muted">·</span>
            <span className="hidden md:block">Northern New Jersey</span>
          </div>
        </div>

        <QuoteModalProvider>
          <Navbar services={services} areas={areas} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <StickyCta />
          <Footer services={services} areas={areas} />
          <QuoteModal services={services} />
        </QuoteModalProvider>

        <Analytics />
      </body>
    </html>
  );
}
