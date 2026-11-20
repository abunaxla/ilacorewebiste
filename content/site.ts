import { liveProducts } from './products';

// Values marked CONFIRM must be checked with ILACORE before launch (spec §10, Task 14).
export const site = {
  name: 'ILACORE',
  legalEntity: 'ILACORE', // CONFIRM: registered legal entity name
  email: 'sales@ilacore.com', // CONFIRM
  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '', // CONFIRM: separate phone line, if any
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  regions: 'Africa and the Middle East',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ilacore.com',
};

export function whatsappLink(message?: string) {
  const digits = site.whatsapp.replace(/\D/g, '') || '0';
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export function telLink() {
  return `tel:${site.phone.replace(/[^\d+]/g, '')}`;
}

export function navItems() {
  return [
    ...liveProducts().map((p) => ({ href: `/${p.slug}`, label: p.name.replace('ILACORE ', '') })),
    { href: '/solutions', label: 'Solutions' },
    { href: '/industries', label: 'Industries' },
    { href: '/about', label: 'About' },
  ];
}
