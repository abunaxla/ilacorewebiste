import { Eyebrow } from './product-showcase';

/** The opening of an inner page: light, generous, with an optional pill label. */
export function PageHero({ title, lead, eyebrow }: { title: string; lead?: string; eyebrow?: string }) {
  return (
    <section className="relative isolate">
      {/* The wash fades out below the title, so it never ends in a hard edge against the cards. */}
      <div aria-hidden="true" className="wash-both pointer-events-none absolute inset-x-0 top-0 -z-10 h-[150%] [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
      <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className={`${eyebrow ? 'mt-6 ' : ''}max-w-4xl text-[2.75rem] sm:text-[4rem]`}>{title}</h1>
        {lead && <p className="reading mt-5 text-[1.25rem] leading-relaxed text-ink-muted">{lead}</p>}
      </div>
    </section>
  );
}
