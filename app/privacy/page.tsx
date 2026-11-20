import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What ILACORE collects through this website and why.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero title="Privacy policy" />
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
        <div className="reading space-y-4 text-16 [&_h2]:mt-8 [&_h2]:text-25">
          <p>This policy explains what {site.legalEntity} collects through this website and why.</p>
          <h2>What we collect</h2>
          <p>Only what you type into the demo form: your name, company, country, phone or WhatsApp number, the products you are interested in and, if you choose, your fleet or station size.</p>
          <h2>How we use it</h2>
          <p>We email it to our sales team so we can contact you about a demo. We don&apos;t sell it, and we don&apos;t share it with anyone else for marketing.</p>
          {/* CONFIRM: legal review */}
          <p>When you send the demo form, it is sent by email through Resend, a third-party email service, to {site.legalEntity}&apos;s sales inbox.</p>
          {/* CONFIRM: legal review */}
          <p>We also use your IP address briefly, in memory, to limit repeated submissions and stop abuse. Our web server keeps standard access logs.</p>
          <h2>Cookies and analytics</h2>
          <p>This website sets no tracking cookies and runs no analytics.</p>
          <h2>How long we keep it</h2>
          <p>We keep your request while we are discussing a demo or a contract with you, and delete it when you ask.</p>
          <h2>Your rights</h2>
          <p>To see, correct or delete what we hold about you, email <a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </div>
    </main>
  );
}
