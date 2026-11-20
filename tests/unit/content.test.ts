import { describe, expect, it } from 'vitest';
import { comingSoonProducts, getProduct, liveProducts, products } from '@/content/products';
import { industries } from '@/content/industries';
import { countries } from '@/content/countries';
import { navItems, whatsappLink } from '@/content/site';

const banned = /seamless|unlock|empower/i;

describe('products', () => {
  it('has unique slugs', () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every live product at least one screen, three outcomes and features', () => {
    for (const p of liveProducts()) {
      expect(p.screens.length).toBeGreaterThan(0);
      expect(p.outcomes).toHaveLength(3);
      expect(p.featureGroups.length).toBeGreaterThan(0);
    }
  });

  it('gives every live feature group at least one screenshot', () => {
    for (const p of liveProducts())
      for (const g of p.featureGroups) expect(g.features.some((f) => f.screen)).toBe(true);
  });

  it('ships FMS and Telematics as live and LPG as coming soon', () => {
    expect(liveProducts().map((p) => p.slug)).toEqual(['fms', 'telematics']);
    expect(comingSoonProducts().map((p) => p.slug)).toEqual(['lpg']);
  });

  it('never lists the driver companion or crash SOS as a live feature', () => {
    const t = getProduct('telematics')!;
    expect(JSON.stringify(t.featureGroups).toLowerCase()).not.toMatch(/companion|\bsos\b/);
    const soon = JSON.stringify(t.comingSoon).toLowerCase();
    expect(soon).toMatch(/companion/);
    expect(soon).toMatch(/\bsos\b/);
  });

  it('points only at industries that exist', () => {
    const known = new Set(industries.map((i) => i.slug));
    for (const p of products) for (const s of p.industries) expect(known.has(s)).toBe(true);
  });

  it('avoids banned marketing words', () => {
    expect(JSON.stringify(products)).not.toMatch(banned);
    expect(JSON.stringify(industries)).not.toMatch(banned);
  });
});

describe('site', () => {
  it('builds nav from live products', () => {
    expect(navItems().map((n) => n.href)).toEqual(['/fms', '/telematics', '/solutions', '/industries', '/about']);
  });

  it('builds a wa.me link with digits only', () => {
    expect(whatsappLink('Hi')).toMatch(/^https:\/\/wa\.me\/\d+\?text=Hi$/);
  });

  it('lists countries without duplicates', () => {
    expect(new Set(countries).size).toBe(countries.length);
    expect(countries).toContain('Kenya');
    expect(countries).toContain('United Arab Emirates');
  });
});
