'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-line text-navy lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper">
        <SheetTitle className="font-display text-20 text-navy">Menu</SheetTitle>
        <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-control px-3 py-3 font-display text-20 text-navy hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
