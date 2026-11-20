import Link from 'next/link';
import { navItems } from '@/content/site';
import { ButtonLink } from './button-link';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';

export function SiteHeader() {
  const items = navItems();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="ILACORE home" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex gap-6">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-display text-16 font-semibold text-navy hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ButtonLink href="/demo">Book a demo</ButtonLink>
          <MobileMenu items={items} />
        </div>
      </div>
    </header>
  );
}
