import { Plus } from 'lucide-react';
import { commonQuestions } from '@/content/common-questions';
import type { Question } from '@/content/products';
import { safeJsonLd } from '@/lib/json-ld';
import { whatsappLink } from '@/content/site';
import { Eyebrow } from './product-showcase';
import { NewTabCue } from './new-tab-cue';

const faqJsonLd = (items: readonly Question[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

/** Questions and answers, as native disclosure widgets so they work without JavaScript. Defaults to the site-wide questions. */
export function CommonQuestions({
  items = commonQuestions,
  heading = 'Common questions',
}: { items?: readonly Question[]; heading?: string }) {
  return (
    <section aria-labelledby="questions" className="py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(items)) }} />
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 sm:px-6 lg:grid-cols-[5fr_7fr]">
        <div className="min-w-0">
          <Eyebrow>Questions</Eyebrow>
          <h2 id="questions" className="mt-5 text-[2rem] sm:text-[2.75rem]">{heading}</h2>
          <p className="mt-4 text-16 text-ink-muted">
            Something else you need to know?{' '}
            <a
              href={whatsappLink('Hello ILACORE, I have a question.')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              Ask us on WhatsApp<NewTabCue />
            </a>
          </p>
        </div>
        <div className="min-w-0 overflow-hidden rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white">
          {items.map((f) => (
            <details key={f.question} className="group border-b border-ink/[0.06] last:border-b-0">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[1.0625rem] font-medium tracking-[-0.01em] text-ink transition-colors hover:bg-paper/60 [&::-webkit-details-marker]:hidden">
                {f.question}
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-ink/10">
                  <Plus
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  />
                </span>
              </summary>
              <p className="reading px-6 pb-6 text-16 text-ink-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
