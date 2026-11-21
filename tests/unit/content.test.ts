import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { commonQuestions } from '@/content/common-questions';
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

  it('gives every live product three outcomes, features and an install chain', () => {
    for (const p of liveProducts()) {
      expect(p.outcomes).toHaveLength(3);
      expect(p.featureGroups.length).toBeGreaterThan(0);
      expect(p.hardware.chain.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('points every screenshot at a real file with a description', () => {
    const screens = products.flatMap((p) => [...p.screens, ...p.featureGroups.flatMap((g) => g.features.flatMap((f) => (f.screen ? [f.screen] : [])))]);
    expect(screens.length).toBeGreaterThan(0);
    for (const s of screens) {
      expect(s.src).toMatch(/^\/screens\/[a-z0-9-]+\.png$/);
      expect(existsSync(join(process.cwd(), 'public', s.src))).toBe(true);
      expect(s.alt.length).toBeGreaterThan(20);
    }
  });

  it('points every hardware photo at a real file with a description and credit', () => {
    for (const p of liveProducts()) {
      const photo = p.hardware.photo;
      expect(photo).toBeDefined();
      expect(existsSync(join(process.cwd(), 'public', photo!.src))).toBe(true);
      expect(photo!.alt.length).toBeGreaterThan(20);
      expect(photo!.caption).toMatch(/Photo: /);
    }
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

describe('common questions', () => {
  it('has questions with full answers and no banned words', () => {
    expect(commonQuestions.length).toBeGreaterThanOrEqual(5);
    for (const q of commonQuestions) {
      expect(q.question.endsWith('?')).toBe(true);
      expect(q.answer.length).toBeGreaterThan(30);
    }
    expect(JSON.stringify(commonQuestions)).not.toMatch(banned);
  });

  it('never presents the driver companion, crash SOS or prices', () => {
    expect(JSON.stringify(commonQuestions).toLowerCase()).not.toMatch(/companion|\bsos\b|price|\$|ksh|ugx/);
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
