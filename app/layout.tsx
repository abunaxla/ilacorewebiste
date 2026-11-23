import type { Metadata } from 'next';
import { Geist, Inter } from 'next/font/google';
import './globals.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { site } from '@/content/site';
import { safeJsonLd } from '@/lib/json-ld';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'ILACORE', template: '%s | ILACORE' },
  description: 'ILACORE builds, installs and supports live dashboards for key operations across Africa and the Middle East.',
  openGraph: { type: 'website', siteName: 'ILACORE', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ILACORE',
  url: site.url,
  logo: `${site.url}/brand/logo-color.svg`,
  areaServed: ['Africa', 'Middle East'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: site.email },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
