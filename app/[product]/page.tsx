import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/button-link';
import { DemoSection } from '@/components/demo-section';
import { InstallChain } from '@/components/install-chain';
import { OutcomeList } from '@/components/outcome-list';
import { Eyebrow } from '@/components/product-showcase';
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

const container = 'mx-auto max-w-[1240px] px-4 sm:px-6';
const h2 = 'mt-5 text-[2rem] sm:text-[2.75rem]';
const card = 'rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-7';

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

      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div data-surface="dark" className="stage overflow-hidden rounded-[var(--radius-stage)] text-white">
          <div className={`${container} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[5fr_7fr]`}>
            <div className="min-w-0">
              <Eyebrow tone="dark">{product.audience}</Eyebrow>
              <h1 className="mt-6 text-[2.75rem] text-white sm:text-[4rem]">{product.name}</h1>
              <p className="reading mt-5 text-[1.375rem] leading-snug text-white/85">{product.promise}</p>
              <p className="reading mt-4 text-16 text-white/65">{product.summary}</p>
              <div className="mt-8">
                <ButtonLink href={`/demo?product=${product.slug}`} variant="light">Book a demo</ButtonLink>
              </div>
            </div>
            <div className="min-w-0">
              {product.screens[0]
                ? <Screenshot screen={product.screens[0]} priority tone="dark" />
                : <OutcomeList items={product.outcomes} tone="dark" />}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="problems" className={`${container} py-12 sm:py-16`}>
        <Eyebrow>The problem</Eyebrow>
        <h2 id="problems" className={h2}>What it stops</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {product.problems.map((pr) => (
            <div key={pr.title} className={card}>
              <h3 className="text-[1.25rem] tracking-[-0.02em]">{pr.title}</h3>
              <p className="mt-2 text-16 text-ink-muted">{pr.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="features" className={`${container} py-12 sm:py-16`}>
        <Eyebrow>What you get</Eyebrow>
        <h2 id="features" className={h2}>What it does</h2>
        <div className="mt-10 space-y-4">
          {product.featureGroups.map((g, i) => {
            const shot = g.features.find((f) => f.screen)?.screen;
            const bg = shot ? (i % 2 ? 'wash-gold' : 'wash-navy') : 'bg-white';
            return (
              <div key={g.job} className={`overflow-hidden rounded-[var(--radius-panel)] border border-ink/[0.06] p-7 sm:p-10 ${bg}`}>
                <h3 className="text-[1.5rem] tracking-[-0.025em] sm:text-[1.75rem]">{g.job}</h3>
                {/* With a screenshot: features beside it. Without one yet: features across the full width. */}
                <div className={shot ? 'mt-8 grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center' : 'mt-8'}>
                  <dl className={shot ? 'min-w-0 space-y-6' : 'grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'}>
                    {g.features.map((f) => (
                      <div key={f.title} className="min-w-0">
                        <dt className="font-display text-16 font-medium text-ink">{f.title}</dt>
                        <dd className="mt-1 text-16 text-ink-muted">{f.body}</dd>
                      </div>
                    ))}
                  </dl>
                  {shot && (
                    <div className="min-w-0">
                      <Screenshot screen={shot} sizes="(min-width: 1024px) 680px, 100vw" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {product.comingSoon.length > 0 && (
          <section aria-labelledby="soon" className="mt-4 rounded-[var(--radius-panel)] border border-dashed border-ink/15 bg-white/60 p-7 sm:p-10">
            <h3 id="soon" className="text-[1.5rem] tracking-[-0.025em]">Coming soon</h3>
            <p className="mt-2 text-16 text-ink-muted">Not part of {product.name} today.</p>
            <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {product.comingSoon.map((f) => (
                <li key={f.title}>
                  <span className="block font-display text-16 font-medium text-ink">{f.title}</span>
                  <span className="mt-1 block text-16 text-ink-muted">{f.body}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>

      <section aria-labelledby="hardware" className={`${container} py-12 sm:py-16`}>
        <Eyebrow>Hardware</Eyebrow>
        <h2 id="hardware" className={h2}>What we install</h2>
        <div className={`mt-10 ${card} sm:p-10`}>
          <div className={product.hardware.photo ? 'grid items-center gap-10 lg:grid-cols-[7fr_5fr]' : ''}>
            <div className="min-w-0">
              <p className="reading text-[1.25rem] leading-relaxed text-ink">{product.hardware.body}</p>
              <p className="reading mt-3 text-16 text-ink-muted">{product.hardware.offline}</p>
            </div>
            {product.hardware.photo && (
              <figure className="min-w-0">
                <div className="flex h-64 items-center justify-center rounded-[16px] bg-paper p-6 sm:h-80">
                  <Image
                    src={product.hardware.photo.src}
                    alt={product.hardware.photo.alt}
                    width={product.hardware.photo.width}
                    height={product.hardware.photo.height}
                    sizes="(min-width: 1024px) 420px, 90vw"
                    className="h-full w-auto object-contain mix-blend-multiply"
                  />
                </div>
                <figcaption className="mt-3 text-14 text-ink-muted">{product.hardware.photo.caption}</figcaption>
              </figure>
            )}
          </div>
          <div className="mt-10 border-t border-ink/[0.06] pt-2">
            <InstallChain steps={product.hardware.chain} />
          </div>
        </div>
      </section>

      <section aria-labelledby="who" className={`${container} py-12 sm:py-16`}>
        <Eyebrow>Industries</Eyebrow>
        <h2 id="who" className={h2}>Who it&apos;s for</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {forWho.map((i) => (
            <li key={i.slug}>
              <Link href={`/industries#${i.slug}`} className={`group block h-full ${card} transition-colors hover:border-ink/20`}>
                <span className="flex items-center justify-between gap-4 font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                  {i.name}
                  <ArrowUpRight size={20} aria-hidden="true" className="shrink-0 text-ink/40 transition-colors group-hover:text-ink" />
                </span>
                <span className="mt-2 block text-16 text-ink-muted">{i.problem}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <DemoSection product={product.slug} />
    </main>
  );
}
