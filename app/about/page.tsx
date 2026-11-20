import type { Metadata } from 'next';
import { NewTabCue } from '@/components/new-tab-cue';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { site, telLink, whatsappLink } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'ILACORE builds fuel management and fleet telematics systems for operators across Africa and the Middle East.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero title="About ILACORE" lead={`ILACORE builds software and hardware for fuel and fleet operators across ${site.regions}.`} />
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
        <div className="reading space-y-4 text-16 text-ink">
          {/* CONFIRM: add founding, HQ and countries served once ILACORE supplies them (spec section 10). */}
          <p>We install, connect and support every system ourselves, so one team answers for the device in your tank or cab and the dashboard on your screen.</p>
          <p>Our products are built for patchy coverage, long distances and mixed fleets, because that is where our customers work.</p>
        </div>
        <section aria-labelledby="contact" className="mt-12">
          <h2 id="contact" className="text-25">Contact</h2>
          <ul className="mt-4 space-y-2 text-16">
            <li><a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a></li>
            {site.phone && <li><a className="text-navy underline" href={telLink()}>{site.phone}</a></li>}
            <li><a className="text-navy underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp<NewTabCue /></a></li>
          </ul>
        </section>
      </div>
      <DemoSection />
    </main>
  );
}
