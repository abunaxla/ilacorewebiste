import { Cctv, Cpu, Fuel, Monitor, RadioTower, Smartphone } from 'lucide-react';
import type { ChainIcon, ChainStep } from '@/content/products';

const icons: Record<ChainIcon, typeof Fuel> = {
  pump: Fuel,
  controller: Cpu,
  network: RadioTower,
  dashboard: Monitor,
  camera: Cctv,
  phone: Smartphone,
};

/** How a reading travels from the site or cab to the screen. A real sequence, so it is an ordered list. */
export function InstallChain({ steps }: { steps: ChainStep[] }) {
  return (
    <ol className="mt-10 grid gap-x-6 lg:grid-cols-4">
      {steps.map((s, i) => {
        const Icon = icons[s.icon];
        const last = i === steps.length - 1;
        return (
          <li key={s.label} className="relative flex gap-4 pb-8 lg:block lg:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-6 top-12 w-px bg-line lg:bottom-auto lg:left-12 lg:right-[-1.5rem] lg:top-6 lg:h-px lg:w-auto"
              />
            )}
            <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-panel border border-navy bg-white text-navy">
              <Icon size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 lg:mt-4 lg:pr-4">
              <p className="font-display text-20 font-bold text-navy">{s.label}</p>
              <p className="mt-1 text-16 text-ink-muted">{s.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
