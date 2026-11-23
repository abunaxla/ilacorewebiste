import type { Metadata } from 'next';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { NewTabCue } from '@/components/new-tab-cue';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { site, telLink, whatsappLink } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'ILACORE builds ILACORE FMS for fuel stations and ILACORE Telematics for vehicle fleets, across Africa and the Middle East.',
  alternates: { canonical: '/about' },
};

const row = 'flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-16 text-ink transition-colors hover:bg-paper';
const chip = 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-ink/[0.06]';

export default function About() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero
        eyebrow="About"
        title="About ILACORE"
        lead={`ILACORE builds systems for fuel stations and for vehicle fleets across ${site.regions}.`}
      />
      <div className="mx-auto grid max-w-[1240px] gap-4 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-[7fr_5fr]">
        <div className="min-w-0 rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-7 sm:p-10">
          <div className="reading space-y-4 text-[1.125rem] leading-relaxed text-ink">
            {/* CONFIRM: add founding, HQ and countries served once ILACORE supplies them (spec section 10). */}
            <p>We install, connect and support every system ourselves, so one team answers for the equipment we fit and the dashboard on your screen.</p>
            <p className="text-ink-muted">Our products are built for patchy coverage and long distances, because that is where our customers work.</p>
          </div>
        </div>
        <section aria-labelledby="contact" className="min-w-0 rounded-[var(--radius-panel)] border border-ink/[0.06] bg-white p-5 sm:p-7">
          <h2 id="contact" className="px-3 text-[1.5rem] tracking-[-0.025em]">Contact</h2>
          <ul className="mt-4 space-y-1">
            <li><a className={row} href={`mailto:${site.email}`}><span className={chip}><Mail size={16} aria-hidden="true" /></span>{site.email}</a></li>
            <li><a className={row} href={`mailto:${site.infoEmail}`}><span className={chip}><Mail size={16} aria-hidden="true" /></span>{site.infoEmail}</a></li>
            {site.phone && <li><a className={row} href={telLink()}><span className={chip}><Phone size={16} aria-hidden="true" /></span>{site.phone}</a></li>}
            <li><a className={row} href={whatsappLink()} target="_blank" rel="noopener noreferrer"><span className={chip}><MessageCircle size={16} aria-hidden="true" /></span>Chat on WhatsApp<NewTabCue /></a></li>
          </ul>
        </section>
      </div>
      <DemoSection />
    </main>
  );
}
