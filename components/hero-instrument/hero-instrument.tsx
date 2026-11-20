'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { CYCLE_MS, STATIC_PHASE, TANK_CAPACITY_L, instrumentState } from './model';
import { ROUTE, routePoint } from './route';

const QUERY = '(prefers-reduced-motion: reduce)';
const fmt = (n: number) => n.toLocaleString('en-US');
const label = { fill: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)' };

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function HeroInstrument() {
  // Static on the server and during hydration, so reduced-motion users never see motion.
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
  const [livePhase, setLivePhase] = useState(STATIC_PHASE);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setLivePhase(((now - start) % CYCLE_MS) / CYCLE_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const s = instrumentState(reduced ? STATIC_PHASE : livePhase);
  const truck = routePoint(s.truckProgress);
  const tankTop = 30 + 180 * (1 - s.tankFraction);

  return (
    <figure
      data-testid="hero-instrument"
      data-static={reduced ? 'true' : 'false'}
      data-surface="dark"
      className="min-w-0 rounded-panel border border-white/15 bg-navy-deep p-5 text-white"
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <svg viewBox="0 0 440 250" className="h-auto w-full" aria-hidden="true">
          <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx="40" cy="210" r="5" fill="#dca238" />
          <circle cx="400" cy="40" r="5" fill="#dca238" />
          <text x="52" y="236" {...label}>MOMBASA DEPOT</text>
          <text x="300" y="26" {...label}>KAMPALA STN 04</text>
          <circle cx={truck.x} cy={truck.y} r="12" fill="none" stroke="#1cd1a1" strokeOpacity="0.4" />
          <circle cx={truck.x} cy={truck.y} r="7" fill="#1cd1a1" />
        </svg>
        <svg viewBox="0 0 80 230" className="h-56 w-auto justify-self-start" aria-hidden="true">
          <rect x="10" y="30" width="60" height="180" rx="4" fill="none" stroke="rgba(255,255,255,0.4)" />
          <rect x="11" y={tankTop} width="58" height={210 - tankTop} rx="3" fill="#dca238" />
          <text x="10" y="20" {...label}>AGO T2</text>
        </svg>
      </div>
      <dl className="readout mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-14 sm:grid-cols-4">
        <div className="min-w-0"><dt className="text-white/70">TANK</dt><dd data-testid="tank-litres" className="text-20">{fmt(s.tankLitres)} L</dd></div>
        <div className="min-w-0"><dt className="text-white/70">DELIVERED</dt><dd className="text-20">{fmt(s.delivered)} L</dd></div>
        <div className="min-w-0"><dt className="text-white/70">SOLD</dt><dd className="text-20">{fmt(s.sold)} L</dd></div>
        <div className="min-w-0"><dt className="text-white/70">UNACCOUNTED</dt><dd className="text-20 text-gold">{fmt(s.unaccounted)} L</dd></div>
      </dl>
      <figcaption className="sr-only">
        Illustration: a diesel tank holding {fmt(s.tankLitres)} of {fmt(TANK_CAPACITY_L)} litres while a delivery truck drives
        from the depot to the station, with delivered, sold and unaccounted litres reconciled.
      </figcaption>
    </figure>
  );
}
