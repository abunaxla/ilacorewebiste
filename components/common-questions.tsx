import { Plus } from 'lucide-react';
import { commonQuestions } from '@/content/common-questions';
import { safeJsonLd } from '@/lib/json-ld';
import { whatsappLink } from '@/content/site';
import { NewTabCue } from './new-tab-cue';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: commonQuestions.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

/** Common questions, as native disclosure widgets so they work without JavaScript. */
export function CommonQuestions() {
  return (
    <section aria-labelledby="questions" className="border-t border-line bg-white py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[4fr_8fr]">
        <div className="min-w-0">
          <h2 id="questions" className="text-31 sm:text-39">Common questions</h2>
          <p className="mt-4 text-16 text-ink-muted">
            Something else you need to know?{' '}
            <a
              href={whatsappLink('Hello ILACORE, I have a question.')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-navy underline decoration-navy decoration-2 underline-offset-4"
            >
              Ask us on WhatsApp<NewTabCue />
            </a>
          </p>
        </div>
        <div className="min-w-0 border-t-2 border-navy">
          {commonQuestions.map((f) => (
            <details key={f.question} className="group border-b border-line">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-20 font-bold text-navy [&::-webkit-details-marker]:hidden">
                {f.question}
                <Plus
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="reading pb-5 text-16 text-ink-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
