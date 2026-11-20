import Image from 'next/image';
import type { Screen } from '@/content/products';

export function Screenshot({ screen, priority = false, sizes = '(min-width: 1024px) 640px, 100vw' }: { screen: Screen; priority?: boolean; sizes?: string }) {
  if (!screen.src) {
    return (
      <div
        role="img"
        aria-label={`${screen.alt} (placeholder)`}
        className="flex aspect-[16/10] w-full min-w-0 flex-col justify-end rounded-panel border border-line bg-[linear-gradient(#0e1a2c,#050b14)] p-5"
      >
        <span className="text-14 text-white/80">Screenshot placeholder</span>
        <span className="font-display text-20 text-white">{screen.caption}</span>
      </div>
    );
  }
  return (
    <Image
      src={screen.src}
      alt={screen.alt}
      width={screen.width}
      height={screen.height}
      sizes={sizes}
      priority={priority}
      className="h-auto w-full rounded-panel border border-line"
    />
  );
}
