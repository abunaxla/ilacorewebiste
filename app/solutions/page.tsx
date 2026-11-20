import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/button-link';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { products } from '@/content/products';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'ILACORE solutions for fuel and fleet operators: FMS and Telematics today, LPG next.',
  alternates: { canonical: '/solutions' },
};

export default function Solutions() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero title="Solutions" lead="Two products in use today, and more in development. ILACORE installs and supports each one." />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {products.map((p) => (
          <section key={p.slug} aria-labelledby={`sol-${p.slug}`} className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line py-12">
            <div className="reading min-w-0">
              <h2 id={`sol-${p.slug}`} className="text-31">
                {p.name}
                {p.status === 'coming-soon' && <span className="ml-3 align-middle font-body text-14 font-normal text-ink-muted">Coming soon</span>}
              </h2>
              <p className="mt-3 text-20 text-ink">{p.promise}</p>
              <p className="mt-2 text-16 text-ink-muted">{p.summary}</p>
            </div>
            {p.status === 'live' ? (
              <Link href={`/${p.slug}`} className="font-display text-16 font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">See {p.name}</Link>
            ) : (
              <ButtonLink href={`/demo?product=${p.slug}&intent=interest`} variant="outline-dark">Register interest</ButtonLink>
            )}
          </section>
        ))}
      </div>
      <DemoSection />
    </main>
  );
}
