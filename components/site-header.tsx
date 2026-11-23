import Link from 'next/link';
import { navItems } from '@/content/site';
import { NavLink } from './nav-link';
import { ButtonLink } from './button-link';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';

export function SiteHeader() {
  const items = navItems();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-paper/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-4 sm:px-6">
        <Link href="/" aria-label="ILACORE home" className="shrink-0">
          <Logo className="h-8 w-auto" />
        </Link>
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex gap-7">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="text-14 font-medium text-ink/70 transition-colors hover:text-ink aria-[current=page]:text-ink"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ButtonLink href="/demo" size="sm">Book a demo</ButtonLink>
          <MobileMenu items={items} />
        </div>
      </div>
    </header>
  );
}
