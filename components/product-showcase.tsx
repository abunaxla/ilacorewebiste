import Image from 'next/image';

/** A small pill label above a heading. The dot carries the brand: navy into gold. */
export function Eyebrow({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  const look =
    tone === 'dark' ? 'border-white/15 bg-white/[0.06] text-white/90' : 'border-ink/10 bg-white text-ink';
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-14 font-medium ${look}`}>
      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-navy-bright to-gold" />
      {children}
    </p>
  );
}

/** A real screenshot inside a quiet browser window. */
export function BrowserFrame({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = '(min-width: 1024px) 1040px, 100vw',
  crop,
}: {
  crop?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.55)] ring-1 ring-white/10">
      <div aria-hidden="true" className="flex h-9 items-center gap-1.5 border-b border-ink/[0.06] bg-[#f3f3f1] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
      </div>
      <div className={crop ? `${crop} overflow-hidden` : undefined}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={crop ? 'h-full w-full object-cover object-left-top' : 'h-auto w-full'}
        />
      </div>
    </div>
  );
}

/** A piece of real product UI, cut from a screenshot, floating on a card. */
export function Tile({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(min-width: 1024px) 420px, 80vw',
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`float-card ${className}`}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="h-auto w-full" />
    </div>
  );
}

/** A rounded card in a bento grid: a short title and body, then the product underneath. */
export function BentoCard({
  title,
  body,
  wash = 'white',
  layout = 'stack',
  className = '',
  children,
}: {
  title: string;
  body?: string;
  wash?: 'white' | 'gold' | 'navy' | 'both';
  layout?: 'stack' | 'row';
  className?: string;
  children?: React.ReactNode;
}) {
  const bg = { white: 'bg-white', gold: 'wash-gold', navy: 'wash-navy', both: 'wash-both' }[wash];
  const row = layout === 'row';
  return (
    <div
      className={`flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-panel)] border border-ink/[0.06] ${row ? 'sm:flex-row sm:items-center sm:justify-between' : ''} ${bg} ${className}`}
    >
      <div className={`p-7 sm:p-9 ${row ? 'sm:max-w-lg' : ''}`}>
        <h3 className="text-[1.375rem] leading-tight tracking-[-0.025em]">{title}</h3>
        {body && <p className="mt-2 max-w-md text-16 text-ink-muted">{body}</p>}
      </div>
      {children && (
        <div className={row ? 'px-7 pb-7 sm:p-9' : 'flex flex-1 items-center px-7 pb-7 sm:px-9 sm:pb-9 [&>*]:w-full'}>{children}</div>
      )}
    </div>
  );
}
