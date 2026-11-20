import { ButtonLink } from '@/components/button-link';

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-[1280px] px-4 py-24 sm:px-6">
      <h1 className="text-39">This page doesn&apos;t exist.</h1>
      <p className="reading mt-4 text-20 text-ink-muted">Check the address, or go to the home page to find FMS and Telematics.</p>
      <div className="mt-8"><ButtonLink href="/" variant="navy">Go to the home page</ButtonLink></div>
    </main>
  );
}
