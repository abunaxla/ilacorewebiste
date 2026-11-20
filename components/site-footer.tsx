import Link from 'next/link';
import { NewTabCue } from './new-tab-cue';
import { liveProducts } from '@/content/products';
import { site, telLink, whatsappLink } from '@/content/site';
import { Logo } from './logo';

const link = 'underline decoration-white/50 underline-offset-4 hover:decoration-white';

export function SiteFooter() {
  return (
    <footer data-surface="dark" className="bg-navy-deep text-white/80">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="white" />
          <p className="mt-4 max-w-sm text-14">Fuel and fleet software for operators across {site.regions}.</p>
        </div>
        <nav aria-label="Products">
          <h2 className="font-display text-16 text-white">Products</h2>
          <ul className="mt-3 space-y-2 text-14">
            {liveProducts().map((p) => (
              <li key={p.slug}><Link href={`/${p.slug}`} className={link}>{p.name}</Link></li>
            ))}
            <li><Link href="/solutions" className={link}>All solutions</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-16 text-white">Contact</h2>
          <ul className="mt-3 space-y-2 text-14">
            <li><a href={`mailto:${site.email}`} className={link}>{site.email}</a></li>
            <li><a href={`mailto:${site.infoEmail}`} className={link}>{site.infoEmail}</a></li>
            {site.phone && <li><a href={telLink()} className={link}>{site.phone}</a></li>}
            <li><a href={whatsappLink()} className={link} target="_blank" rel="noopener noreferrer">Chat on WhatsApp<NewTabCue /></a></li>
          </ul>
        </div>
        <nav aria-label="Legal">
          <h2 className="font-display text-16 text-white">Legal</h2>
          <ul className="mt-3 space-y-2 text-14">
            <li><Link href="/privacy" className={link}>Privacy</Link></li>
            <li><Link href="/terms" className={link}>Terms</Link></li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-[1280px] px-4 pb-8 text-14 text-white/70 sm:px-6">&copy; {new Date().getFullYear()} {site.legalEntity}</p>
    </footer>
  );
}
