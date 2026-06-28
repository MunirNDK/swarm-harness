import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import { business, siteUrl } from '@/lib/site';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StickyCTA } from '@/components/sticky-cta';
import { QuoteModalProvider, QuoteModal } from '@/components/quote-modal';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${business.name} | ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description: business.tagline,
  openGraph: {
    title: business.name,
    description: business.tagline,
    url: siteUrl,
    siteName: business.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/assets/og.webp`,
        width: 1200,
        height: 630,
        alt: business.name,
      },
    ],
  },
  other: {
    'twitter:card': 'summary_large_image',
    'twitter:image': `${siteUrl}/assets/og.webp`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sora.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <QuoteModalProvider>
          <Navbar />
          <main className="flex-1 pt-16 md:pt-20 pb-24 md:pb-0">{children}</main>
          <Footer />
          <StickyCTA />
          <QuoteModal />
        </QuoteModalProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": business.name,
              "telephone": business.phone,
              "areaServed": "Northern New Jersey",
              "url": siteUrl,
              "priceRange": "$$",
              "openingHours": "Mo-Su 00:00-24:00",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": 5,
                "reviewCount": 300
              }
            })
          }}
        />
      </body>
    </html>
  );
}
