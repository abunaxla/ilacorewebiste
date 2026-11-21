const Dot = ({ kind }: { kind: 'sent' | 'missing' | 'caught-up' }) => (
  <span
    className={
      kind === 'sent'
        ? 'h-3 w-3 rounded-full bg-navy'
        : kind === 'caught-up'
          ? 'h-3 w-3 rounded-full bg-gold ring-1 ring-navy'
          : 'h-3 w-3 rounded-full border border-dashed border-ink-muted'
    }
  />
);

const cell = 'flex items-center justify-center gap-2 py-4 sm:gap-3';
const phases = ['Online', 'No signal', 'Back online'];

/** Readings over time: the device never stops recording, and the dashboard catches up after a gap. */
export function OfflineDiagram() {
  return (
    <figure className="min-w-0 rounded-panel border border-line bg-paper p-5 sm:p-6">
      <div aria-hidden="true">
        <p className="text-14 text-ink-muted">Recorded on the device</p>
        <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-control border border-line bg-white">
          <div className={cell}><Dot kind="sent" /><Dot kind="sent" /><Dot kind="sent" /></div>
          <div className={`${cell} border-x border-dashed border-ink-muted`}><Dot kind="sent" /><Dot kind="sent" /><Dot kind="sent" /></div>
          <div className={cell}><Dot kind="sent" /><Dot kind="sent" /><Dot kind="sent" /></div>
        </div>
        <p className="mt-5 text-14 text-ink-muted">Shown on your dashboard</p>
        <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-control border border-line bg-white">
          <div className={cell}><Dot kind="sent" /><Dot kind="sent" /><Dot kind="sent" /></div>
          <div className={`${cell} border-x border-dashed border-ink-muted`}><Dot kind="missing" /><Dot kind="missing" /><Dot kind="missing" /></div>
          <div className={`${cell} flex-wrap`}><Dot kind="caught-up" /><Dot kind="caught-up" /><Dot kind="caught-up" /><Dot kind="sent" /><Dot kind="sent" /><Dot kind="sent" /></div>
        </div>
        <div className="mt-3 grid grid-cols-3 text-center font-display text-14 font-bold text-navy sm:text-16">
          {phases.map((p) => <span key={p}>{p}</span>)}
        </div>
        <p className="mt-5 flex items-center gap-2 text-14 text-ink-muted">
          <Dot kind="caught-up" /> Recorded with no signal, sent once it returned
        </p>
      </div>
      <figcaption className="sr-only">
        Diagram: the device records readings the whole time. While there is no signal the dashboard shows a gap, and
        when the signal returns the stored readings are sent, so the dashboard has every one.
      </figcaption>
    </figure>
  );
}
