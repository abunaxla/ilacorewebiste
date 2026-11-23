'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Maximize2, X } from 'lucide-react';
import type { Screen } from '@/content/products';

type Props = { screen: Screen; priority?: boolean; sizes?: string; tone?: 'light' | 'dark' };

/** A real product screenshot. Click or press Enter to see it full size. */
export function Screenshot({ screen, priority = false, sizes = '(min-width: 1024px) 640px, 100vw', tone = 'light' }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <figure className="min-w-0">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="float-card relative block w-full cursor-zoom-in"
      >
        <Image
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full"
        />
        <span className="sr-only">. Enlarge this screenshot.</span>
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/80 text-white backdrop-blur"
        >
          <Maximize2 size={16} />
        </span>
      </button>
      <figcaption className={`mt-3 text-14 ${tone === 'dark' ? 'text-white/80' : 'text-ink-muted'}`}>
        {screen.caption}. Shown with demo data.
      </figcaption>
      <dialog
        ref={dialog}
        aria-label={screen.caption}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
        className="m-auto max-h-[92vh] w-[min(96vw,1440px)] max-w-none overflow-hidden rounded-[20px] bg-white p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4 border-b border-ink/[0.06] px-4 py-2">
          <p className="font-display text-16 font-medium text-ink">{screen.caption}</p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-14 text-ink hover:bg-paper"
          >
            <X size={18} aria-hidden="true" />
            Close
          </button>
        </div>
        <div className="max-h-[calc(92vh-3.75rem)] overflow-auto">
          <Image
            src={screen.src}
            alt={screen.alt}
            width={screen.width}
            height={screen.height}
            sizes="96vw"
            className="h-auto w-full min-w-[820px]"
          />
        </div>
      </dialog>
    </figure>
  );
}
