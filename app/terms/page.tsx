import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms that cover your use of the ILACORE website.',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero title="Terms of use" />
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
        <div className="reading space-y-4 text-16 [&_h2]:mt-8 [&_h2]:text-25">
          <p>These terms cover your use of this website, which {site.legalEntity} runs.</p>
          <h2>Information on this site</h2>
          <p>We describe our products as accurately as we can. Features marked &quot;coming soon&quot; are in development and not yet available. Contracts for our products are agreed separately.</p>
          <h2>Screenshots and trademarks</h2>
          <p>The ILACORE name, logo and product screenshots belong to {site.legalEntity}. Don&apos;t reuse them without permission.</p>
          <h2>Contact</h2>
          <p>For questions about these terms, email <a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </div>
    </main>
  );
}
