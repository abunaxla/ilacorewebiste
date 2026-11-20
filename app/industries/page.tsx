import type { Metadata } from 'next';
import Link from 'next/link';
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
      <PageHero title="Industries" lead="Who uses ILACORE, and the problem each of them brings to us." />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {industries.map((i) => (
          <section key={i.slug} id={i.slug} aria-labelledby={`ind-${i.slug}`} className="scroll-mt-24 border-b border-line py-14 lg:grid lg:grid-cols-[4fr_8fr] lg:gap-12">
            <h2 id={`ind-${i.slug}`} className="text-31">{i.name}</h2>
            <div className="reading mt-4 min-w-0 lg:mt-0">
              <p className="text-20 text-ink">{i.problem}</p>
              <p className="mt-3 text-16 text-ink-muted">{i.answer}</p>
              <ul className="mt-5 flex flex-wrap gap-4">
                {i.products.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${slug}`} className="font-display font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">{getProduct(slug)!.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
      <DemoSection />
    </main>
  );
}
