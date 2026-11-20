import type { ProductSlug } from '@/content/products';
import { whatsappLink } from '@/content/site';
import { ButtonLink } from './button-link';

export function DemoSection({ product, heading = 'Book a demo' }: { product?: ProductSlug; heading?: string }) {
  const href = product ? `/demo?product=${product}` : '/demo';
  return (
    <section aria-labelledby="demo-cta" data-surface="dark" className="bg-navy-deep py-16 text-white sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <h2 id="demo-cta" className="text-31 text-white sm:text-39">{heading}</h2>
        <p className="reading mt-4 text-20 text-white/85">
          We&apos;ll show you the system on your own tanks or vehicles and explain what installation involves. It takes about 30 minutes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={href}>Book a demo</ButtonLink>
          <ButtonLink href={whatsappLink('Hello ILACORE, I would like a demo.')} variant="outline-light">Chat on WhatsApp</ButtonLink>
        </div>
      </div>
    </section>
  );
}
