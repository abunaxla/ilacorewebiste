import type { ProductSlug } from '@/content/products';
import { whatsappLink } from '@/content/site';
import { ButtonLink } from './button-link';

/** The closing call to action: the dark stage again, inset like the hero. */
export function DemoSection({ product, heading = 'Book a demo' }: { product?: ProductSlug; heading?: string }) {
  const href = product ? `/demo?product=${product}` : '/demo';
  return (
    <section aria-labelledby="demo-cta" className="px-3 py-3 sm:px-4 sm:py-4">
      <div data-surface="dark" className="stage overflow-hidden rounded-[var(--radius-stage)] text-white">
        <div className="mx-auto max-w-[1240px] px-6 py-20 text-center sm:px-10 sm:py-28">
          <h2 id="demo-cta" className="text-[2.5rem] text-white sm:text-[3.5rem]">{heading}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.125rem] leading-relaxed text-white/75">
            We&apos;ll walk you through the system and explain what installation involves.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={href} variant="light">Book a demo</ButtonLink>
            <ButtonLink href={whatsappLink('Hello ILACORE, I would like a demo.')} variant="ghost-light">Chat on WhatsApp</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
