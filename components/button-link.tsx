import Link from 'next/link';
import { NewTabCue } from './new-tab-cue';

const styles = {
  gold: 'bg-gold text-navy-deep hover:bg-[#e6b252]',
  navy: 'bg-navy text-white hover:bg-navy-deep',
  'outline-light': 'border border-white/50 text-white hover:border-white',
  'outline-dark': 'border border-line text-navy hover:border-navy',
} as const;

export function ButtonLink({
  href,
  variant = 'gold',
  children,
  className = '',
}: {
  href: string;
  variant?: keyof typeof styles;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith('http');
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center rounded-control px-5 font-display text-16 font-bold ${styles[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <NewTabCue />}
    </Link>
  );
}
