import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/button-link';
import { DemoSection } from '@/components/demo-section';
import { InstallChain } from '@/components/install-chain';
import { OutcomeList } from '@/components/outcome-list';
import { Screenshot } from '@/components/screenshot';
import { safeJsonLd } from '@/lib/json-ld';
import { industries } from '@/content/industries';
import { getProduct, liveProducts } from '@/content/products';
import { site } from '@/content/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return liveProducts().map((p) => ({ product: p.slug }));
}

type Props = { params: Promise<{ product: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).product);
  if (!p || p.status !== 'live') return {};
  return { title: p.name, description: p.seoDescription, alternates: { canonical: `/${p.slug}` } };
}

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6';
const linkStyle = 'font-display text-20 font-bold text-navy underline decoration-navy decoration-2 underline-offset-4';

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).product);
  if (!product || product.status !== 'live') notFound();
  const forWho = industries.filter((i) => product.industries.includes(i.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: `${site.url}/${product.slug}`,
    description: product.seoDescription,
    brand: { '@type': 'Organization', name: 'ILACORE' },
    category: product.slug === 'fms' ? 'Fuel management system' : 'Fleet telematics',
  };

  return (
    <main id="main" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <section data-surface="dark" className="bg-navy text-white">
        <div className={`${container} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[5fr_7fr]`}>
          <div className="min-w-0">
            <h1 className="text-39 text-white sm:text-49">{product.name}</h1>
            <p className="reading mt-5 text-25 text-white/90">{product.promise}</p>
            <p className="reading mt-4 text-16 text-white/80">{product.summary}</p>
            <div className="mt-8"><ButtonLink href={`/demo?product=${product.slug}`}>Book a demo</ButtonLink></div>
          </div>
          <div className="min-w-0">
            {product.screens[0]
              ? <Screenshot screen={product.screens[0]} priority tone="dark" />
              : <OutcomeList items={product.outcomes} tone="dark" />}
          </div>
        </div>
      </section>

      <section aria-labelledby="problems" className="py-16 sm:py-24">
        <div className={container}>
          <h2 id="problems" className="text-31 sm:text-39">What it stops</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {product.problems.map((pr) => (
              <div key={pr.title} className="border-t-2 border-navy pt-5">
                <h3 className="text-20">{pr.title}</h3>
                <p className="mt-2 text-16 text-ink-muted">{pr.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="features" className="border-t border-line bg-white py-16 sm:py-24">
        <div className={container}>
          <h2 id="features" className="text-31 sm:text-39">What it does</h2>
          {product.featureGroups.map((g) => {
            const shot = g.features.find((f) => f.screen)?.screen;
            return (
              <div key={g.job} className="mt-10 border-t border-line pt-10">
                <h3 className="text-25">{g.job}</h3>
                {/* With a screenshot: features beside it. Without one yet: features across the full width. */}
                <div className={shot ? 'mt-6 grid gap-10 lg:grid-cols-[5fr_7fr]' : 'mt-6'}>
                  <dl className={shot ? 'min-w-0 space-y-5' : 'grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'}>
                    {g.features.map((f) => (
                      <div key={f.title} className="min-w-0">
                        <dt className="font-display text-16 font-bold text-navy">{f.title}</dt>
                        <dd className="mt-1 text-16 text-ink-muted">{f.body}</dd>
                      </div>
                    ))}
                  </dl>
                  {shot && <div className="min-w-0"><Screenshot screen={shot} sizes="(min-width: 1024px) 720px, 100vw" /></div>}
                </div>
              </div>
            );
          })}
          {product.comingSoon.length > 0 && (
            <section aria-labelledby="soon" className="mt-16 rounded-panel border border-line p-6">
              <h3 id="soon" className="text-20">Coming soon</h3>
              <ul className="mt-4 space-y-3">
                {product.comingSoon.map((f) => (
                  <li key={f.title}>
                    <span className="font-display font-bold text-navy">{f.title}.</span>{' '}
                    <span className="text-ink-muted">{f.body}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>

      <section aria-labelledby="hardware" className="border-t border-line py-16 sm:py-24">
        <div className={container}>
          <h2 id="hardware" className="text-31 sm:text-39">What we install</h2>
          <p className="reading mt-4 text-20 text-ink">{product.hardware.body}</p>
          <p className="reading mt-3 text-16 text-ink-muted">{product.hardware.offline}</p>
          <InstallChain steps={product.hardware.chain} />
        </div>
      </section>

      <section aria-labelledby="who" className="border-t border-line py-16 sm:py-24">
        <div className={container}>
          <h2 id="who" className="text-31 sm:text-39">Who it&apos;s for</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {forWho.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries#${i.slug}`} className={linkStyle}>{i.name}</Link>
                <p className="mt-2 text-16 text-ink-muted">{i.problem}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DemoSection product={product.slug} />
    </main>
  );
}
