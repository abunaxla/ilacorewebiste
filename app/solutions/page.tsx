import type { Metadata } from 'next';
import { ButtonLink } from '@/components/button-link';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { Eyebrow } from '@/components/product-showcase';
import { products } from '@/content/products';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'ILACORE FMS is a petrol station management system. ILACORE Telematics is fleet tracking with AI dashcams. ILACORE LPG is in development.',
  alternates: { canonical: '/solutions' },
};

const wash = ['wash-navy', 'wash-gold', 'bg-white'];

export default function Solutions() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero
        eyebrow="Solutions"
        title="One product for each operation."
        lead="Two products in use today, and one in development. ILACORE installs and supports each one."
      />
      <div className="mx-auto grid max-w-[1240px] gap-4 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-3">
        {products.map((p, i) => {
          const live = p.status === 'live';
          return (
            <section
              key={p.slug}
              aria-labelledby={`sol-${p.slug}`}
              className={`flex min-w-0 flex-col rounded-[var(--radius-panel)] border p-7 sm:p-9 ${live ? `border-ink/[0.06] ${wash[i % wash.length]}` : 'border-dashed border-ink/15 bg-white/60'}`}
            >
              <Eyebrow>{live ? p.audience : 'Coming soon'}</Eyebrow>
              <h2 id={`sol-${p.slug}`} className="mt-6 text-[1.75rem] tracking-[-0.03em] sm:text-[2rem]">{p.name}</h2>
              <p className="mt-3 text-[1.125rem] leading-snug text-ink">{p.promise}</p>
              <p className="mt-3 flex-1 text-16 text-ink-muted">{p.summary}</p>
              <div className="mt-8">
                {live ? (
                  <ButtonLink href={`/${p.slug}`}>See {p.name}</ButtonLink>
                ) : (
                  <ButtonLink href={`/demo?product=${p.slug}&intent=interest`} variant="ghost">Register interest</ButtonLink>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <DemoSection />
    </main>
  );
}
