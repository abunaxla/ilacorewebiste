/** A product's three outcomes as a ruled list. Fills the column where no screenshot exists yet. */
export function OutcomeList({ items, tone = 'light' }: { items: readonly string[]; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <ul className={`border-t-2 ${dark ? 'border-white/60' : 'border-navy'}`}>
      {items.map((o) => (
        <li
          key={o}
          className={`border-b py-5 font-display text-20 sm:text-25 ${dark ? 'border-white/20 text-white' : 'border-line text-navy'}`}
        >
          {o}
        </li>
      ))}
    </ul>
  );
}
