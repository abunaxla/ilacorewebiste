'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { STATIC_PHASE, instrumentState, phaseAt, resumeOrigin } from './model';
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
  const [paused, setPaused] = useState(false);
  const heldPhase = useRef(0);

  useEffect(() => {
    if (reduced || paused) return;
    let raf = 0;
    const origin = resumeOrigin(performance.now(), heldPhase.current);
    const tick = (now: number) => {
      heldPhase.current = phaseAt(now, origin);
      setLivePhase(heldPhase.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, paused]);

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
      <p aria-hidden="true" className="mb-3 text-14 text-white/70">Illustration</p>
      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <svg viewBox="0 0 440 250" className="h-auto w-full" aria-hidden="true">
          <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx="40" cy="210" r="5" fill="#ffffff" fillOpacity="0.6" />
          <circle cx="400" cy="40" r="5" fill="#ffffff" fillOpacity="0.6" />
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
        <div className="min-w-0"><dt className="text-white/70">DELIVERY</dt><dd className="text-20">{s.delivered > 0 ? `${fmt(s.delivered)} L` : 'En route'}</dd></div>
        <div className="min-w-0"><dt className="text-white/70">SOLD</dt><dd className="text-20">{fmt(s.sold)} L</dd></div>
        <div className="min-w-0"><dt className="text-white/70">TRUCK</dt><dd className="text-20 text-gold">{s.kmToGo > 0 ? `${fmt(s.kmToGo)} km to go` : 'Arrived'}</dd></div>
      </dl>
      {!reduced && (
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="mt-4 inline-flex min-h-11 min-w-11 items-center rounded-control border border-white/40 px-4 text-14 text-white hover:bg-white/10"
        >
          {paused ? 'Play animation' : 'Pause animation'}
        </button>
      )}
      <figcaption className="sr-only">
        Illustration: a delivery truck drives from the Mombasa depot to Kampala station 04 while the station&apos;s diesel
        tank is sold down. The instrument shows the tank level, litres sold and litres delivered, and how far the
        tracked truck has left to go.
      </figcaption>
    </figure>
  );
}
