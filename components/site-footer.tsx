import Link from 'next/link';
import { NewTabCue } from './new-tab-cue';
import { liveProducts } from '@/content/products';
import { site, telLink, whatsappLink } from '@/content/site';
import { Logo } from './logo';

const link = 'text-ink/70 transition-colors hover:text-ink';
const heading = 'font-display text-14 font-medium text-ink';

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/[0.06] bg-paper">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-8 w-auto" />
          <p className="mt-4 max-w-xs text-14 text-ink-muted">Software for fuel stations and vehicle fleets across {site.regions}.</p>
        </div>
        <nav aria-label="Products">
          <h2 className={heading}>Products</h2>
          <ul className="mt-4 space-y-3 text-14">
            {liveProducts().map((p) => (
              <li key={p.slug}><Link href={`/${p.slug}`} className={link}>{p.name}</Link></li>
            ))}
            <li><Link href="/solutions" className={link}>All solutions</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className={heading}>Contact</h2>
          <ul className="mt-4 space-y-3 text-14">
            <li><a href={`mailto:${site.email}`} className={link}>{site.email}</a></li>
            <li><a href={`mailto:${site.infoEmail}`} className={link}>{site.infoEmail}</a></li>
            {site.phone && <li><a href={telLink()} className={link}>{site.phone}</a></li>}
            <li><a href={whatsappLink()} className={link} target="_blank" rel="noopener noreferrer">Chat on WhatsApp<NewTabCue /></a></li>
          </ul>
        </div>
        <nav aria-label="Legal">
          <h2 className={heading}>Legal</h2>
          <ul className="mt-4 space-y-3 text-14">
            <li><Link href="/privacy" className={link}>Privacy</Link></li>
            <li><Link href="/terms" className={link}>Terms</Link></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-[1240px] border-t border-ink/[0.06] px-4 py-6 sm:px-6">
        <p className="text-14 text-ink-muted">&copy; {new Date().getFullYear()} {site.legalEntity}</p>
      </div>
    </footer>
  );
}
