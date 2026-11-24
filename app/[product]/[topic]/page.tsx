import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/button-link';
import { CommonQuestions } from '@/components/common-questions';
import { DemoSection } from '@/components/demo-section';
import { Eyebrow } from '@/components/product-showcase';
import { Screenshot } from '@/components/screenshot';
import { getProduct } from '@/content/products';
import { site } from '@/content/site';
import { getTopic, topicPath, topics, topicsFor } from '@/content/topics';
import { safeJsonLd } from '@/lib/json-ld';

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((t) => ({ product: t.product, topic: t.slug }));
}

type Props = { params: Promise<{ product: string; topic: string }> };

async function load(params: Props['params']) {
  const { product: productSlug, topic: slug } = await params;
  const topic = getTopic(productSlug, slug);
  const product = getProduct(productSlug);
  return topic && product?.status === 'live' ? { topic, product } : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  const { topic } = found;
  return { title: { absolute: topic.seoTitle }, description: topic.seoDescription, alternates: { canonical: topicPath(topic) } };
}

const container = 'mx-auto max-w-[1240px] px-4 sm:px-6';
const h2 = 'text-[2rem] sm:text-[2.75rem]';

export default async function TopicPage({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  const { topic, product } = found;
  const photo = topic.hidePhoto ? undefined : product.hardware.photo;
  const related = topicsFor(product.slug).filter((t) => t.slug !== topic.slug);

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: product.name, item: `${site.url}/${product.slug}` },
      { '@type': 'ListItem', position: 3, name: topic.title, item: `${site.url}${topicPath(topic)}` },
    ],
  };

  return (
    <main id="main" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbs) }} />

      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div data-surface="dark" className="stage overflow-hidden rounded-[var(--radius-stage)] text-white">
          <div className={`${container} grid items-center gap-12 py-16 sm:py-24 ${photo ? 'lg:grid-cols-[7fr_5fr]' : ''}`}>
            <div className="min-w-0">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap gap-x-2 text-14 text-white/75">
                  <li><Link href={`/${product.slug}`} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">{product.name}</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page">{topic.title}</li>
                </ol>
              </nav>
              <h1 className="mt-6 text-[2.75rem] text-white sm:text-[4rem]">{topic.title}</h1>
              <p className="reading mt-5 text-[1.25rem] leading-snug text-white/75">{topic.lead}</p>
              <div className="mt-8">
                <ButtonLink href={`/demo?product=${product.slug}`} variant="light">Book a demo</ButtonLink>
              </div>
            </div>
            {photo && (
              <figure className="min-w-0">
                <div className="flex h-72 items-center justify-center rounded-[20px] bg-white p-8 sm:h-96">
                  <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} priority sizes="(min-width: 1024px) 300px, 60vw" className="h-full w-auto object-contain" />
                </div>
                <figcaption className="mt-3 text-14 text-white/80">{photo.caption}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {topic.sections.map((s, i) => (
        <section key={s.heading} aria-labelledby={`s-${i}`} className={`${container} py-10 sm:py-14`}>
          <div className={s.screen ? 'grid items-center gap-10 lg:grid-cols-[5fr_7fr]' : ''}>
            <div className="min-w-0">
              <h2 id={`s-${i}`} className={h2}>{s.heading}</h2>
              {s.body.map((p) => <p key={p} className="reading mt-4 text-[1.125rem] leading-relaxed text-ink-muted">{p}</p>)}
            </div>
            {s.screen && <div className="min-w-0"><Screenshot screen={s.screen} sizes="(min-width: 1024px) 680px, 100vw" /></div>}
          </div>
          {s.points && (
            <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.points.map((p) => (
                <div key={p.title} className="min-w-0 rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-7">
                  <dt className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">{p.title}</dt>
                  <dd className="mt-2 text-16 text-ink-muted">{p.body}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}

      {topic.comparison && (
        <section aria-labelledby="compare" className={`${container} py-10 sm:py-14`}>
          <h2 id="compare" className={h2}>{topic.comparison.heading}</h2>
          <div className="mt-8 overflow-hidden rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white">
            <table className="w-full table-fixed text-left text-14 sm:text-16">
              <thead>
                <tr className="border-b border-ink/10">
                  <td className="p-3 sm:p-6" />
                  {topic.comparison.columns.map((c) => <th key={c} scope="col" className="p-3 font-display font-medium text-ink sm:p-6">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {topic.comparison.rows.map(([name, a, b]) => (
                  <tr key={name} className="border-b border-ink/[0.06] last:border-b-0">
                    <th scope="row" className="p-3 align-top font-medium text-ink sm:px-6 sm:py-4">{name}</th>
                    <td className="p-3 align-top text-ink-muted sm:px-6 sm:py-4">{a}</td>
                    <td className="p-3 align-top text-ink sm:px-6 sm:py-4">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="reading mt-3 text-14 text-ink-muted">{topic.comparison.note}</p>
        </section>
      )}

      {topic.sources && (
        <section aria-labelledby="sources" className={`${container} py-6`}>
          <h2 id="sources" className="text-[1.25rem]">Sources</h2>
          <ul className="reading mt-3 space-y-2 text-14 text-ink-muted">
            {topic.sources.map((s) => (
              <li key={s.href}><a href={s.href} className="underline underline-offset-4 hover:text-ink">{s.label}</a></li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="More about the product" className={`${container} py-10 sm:py-14`}>
        <div className="wash-navy rounded-[var(--radius-panel)] border border-ink/[0.06] p-7 sm:p-10">
          <Eyebrow>{product.audience}</Eyebrow>
          <p className="reading mt-5 text-[1.25rem] leading-relaxed text-ink">{product.summary}</p>
          <div className="mt-6"><ButtonLink href={`/${product.slug}`}>See {product.name}</ButtonLink></div>
          {related.length > 0 && (
            <ul className="mt-6 space-y-2 text-16">
              {related.map((t) => (
                <li key={t.slug}><Link href={topicPath(t)} className="text-ink underline underline-offset-4">{t.linkTitle}</Link></li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CommonQuestions items={topic.faq} heading={topic.faqHeading ?? `Questions about ${topic.title}`} />
      <DemoSection product={product.slug} />
    </main>
  );
}
