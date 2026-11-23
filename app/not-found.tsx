import { ButtonLink } from '@/components/button-link';
import { Eyebrow } from '@/components/product-showcase';

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="wash-both">
      <div className="mx-auto flex min-h-[60vh] max-w-[1240px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-6 text-[2.5rem] sm:text-[3.5rem]">This page doesn&apos;t exist.</h1>
        <p className="mt-5 max-w-xl text-[1.125rem] leading-relaxed text-ink-muted">Check the address, or go to the home page to find FMS and Telematics.</p>
        <div className="mt-8"><ButtonLink href="/">Go to the home page</ButtonLink></div>
      </div>
    </main>
  );
}
