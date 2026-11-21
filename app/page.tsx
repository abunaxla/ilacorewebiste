import type { Metadata } from 'next';
import { ButtonLink } from '@/components/button-link';
import { CommonQuestions } from '@/components/common-questions';
import { DemoSection } from '@/components/demo-section';
import { OfflineDiagram } from '@/components/offline-diagram';
import { HeroInstrument } from '@/components/hero-instrument/hero-instrument';
import { ProductRow } from '@/components/product-row';
import { comingSoonProducts, liveProducts } from '@/content/products';
import { whatsappLink } from '@/content/site';

export const metadata: Metadata = {
  title: { absolute: 'ILACORE: fuel management and fleet telematics' },
  description: 'ILACORE FMS and ILACORE Telematics help fuel and fleet operators across Africa and the Middle East account for every litre and every kilometre.',
  alternates: { canonical: '/' },
};

const steps = [
  { title: 'Install', body: 'Our team fits the forecourt controller, tank probes or dashcams on site.' },
  { title: 'Connect', body: 'Devices connect over the internet or mobile data and start sending readings.' },
  { title: 'Dashboards', body: 'Your team signs in and sees live sales, stock, vehicles and history.' },
  { title: 'Alerts', body: 'You choose which alarms matter and who can see them.' },
];

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <section data-surface="dark" className="bg-navy text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[6fr_5fr]">
          <div className="min-w-0">
            <h1 className="text-39 text-white sm:text-49 lg:text-61">Account for every litre and every kilometre.</h1>
            <p className="reading mt-6 text-20 text-white/85">
              Every pump sale, tank level and vehicle, live, for fuel and fleet operators across Africa and the Middle East.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/demo">Book a demo</ButtonLink>
              <ButtonLink href={whatsappLink('Hello ILACORE, I would like to know more.')} variant="outline-light">Chat on WhatsApp</ButtonLink>
            </div>
          </div>
          <HeroInstrument />
        </div>
      </section>

      {liveProducts().map((p, i) => <ProductRow key={p.slug} product={p} mirrored={i % 2 === 1} />)}

      <section aria-labelledby="offline" className="border-t border-line bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="min-w-0">
            <h2 id="offline" className="text-31 sm:text-39">Works offline</h2>
            <p className="reading mt-4 text-20 text-ink-muted">
              Coverage drops on highways and at remote stations. The forecourt controller keeps every sale and the dashcam keeps its positions while offline, and both send them once the signal returns, so nothing recorded offline is lost.
            </p>
          </div>
          <OfflineDiagram />
        </div>
      </section>

      <section aria-labelledby="how" className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 id="how" className="text-31 sm:text-39">How it starts</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-l-2 border-navy pl-5">
                <span className="font-display text-25 font-bold text-navy">{i + 1}</span>
                <h3 className="mt-1 text-20">{s.title}</h3>
                <p className="mt-2 text-16 text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="next" className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 id="next" className="text-31 sm:text-39">Coming next</h2>
          {comingSoonProducts().map((p) => (
            <div key={p.slug} className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
              <div className="min-w-0">
                <h3 className="text-25">{p.name}</h3>
                <p className="reading mt-2 text-16 text-ink-muted">{p.summary}</p>
              </div>
              <ButtonLink href={`/demo?product=${p.slug}&intent=interest`} variant="outline-dark">Register interest</ButtonLink>
            </div>
          ))}
        </div>
      </section>

      <CommonQuestions />

      <DemoSection />
    </main>
  );
}
