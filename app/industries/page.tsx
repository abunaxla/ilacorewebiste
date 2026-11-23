import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { industries } from '@/content/industries';
import { getProduct } from '@/content/products';

export const metadata: Metadata = {
  title: 'Industries',
  description: 'How fuel stations, fleet depots, oil marketing companies and transport operators use ILACORE.',
  alternates: { canonical: '/industries' },
};

export default function Industries() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero
        eyebrow="Industries"
        title="Who uses ILACORE."
        lead="The problem each of them brings to us, and how ILACORE answers it."
      />
      <div className="mx-auto grid max-w-[1240px] gap-4 px-4 pb-12 sm:px-6 sm:pb-16 md:grid-cols-2">
        {industries.map((i) => (
          <section
            key={i.slug}
            id={i.slug}
            aria-labelledby={`ind-${i.slug}`}
            className="flex min-w-0 scroll-mt-24 flex-col rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-7 sm:p-9"
          >
            <h2 id={`ind-${i.slug}`} className="text-[1.75rem] tracking-[-0.03em]">{i.name}</h2>
            <p className="mt-4 text-[1.125rem] leading-snug text-ink">{i.problem}</p>
            <p className="mt-3 flex-1 text-16 text-ink-muted">{i.answer}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {i.products.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink/10 bg-paper px-4 font-display text-14 font-medium text-ink transition-colors hover:border-ink/30"
                  >
                    {getProduct(slug)!.name}
                    <ArrowUpRight size={16} aria-hidden="true" className="text-ink/50" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <DemoSection />
    </main>
  );
}
