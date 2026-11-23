import Link from 'next/link';
import { NewTabCue } from './new-tab-cue';

// Pill buttons. Ink on light surfaces, white on the dark stage. Brand colours are never a button fill.
const styles = {
  primary: 'bg-ink text-white hover:bg-[#262a38]',
  light: 'bg-white text-ink hover:bg-white/85',
  'ghost-light': 'border border-white/25 text-white hover:border-white/60 hover:bg-white/5',
  ghost: 'border border-ink/15 bg-white text-ink hover:border-ink/40',
} as const;

export type ButtonVariant = keyof typeof styles;

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
}: {
  href: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith('http');
  const sizing = size === 'sm' ? 'min-h-10 px-4 text-14' : 'min-h-12 px-6 text-16';
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-display font-medium tracking-[-0.01em] transition-colors duration-200 motion-reduce:transition-none ${sizing} ${styles[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <NewTabCue />}
    </Link>
  );
}
