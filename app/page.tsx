import type { Metadata } from 'next';
import Image from 'next/image';
import { CloudOff, Smartphone, UsersRound, Wrench } from 'lucide-react';
import { ButtonLink } from '@/components/button-link';
import { CommonQuestions } from '@/components/common-questions';
import { DemoSection } from '@/components/demo-section';
import { OfflineDiagram } from '@/components/offline-diagram';
import { BentoCard, BrowserFrame, Eyebrow, Tile } from '@/components/product-showcase';
import { comingSoonProducts, getProduct } from '@/content/products';
import { whatsappLink } from '@/content/site';

export const metadata: Metadata = {
  title: { absolute: 'ILACORE: visibility for your key operations' },
  description: 'ILACORE brings visibility to your key operations, with live dashboards installed and supported by our own team across Africa and the Middle East.',
  alternates: { canonical: '/' },
};

const container = 'mx-auto max-w-[1240px] px-4 sm:px-6';

const facts = [
  { icon: Wrench, title: 'Installed by our own team', body: 'We fit, connect and support every system.' },
  { icon: CloudOff, title: 'Keeps recording offline', body: 'Nothing recorded is lost when the signal drops.' },
  { icon: Smartphone, title: 'Browser and Android', body: 'Dashboards on any computer, apps on Android.' },
  { icon: UsersRound, title: 'A role for every person', body: 'Each person sees only what they need.' },
];

const steps = [
  { title: 'Install', body: 'Our team fits the equipment: a forecourt controller at each station, or a dashcam in each vehicle.' },
  { title: 'Connect', body: 'Devices connect over the internet or mobile data and start sending readings.' },
  { title: 'Sign in', body: 'Your team signs in to its dashboard and sees what is happening, live.' },
  { title: 'Get alerts', body: 'You choose which alarms matter and who can see them.' },
];

export default function Home() {
  const fms = getProduct('fms')!;
  const telematics = getProduct('telematics')!;
  return (
    <main id="main" tabIndex={-1}>
      {/* Hero: the dark stage, lit by the brand, with the real product rising out of it. */}
      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div data-surface="dark" className="stage relative overflow-hidden rounded-[var(--radius-stage)] text-white">
          <div className={`${container} pt-20 text-center sm:pt-28`}>
            <div className="flex justify-center"><Eyebrow tone="dark">Vision at the Core</Eyebrow></div>
            <h1 className="mx-auto mt-6 max-w-4xl text-[2.75rem] text-white sm:text-[4.25rem] lg:text-[5rem]">
              Bring visibility to your key operations.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[1.125rem] leading-relaxed text-white/70 sm:text-[1.25rem]">
              ILACORE connects the equipment on your sites to live dashboards, so your team sees what is happening as it
              happens. Installed and supported by our own team across Africa and the Middle East.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/demo" variant="light">Book a demo</ButtonLink>
              <ButtonLink href={whatsappLink('Hello ILACORE, I would like to know more.')} variant="ghost-light">Chat on WhatsApp</ButtonLink>
            </div>
          </div>

          {/* One window per product, each labelled, never layered over each other. */}
          {/* On a phone the windows are taller, so each screen shows at about twice the scale and stays readable. */}
          <div className="mx-auto mt-16 grid max-w-[1180px] translate-y-4 gap-6 px-3 sm:mt-20 sm:translate-y-6 sm:gap-5 sm:px-8 md:grid-cols-2">
            <figure className="min-w-0">
              <figcaption className="mb-3"><Eyebrow tone="dark">{fms.name}, {fms.audience.toLowerCase()}</Eyebrow></figcaption>
              <BrowserFrame
                crop="aspect-[4/5] sm:aspect-[3/2]"
                src="/screens/fms-sales-report.png"
                alt="ILACORE FMS sales report: litres, price and gross sales of diesel and petrol for each day, with daily totals"
                width={1032}
                height={688}
                sizes="(min-width: 768px) 560px, 200vw"
                priority
              />
            </figure>
            <figure className="min-w-0">
              <figcaption className="mb-3"><Eyebrow tone="dark">{telematics.name}, {telematics.audience.toLowerCase()}</Eyebrow></figcaption>
              <BrowserFrame
                crop="aspect-[4/5] sm:aspect-[3/2]"
                src="/screens/telematics-live-map.png"
                alt="ILACORE Telematics live map of a four-vehicle demo fleet in Kisumu, with each vehicle's status and speed"
                width={1440}
                height={900}
                sizes="(min-width: 768px) 560px, 200vw"
                priority
              />
            </figure>
          </div>
        </div>
        <p className="mt-3 text-center text-14 text-ink-muted">Screens from ILACORE FMS and ILACORE Telematics, shown with demo data.</p>
      </section>

      {/* What every customer gets, whichever product they choose. */}
      <section aria-label="What you get with ILACORE" className={`${container} py-16 sm:py-20`}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-6">
              <Icon size={22} strokeWidth={1.75} aria-hidden="true" className="text-navy-bright" />
              <p className="mt-4 font-display text-16 font-medium tracking-[-0.01em] text-ink">{title}</p>
              <p className="mt-1 text-14 text-ink-muted">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ILACORE FMS */}
      <section aria-labelledby="fms" className={`${container} py-12 sm:py-16`}>
        <div className="max-w-3xl">
          <Eyebrow>{fms.name}, {fms.audience.toLowerCase()}</Eyebrow>
          <h2 id="fms" className="mt-5 text-[2.25rem] sm:text-[3.25rem]">{fms.promise}</h2>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-ink-muted">{fms.summary}</p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <BentoCard title={fms.outcomes[1]} body="Levels come from the tank probes, refreshed every 30 seconds." wash="gold" className="lg:col-span-5">
            <Tile src="/screens/tiles/fms-tanks-tile.png" alt="Two tanks: petrol at 7.7 percent with a low stock warning, diesel at 17.6 percent" width={334} height={298} sizes="(min-width: 1024px) 360px, 80vw" className="mx-auto max-w-[340px]" />
          </BentoCard>
          <BentoCard title={fms.outcomes[0]} body="Litres sold in every hour of the day, at every station." wash="white" className="lg:col-span-7">
            <Tile src="/screens/tiles/fms-hourly-tile.png" alt="Bar chart of litres sold in each hour at one station" width={796} height={208} sizes="(min-width: 1024px) 640px, 90vw" />
          </BentoCard>
          <BentoCard title={fms.outcomes[2]} body="Sales per product and per day, ready to download or email." wash="navy" className="lg:col-span-12">
            <Tile src="/screens/tiles/fms-sales-tile.png" alt="Sales per product: litres, price and gross sales of diesel and petrol for each day" width={714} height={249} sizes="(min-width: 1024px) 720px, 90vw" className="max-w-[720px]" />
          </BentoCard>
        </div>
        <div className="mt-8"><ButtonLink href="/fms" variant="ghost">Explore {fms.name}</ButtonLink></div>
      </section>

      {/* ILACORE Telematics */}
      <section aria-labelledby="telematics" className={`${container} py-12 sm:py-16`}>
        <div className="max-w-3xl">
          <Eyebrow>{telematics.name}, {telematics.audience.toLowerCase()}</Eyebrow>
          <h2 id="telematics" className="mt-5 text-[2.25rem] sm:text-[3.25rem]">{telematics.promise}</h2>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-ink-muted">{telematics.summary}</p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <BentoCard title={telematics.outcomes[0]} body="Position, speed and status for each vehicle, filtered the way you work." wash="navy" className="lg:col-span-7">
            <Tile src="/screens/telematics-fleet.png" alt="Vehicle list beside a live map of Kisumu, with four demo vehicles marked offline, driving or idle" width={810} height={684} sizes="(min-width: 1024px) 640px, 90vw" />
          </BentoCard>
          <BentoCard title={telematics.outcomes[1]} body="Detected on the camera itself, then listed for your team to review." wash="white" className="lg:col-span-5">
            <Tile src="/screens/tiles/telematics-alarms-tile.png" alt="Dashcam alarms: a forward collision warning and a fatigue alarm, each with time, vehicle and speed" width={457} height={257} sizes="(min-width: 1024px) 440px, 90vw" />
          </BentoCard>
          <BentoCard title={telematics.outcomes[2]} body="An AI dashcam in every vehicle, with road-facing and driver-facing cameras, GPS and 4G." wash="gold" layout="row" className="lg:col-span-12">
            <figure className="flex flex-col items-center">
              <div className="float-card p-5">
                <Image src="/hardware/dashcam.jpg" alt="The AI dashcam" width={393} height={635} sizes="160px" className="h-44 w-auto sm:h-52" />
              </div>
              <figcaption className="mt-3 text-14 text-ink-muted">The AI dashcam. Photo: MettaX.</figcaption>
            </figure>
          </BentoCard>
        </div>
        <div className="mt-8"><ButtonLink href="/telematics" variant="ghost">Explore {telematics.name}</ButtonLink></div>
      </section>

      {/* Works offline */}
      <section aria-labelledby="offline" className={`${container} py-12 sm:py-16`}>
        <div className="grid items-center gap-10 overflow-hidden rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-7 sm:p-12 lg:grid-cols-2">
          <div className="min-w-0">
            <Eyebrow>Works offline</Eyebrow>
            <h2 id="offline" className="mt-5 text-[2rem] sm:text-[2.75rem]">When the signal drops, nothing is lost.</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="font-display text-16 font-medium text-ink">At the station, with ILACORE FMS</dt>
                <dd className="mt-1 text-16 leading-relaxed text-ink-muted">The forecourt controller keeps every sale while the internet is down, and sends them once it is back.</dd>
              </div>
              <div>
                <dt className="font-display text-16 font-medium text-ink">On the road, with ILACORE Telematics</dt>
                <dd className="mt-1 text-16 leading-relaxed text-ink-muted">The dashcam keeps its positions while there is no mobile signal, and sends them once the signal returns.</dd>
              </div>
            </dl>
          </div>
          <OfflineDiagram />
        </div>
      </section>

      {/* How it starts */}
      <section aria-labelledby="how" className={`${container} py-12 sm:py-16`}>
        <Eyebrow>How it starts</Eyebrow>
        <h2 id="how" className="mt-5 max-w-2xl text-[2rem] sm:text-[2.75rem]">From install to your first alert.</h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-7">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper font-display text-14 font-medium text-ink ring-1 ring-ink/10">
                {i + 1}
              </span>
              <h3 className="mt-6 text-[1.25rem] tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 text-16 text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Coming next */}
      <section aria-labelledby="next" className={`${container} py-12 sm:py-16`}>
        {comingSoonProducts().map((p) => (
          <div key={p.slug} className="wash-both flex flex-col gap-8 rounded-[var(--radius-panel)] border border-ink/[0.06] p-7 sm:p-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Coming next</Eyebrow>
              <h2 id="next" className="mt-5 text-[2rem] sm:text-[2.75rem]">{p.name}</h2>
              <p className="mt-4 text-[1.125rem] leading-relaxed text-ink-muted">{p.summary}</p>
            </div>
            <ButtonLink href={`/demo?product=${p.slug}&intent=interest`} variant="primary" className="shrink-0 self-start lg:self-auto">Register interest</ButtonLink>
          </div>
        ))}
      </section>

      <CommonQuestions />

      <DemoSection />
    </main>
  );
}
