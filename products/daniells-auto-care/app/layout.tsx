import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import { business } from '@/lib/site';
// These components will be created later
// import { Navbar } from '@/components/navbar';
// import { Footer } from '@/components/footer';

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
    url: 'https://daniellsautocare.com',
    siteName: business.name,
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'twitter:card': 'summary_large_image',
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
        {/* Navbar placeholder — imported later */}
        {/* <Navbar /> */}
        <main className="flex-1">{children}</main>
        {/* Footer placeholder — imported later */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
