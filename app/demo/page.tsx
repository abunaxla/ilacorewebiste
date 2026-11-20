import type { Metadata } from 'next';
import { NewTabCue } from '@/components/new-tab-cue';
import { Suspense } from 'react';
import { site, telLink, whatsappLink } from '@/content/site';
import { DemoForm } from './demo-form';
import { DemoHeading } from './demo-heading';

export const metadata: Metadata = {
  title: 'Book a demo',
  description: 'Book a demo of ILACORE FMS or ILACORE Telematics. We reply within one working day.',
  alternates: { canonical: '/demo' },
};

export default function DemoPage() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
      <Suspense fallback={<h1 className="text-39 sm:text-49">Book a demo</h1>}>
        <DemoHeading />
      </Suspense>
      <p className="reading mt-4 text-20 text-ink-muted">Tell us a little about your operation. We&apos;ll reply within one working day to arrange a time.</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_4fr]">
        <Suspense fallback={null}>
          <DemoForm />
        </Suspense>
        <aside aria-labelledby="direct" className="lg:border-l lg:border-line lg:pl-10">
          <h2 id="direct" className="text-25">Prefer to talk now?</h2>
          <ul className="mt-4 space-y-3 text-16">
            <li><a className="font-bold text-navy underline" href={whatsappLink('Hello ILACORE, I would like a demo.')} target="_blank" rel="noopener noreferrer">Chat on WhatsApp<NewTabCue /></a></li>
            {site.phone && <li><a className="text-navy underline" href={telLink()}>{site.phone}</a></li>}
            <li><a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
