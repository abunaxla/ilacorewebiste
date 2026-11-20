export function PageHero({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="text-39 sm:text-49">{title}</h1>
        {lead && <p className="reading mt-4 text-20 text-ink-muted">{lead}</p>}
      </div>
    </section>
  );
}
