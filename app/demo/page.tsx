import type { Metadata } from 'next';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { NewTabCue } from '@/components/new-tab-cue';
import { Eyebrow } from '@/components/product-showcase';
import { site, telLink, whatsappLink } from '@/content/site';
import { DemoForm } from './demo-form';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? null;

export const metadata: Metadata = {
  title: 'Book a demo',
  description: 'Book a demo of ILACORE FMS or ILACORE Telematics. We reply within one working day.',
  alternates: { canonical: '/demo' },
};

const row = 'flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-16 text-ink transition-colors hover:bg-paper';
const chip = 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-ink/[0.06]';

// Reads ?product= and ?intent= on the server, so the heading and form are in the first HTML.
// Rendering per request is cheap here and avoids the layout shift a client-only form caused.
export default async function DemoPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const interest = first(params.intent) === 'interest';
  return (
    <main id="main" tabIndex={-1} className="wash-both">
      <div className="mx-auto max-w-[1240px] px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <Eyebrow>{interest ? 'Coming soon' : 'Demo'}</Eyebrow>
        <h1 className="mt-6 text-[2.75rem] sm:text-[4rem]">{interest ? 'Register your interest' : 'Book a demo'}</h1>
        <p className="reading mt-5 text-[1.25rem] leading-relaxed text-ink-muted">Tell us a little about your operation. We&apos;ll reply within one working day to arrange a time.</p>
        <div className="mt-12 grid items-start gap-4 lg:grid-cols-[7fr_4fr]">
          <div className="min-w-0 rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-6 sm:p-10">
            <DemoForm preselected={first(params.product)} />
          </div>
          <aside aria-labelledby="direct" className="min-w-0 rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-5 sm:p-7">
            <h2 id="direct" className="px-3 text-[1.375rem] tracking-[-0.025em]">Prefer to talk now?</h2>
            <ul className="mt-4 space-y-1">
              <li><a className={row} href={whatsappLink('Hello ILACORE, I would like a demo.')} target="_blank" rel="noopener noreferrer"><span className={chip}><MessageCircle size={16} aria-hidden="true" /></span>Chat on WhatsApp<NewTabCue /></a></li>
              {site.phone && <li><a className={row} href={telLink()}><span className={chip}><Phone size={16} aria-hidden="true" /></span>{site.phone}</a></li>}
              <li><a className={row} href={`mailto:${site.email}`}><span className={chip}><Mail size={16} aria-hidden="true" /></span>{site.email}</a></li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
