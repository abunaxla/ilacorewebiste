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
      <PageHero eyebrow="Legal" title="Terms of use" />
      <div className="mx-auto max-w-[1240px] px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="reading space-y-4 rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-7 text-16 leading-relaxed text-ink sm:p-12 [&_h2]:mt-10 [&_h2]:text-[1.5rem] [&_h2]:tracking-[-0.025em] [&_h2:first-of-type]:mt-8">
          <p>These terms cover your use of this website, which {site.legalEntity} runs.</p>
          <h2>Information on this site</h2>
          <p>We describe our products as accurately as we can. Features marked &quot;coming soon&quot; are in development and not yet available. Contracts for our products are agreed separately.</p>
          <h2>Screenshots and trademarks</h2>
          <p>The ILACORE name, logo and product screenshots belong to {site.legalEntity}. Don&apos;t reuse them without permission.</p>
          <h2>Contact</h2>
          <p>For questions about these terms, email <a className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink" href={`mailto:${site.infoEmail}`}>{site.infoEmail}</a>.</p>
        </div>
      </div>
    </main>
  );
}
