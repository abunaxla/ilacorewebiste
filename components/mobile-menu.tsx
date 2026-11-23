'use client';

import { useState } from 'react';
import { NavLink } from '@/components/nav-link';
import { ButtonLink } from '@/components/button-link';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper">
        <SheetTitle className="font-display text-20 text-ink">Menu</SheetTitle>
        <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 font-display text-20 text-ink hover:bg-white"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <ButtonLink href="/demo" className="mt-4 justify-center">Book a demo</ButtonLink>
      </SheetContent>
    </Sheet>
  );
}
