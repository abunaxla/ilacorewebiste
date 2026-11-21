import Link from 'next/link';
import type { Product } from '@/content/products';
import { OutcomeList } from './outcome-list';
import { Screenshot } from './screenshot';

export function ProductRow({ product, mirrored = false }: { product: Product; mirrored?: boolean }) {
  // Coming-soon products carry placeholder outcomes; never present them as live capability.
  const live = product.status === 'live';
  const shot = product.screens[0];
  return (
    <section aria-labelledby={`row-${product.slug}`} className="border-t border-line py-16 sm:py-24">
      <div className={`mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 ${mirrored ? 'lg:grid-cols-[7fr_5fr]' : 'lg:grid-cols-[5fr_7fr]'}`}>
        <div className={`min-w-0 ${mirrored ? 'lg:order-2' : ''}`}>
          <h2 id={`row-${product.slug}`} className="text-31 sm:text-39">{product.name}</h2>
          <p className="reading mt-4 text-20 text-ink">{live ? product.promise : product.summary}</p>
          {live && shot && (
            <ul className="mt-6 space-y-3">
              {product.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-16 text-ink-muted">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                  {o}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/${product.slug}`}
            className="mt-8 inline-flex min-h-11 items-center font-display text-16 font-bold text-navy underline decoration-navy decoration-2 underline-offset-4"
          >
            See {product.name}
          </Link>
        </div>
        <div className={`min-w-0 ${mirrored ? 'lg:order-1' : ''}`}>
          {shot ? <Screenshot screen={shot} /> : live && <OutcomeList items={product.outcomes} />}
        </div>
      </div>
    </section>
  );
}
