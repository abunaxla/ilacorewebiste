'use client';

import { useSearchParams } from 'next/navigation';

export function DemoHeading() {
  const interest = useSearchParams().get('intent') === 'interest';
  return <h1 className="text-39 sm:text-49">{interest ? 'Register your interest' : 'Book a demo'}</h1>;
}
