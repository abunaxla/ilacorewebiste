/** A product's outcomes as quiet glass rows. Fills the column where no screenshot exists yet. */
export function OutcomeList({ items, tone = 'light' }: { items: readonly string[]; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <ul className="space-y-3">
      {items.map((o) => (
        <li
          key={o}
          className={`rounded-[16px] px-6 py-5 font-display text-[1.25rem] font-medium tracking-[-0.02em] ${dark ? 'bg-white/[0.07] text-white ring-1 ring-white/10' : 'bg-white text-ink ring-1 ring-ink/[0.06]'}`}
        >
          {o}
        </li>
      ))}
    </ul>
  );
}
