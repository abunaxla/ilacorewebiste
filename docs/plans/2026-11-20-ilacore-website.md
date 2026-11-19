# ILACORE Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ILACORE B2B marketing site (book-a-demo focus, FMS + Telematics) and the files needed to run it on the FMS VPS behind the fms-prod Caddy.

**Architecture:** Next.js App Router with every page statically generated, built as a `standalone` Node server so the demo form's server action can run. Content lives in typed TypeScript files (`content/`), and pages are generated from it. Leads go through `lib/lead.ts` (zod validation, honeypot, in-memory rate limit, Resend over HTTPS). Deployment is a single Docker container joined to the `fms-prod_edge` network, routed by a Caddy snippet file the site owns.

**Tech Stack:** Next.js (latest, App Router, React 19), TypeScript, Tailwind CSS v4, shadcn/ui (Sheet only), zod, Vitest, Playwright + @axe-core/playwright, Docker (`node:24-alpine`), Caddy 2.11.

**Spec:** `docs/specs/2026-11-19-ilacore-website-design.md`. Read it before starting any task.

## Global Constraints

- Repo: `D:\ilacore website` (Git Bash path `/d/ilacore website`), branch `main`. Commit at the end of every task. End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Local Node is v24.15.0 and npm 11. **There is no Docker locally.** Never try to run Docker on this machine; images are built on the VPS.
- `core.autocrlf` is `true` on this machine. The repo's `.gitattributes` (Task 1) forces LF, so shell scripts survive `git archive`.
- Colour tokens (exact): navy `#010875`, navy-deep `#000133`, gold `#DCA238`, emerald `#1CD1A1`, paper `#F9F9FF`, ink `#141C29`, ink-muted `#454652`, line `#C6C5D4`.
- Gold means fuel, caution or the **Book a demo** button. It is never decorative. Emerald means live data only. Gold buttons use navy-deep text.
- Fonts: Nunito Sans (display/headings, tracking `-0.02em`), Inter (body, 16–18px, line length ≤ 75ch), JetBrains Mono (real readings only, `tabular-nums`).
- Type scale (px): 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61. Hero headline 61 desktop, 39 mobile.
- Radii: 4px for inputs, buttons and chips; 8px for panels and screenshots. No pills except status dots. No soft shadows; use tonal layers and 1px `line` hairlines.
- Layout is left-aligned. No uppercase labels and no decorative monospace on marketing pages (console styling is allowed only inside the hero instrument and screenshots). No grids of identical cards. Numbered markers only in "How it starts".
- Motion: only the hero instrument animates. No scroll-triggered fades. `prefers-reduced-motion: reduce` shows a static instrument.
- Copy: plain, specific, active voice, sentence case. Never use "seamless", "unlock" or "empower".
- **Never present the Telematics driver companion or crash SOS as live.** They are always labelled "Coming soon".
- No client logos and no invented customer numbers anywhere.
- Secrets are never committed. `.env.example` lists names only.
- Env vars: `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`. Test-only: `LEAD_TRANSPORT` (`resend` default, `mock` in tests), `LEAD_RATE_LIMIT` (default `5`).
- Quality: WCAG 2.2 AA, Lighthouse ≥ 95 mobile in all four categories, 360px–1440px+ with no horizontal scroll.
- **Go-ahead required from the user** before: any change in the FMS repository, any command that changes state on the FMS VPS, DNS changes, creating the Resend account, and every production deploy. Tasks 1–13 touch only this repo. Task 14 is the gated launch.

## Decisions taken while planning (small deviations from the spec)

1. **Source transfer uses `git archive | ssh … tar -x`, not rsync.** rsync isn't installed on this machine. As a bonus, only committed files are shipped.
2. **The honeypot is checked before zod validation.** Bots get a fake success even if the rest of their input is invalid. The spec lists zod first; this order leaks less.
3. **Form controls are native elements styled with Tailwind.** Native `<select>`, checkboxes and inputs are accessible and need no extra JS. shadcn is used only for the mobile menu (`Sheet`). The spec allows shadcn "only for form controls and the mobile menu", which is a ceiling.
4. **`NEXT_PUBLIC_*` values are passed as Docker build args.** Next.js inlines them at build time, so the VPS deploy script sources `.env` before `docker build`.
5. **Reloading Caddy is an open question for Task 14.** The FMS Caddy runs with its admin API off, so `caddy reload` won't work. Task 14 resolves this with the user: either the FMS change also sets `admin localhost:2019` (container-local, not published), or each snippet change restarts the Caddy container (a few seconds of FMS downtime).

## File structure

```
app/
  layout.tsx                 fonts, header, footer, skip link, base metadata, Organization JSON-LD
  globals.css                Tailwind v4 import + @theme tokens
  page.tsx                   Home
  [product]/page.tsx         Product template for live products (dynamicParams = false)
  solutions/page.tsx
  industries/page.tsx
  about/page.tsx
  demo/page.tsx              Demo page (server) wrapping the form
  demo/demo-heading.tsx      'use client' heading that reads ?intent
  demo/demo-form.tsx         'use client' form
  demo/actions.ts            'use server' requestDemo action
  privacy/page.tsx
  terms/page.tsx
  not-found.tsx
  sitemap.ts
  robots.ts
  opengraph-image.tsx
components/
  site-header.tsx            header + desktop nav + Book a demo
  mobile-menu.tsx            'use client', shadcn Sheet
  site-footer.tsx
  logo.tsx
  button-link.tsx            gold / navy / outline link-buttons
  screenshot.tsx             real image or clearly marked placeholder panel
  product-row.tsx            wide screenshot + 3 outcomes, mirror option
  demo-section.tsx           shared navy-deep CTA
  page-hero.tsx              light page header for secondary pages
  hero-instrument/model.ts   pure state function (unit-tested)
  hero-instrument/hero-instrument.tsx   'use client' SVG + rAF loop
  ui/sheet.tsx               generated by shadcn
content/
  products.ts  industries.ts  countries.ts  site.ts
lib/
  lead.ts                    schema, parseLead, rate limiter, email formatting, transports, submitLead
  utils.ts                   generated by shadcn (cn)
public/brand/                cropped logo SVGs
scripts/
  crop-logos.mjs             one-off: tight viewBox for brand SVGs (uses Playwright's Chromium)
  deploy.sh                  local: tests, ship source, run remote deploy
  remote-deploy.sh           runs on the VPS via ssh: build, up, health check, rollback, prune
  rollback.sh                local: switch the VPS to the previous tag
deploy/
  compose.yml
  caddy/ilacore-site.preview.caddy
  caddy/ilacore-site.caddy
Dockerfile  .dockerignore  .env.example  .gitattributes
tests/unit/*.test.ts         Vitest
tests/e2e/*.spec.ts          Playwright
brand/                       original brand files, moved out of the repo root
```

---

### Task 1: Scaffold the project, tokens, fonts and test runners

**Files:**
- Create: everything `create-next-app` produces, then `.gitattributes`, `vitest.config.ts`, `playwright.config.ts`, `.env.example`, `tests/unit/smoke.test.ts`, `scripts/crop-logos.mjs`, `public/brand/*.svg`
- Move: the four `ILACORE LOGO*.svg`, `DESIGN.md` and `ilacore_fms_design_system_markdown_export.md` into `brand/`
- Modify: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `next.config.ts`, `package.json`, `.gitignore`

**Interfaces:**
- Produces: Tailwind utilities `bg-navy`, `bg-navy-deep`, `text-gold`, `bg-gold`, `text-emerald`, `bg-paper`, `text-ink`, `text-ink-muted`, `border-line`; `font-display`, `font-body`, `font-mono`; `text-14 … text-61`; `rounded-control` (4px), `rounded-panel` (8px); CSS classes `.reading` (max 75ch) and `.readout` (mono, tabular). Logo files `/brand/logo-color.svg`, `/brand/logo-white.svg`, `/brand/mark-color.svg`, `/brand/mark-white.svg`. npm scripts `dev`, `build`, `start`, `lint`, `test`, `test:e2e`.

- [ ] **Step 1: Force LF line endings and move brand files out of the root**

```bash
cd "/d/ilacore website"
printf '* text=auto eol=lf\n*.svg text eol=lf\n*.png binary\n*.jpg binary\n*.webp binary\n*.avif binary\n' > .gitattributes
git add .gitattributes && git add --renormalize .
mkdir -p brand
git mv "ILACORE LOGO color.svg" "ILACORE LOGO COLOR ONLY.svg" "ILACORE LOGO WHITE.svg" "ILACORE LOGO WHITE ONLY.svg" DESIGN.md ilacore_fms_design_system_markdown_export.md brand/
```

- [ ] **Step 2: Scaffold Next.js into a temporary folder and move it up**

`create-next-app` refuses a non-empty folder, so scaffold beside the repo files.

```bash
cd "/d/ilacore website"
npx create-next-app@latest _scaffold --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
rm -rf _scaffold/.git
cp -r _scaffold/. .
rm -rf _scaffold
npm install
```

If a flag is rejected, run `npx create-next-app@latest --help` and use the equivalent. Keep the App Router, TypeScript, Tailwind, ESLint, root-level `app/` and the `@/*` alias. Delete the scaffold's sample SVGs in `public/`.

- [ ] **Step 3: Install dependencies**

```bash
npm install zod
npm install -D vitest @playwright/test @axe-core/playwright
npx playwright install chromium
```

- [ ] **Step 4: Set `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
```

- [ ] **Step 5: Replace `app/globals.css` with the token system**

```css
@import "tailwindcss";

@theme {
  --color-navy: #010875;
  --color-navy-deep: #000133;
  --color-gold: #dca238;
  --color-emerald: #1cd1a1;
  --color-paper: #f9f9ff;
  --color-ink: #141c29;
  --color-ink-muted: #454652;
  --color-line: #c6c5d4;

  --font-display: var(--font-nunito-sans), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;

  --text-14: 0.875rem;
  --text-16: 1rem;
  --text-20: 1.25rem;
  --text-25: 1.5625rem;
  --text-31: 1.9375rem;
  --text-39: 2.4375rem;
  --text-49: 3.0625rem;
  --text-61: 3.8125rem;

  --radius-control: 4px;
  --radius-panel: 8px;
}

@layer base {
  html { background: var(--color-paper); color: var(--color-ink); }
  body { font-family: var(--font-body); font-size: var(--text-16); line-height: 1.6; }
  h1, h2, h3 { font-family: var(--font-display); letter-spacing: -0.02em; line-height: 1.1; color: var(--color-navy); }
  :focus-visible { outline: 3px solid var(--color-gold); outline-offset: 2px; }
}

@layer components {
  .reading { max-width: 75ch; }
  .readout { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
}
```

- [ ] **Step 6: Replace `app/layout.tsx` with fonts and a bare body; placeholder home**

The header and footer are added in Task 3.

```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunito = Nunito_Sans({ subsets: ['latin'], variable: '--font-nunito-sans', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'ILACORE', template: '%s | ILACORE' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx` (Task 5 replaces it):

```tsx
export default function Home() {
  return <main id="main"><h1>ILACORE</h1></main>;
}
```

- [ ] **Step 7: Add test runners and env example**

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname) } },
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts'] },
});
```

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      LEAD_TRANSPORT: 'mock',
      LEAD_RATE_LIMIT: '50',
      NEXT_PUBLIC_SITE_URL: 'https://ilacore.com',
      NEXT_PUBLIC_WHATSAPP_NUMBER: '+254700000000',
    },
  },
});
```

`next start` prints a warning with `output: 'standalone'`. That's expected; it still serves the build.

In `package.json` scripts add `"test": "vitest run"` and `"test:e2e": "playwright test"`. Add `test-results/`, `playwright-report/` and `.env` to `.gitignore`, followed by `!.env.example`.

`.env.example`:

```
RESEND_API_KEY=
LEAD_TO_EMAIL=
LEAD_FROM_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=https://ilacore.com
```

- [ ] **Step 8: Write and run the smoke unit test**

`tests/unit/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('design tokens', () => {
  it('defines every brand colour exactly', () => {
    const css = readFileSync('app/globals.css', 'utf8').toLowerCase();
    for (const hex of ['#010875', '#000133', '#dca238', '#1cd1a1', '#f9f9ff', '#141c29', '#454652', '#c6c5d4']) {
      expect(css).toContain(hex);
    }
  });
});
```

Run: `npm test`. Expected: 1 passed.

- [ ] **Step 9: Crop the logos to a tight viewBox**

The brand SVGs sit on a 1366×768 artboard with a lot of empty space. `scripts/crop-logos.mjs` measures each one in Chromium and rewrites its viewBox:

```js
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const files = {
  'logo-color.svg': 'brand/ILACORE LOGO color.svg',
  'logo-white.svg': 'brand/ILACORE LOGO WHITE.svg',
  'mark-color.svg': 'brand/ILACORE LOGO COLOR ONLY.svg',
  'mark-white.svg': 'brand/ILACORE LOGO WHITE ONLY.svg',
};

mkdirSync('public/brand', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [out, src] of Object.entries(files)) {
  const svg = readFileSync(src, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '');
  await page.setContent(`<body style="margin:0">${svg}</body>`);
  const box = await page.evaluate(() => {
    const b = document.querySelector('svg').getBBox();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  const pad = 4;
  const viewBox = [box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2].map((n) => n.toFixed(2)).join(' ');
  writeFileSync(`public/brand/${out}`, svg.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`).trim() + '\n');
  console.log(out, viewBox, 'ratio', (box.w / box.h).toFixed(2));
}
await browser.close();
```

Run: `node scripts/crop-logos.mjs`. Expected: four lines with much smaller viewBoxes and their ratios. Open each output in the browser pane and check nothing is clipped. Write down the ratio of `logo-color.svg`; Task 3 needs it.

- [ ] **Step 10: Verify the build and commit**

Run: `npm run build`. Expected: success, with `.next/standalone/server.js` present.

```bash
git add -A
git commit -m "chore: scaffold Next.js site with brand tokens, fonts and test runners"
```

---

### Task 2: Content model

**Files:**
- Create: `content/products.ts`, `content/industries.ts`, `content/countries.ts`, `content/site.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces:
  - `type ProductSlug = 'fms' | 'telematics' | 'lpg'`; `type ProductStatus = 'live' | 'coming-soon'`
  - `type Screen = { src: string | null; alt: string; caption: string; width: number; height: number }`
  - `type Feature = { title: string; body: string; screen?: Screen }`; `type FeatureGroup = { job: string; features: Feature[] }`
  - `type Product = { slug; name; status; promise; summary; outcomes: [string, string, string]; problems: { title; body }[]; featureGroups: FeatureGroup[]; comingSoon: Feature[]; hardware: { body; offline }; screens: Screen[]; industries: IndustrySlug[]; seoDescription: string }`
  - `products`, `liveProducts()`, `comingSoonProducts()`, `getProduct(slug: string): Product | undefined`
  - `type IndustrySlug = 'fuel-stations' | 'fleet-depots' | 'oil-marketing' | 'transport'`; `industries: { slug; name; problem; answer; products: ProductSlug[] }[]`
  - `countries: readonly string[]` (ends with `'Other'`)
  - `site = { name, legalEntity, email, phone, whatsapp, regions, url }`; `whatsappLink(message?: string): string`; `telLink(): string`; `navItems(): { href; label }[]`

- [ ] **Step 1: Write the failing integrity tests**

`tests/unit/content.test.ts`:

```ts
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
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npm test`. Expected: FAIL, cannot resolve `@/content/products`.

- [ ] **Step 3: Write `content/industries.ts`**

```ts
import type { ProductSlug } from './products';

export type IndustrySlug = 'fuel-stations' | 'fleet-depots' | 'oil-marketing' | 'transport';

export type Industry = { slug: IndustrySlug; name: string; problem: string; answer: string; products: ProductSlug[] };

export const industries: Industry[] = [
  {
    slug: 'fuel-stations',
    name: 'Fuel stations',
    problem: 'Dip readings, pump totals and delivery notes rarely agree, and nobody can say where the difference went.',
    answer: 'ILACORE FMS reads every tank and pump continuously and reconciles them against each delivery.',
    products: ['fms'],
  },
  {
    slug: 'fleet-depots',
    name: 'Fleet depots and private tanks',
    problem: 'Fuel leaves the depot tank, but it is hard to match each litre to a vehicle and a trip.',
    answer: 'FMS tracks the tank and every draw from it. Telematics shows where each vehicle went with that fuel.',
    products: ['fms', 'telematics'],
  },
  {
    slug: 'oil-marketing',
    name: 'Oil marketing companies',
    problem: 'Head office sees station stock days late, after losses have already happened.',
    answer: 'The FMS network view puts every station, tank and gateway on one screen as readings arrive.',
    products: ['fms'],
  },
  {
    slug: 'transport',
    name: 'Transport and logistics',
    problem: 'Managers find out about fatigue, near misses and route changes only after something goes wrong.',
    answer: 'ILACORE Telematics shows every vehicle live and raises AI dashcam alerts as they happen.',
    products: ['telematics'],
  },
];
```

- [ ] **Step 4: Write `content/products.ts`**

```ts
import type { IndustrySlug } from './industries';

export type ProductSlug = 'fms' | 'telematics' | 'lpg';
export type ProductStatus = 'live' | 'coming-soon';
export type Screen = { src: string | null; alt: string; caption: string; width: number; height: number };
export type Feature = { title: string; body: string; screen?: Screen };
export type FeatureGroup = { job: string; features: Feature[] };

export type Product = {
  slug: ProductSlug;
  name: string;
  status: ProductStatus;
  promise: string;
  summary: string;
  outcomes: [string, string, string];
  problems: { title: string; body: string }[];
  featureGroups: FeatureGroup[];
  comingSoon: Feature[];
  hardware: { body: string; offline: string };
  screens: Screen[];
  industries: IndustrySlug[];
  seoDescription: string;
};

// src: null renders a clearly marked placeholder until ILACORE supplies real screenshots (spec §10).
const placeholder = (caption: string, alt: string): Screen => ({ src: null, caption, alt, width: 1600, height: 1000 });

export const products: Product[] = [
  {
    slug: 'fms',
    name: 'ILACORE FMS',
    status: 'live',
    promise: "Know what's in every tank and where every litre went.",
    summary: 'A fuel management system for stations, depots and oil marketing companies. It reads tanks and pumps continuously and reconciles them against deliveries.',
    outcomes: [
      'Live level and ullage for every tank and grade',
      'Litres dispensed reconciled against deliveries',
      'An alert as soon as litres go missing',
    ],
    problems: [
      { title: 'Stock you can only guess', body: 'Manual dips happen once or twice a day, so a leak or a theft can run for hours before anyone sees it.' },
      { title: "Deliveries that don't add up", body: 'The delivery note says one figure, the tank shows another, and the difference is written off.' },
      { title: 'Head office sees it too late', body: 'Station reports arrive days later, after the loss has already happened.' },
    ],
    featureGroups: [
      {
        job: 'Know your stock',
        features: [
          { title: 'Tank monitoring', body: 'Live level and ullage for every tank, split by grade (PMS and AGO).', screen: placeholder('Tank levels by grade', 'FMS dashboard showing tank levels for PMS and AGO') },
          { title: 'Connectivity health', body: 'See which gateways and dispensers are online, and when each last reported.' },
        ],
      },
      {
        job: 'Account for every litre',
        features: [
          { title: 'Dispensers and sales', body: 'Litres dispensed per pump, reconciled against each delivery.', screen: placeholder('Pump totals and reconciliation', 'FMS reconciliation view comparing deliveries and pump sales') },
          { title: 'Loss detection', body: 'Delivered, sold and measured litres compared continuously, with an alert when they drift apart.' },
        ],
      },
      {
        job: 'Run a network',
        features: [
          { title: 'Network view', body: 'Every station on one screen, for oil marketing companies and multi-site owners.', screen: placeholder('Network view', 'FMS network view listing stations and their stock') },
        ],
      },
    ],
    comingSoon: [],
    hardware: {
      body: 'A gateway on site connects to your tank probes and dispensers. ILACORE installs and commissions it.',
      offline: 'When the connection drops, the gateway keeps recording and sends everything once it is back.',
    },
    screens: [placeholder('FMS overview', 'ILACORE FMS overview dashboard')],
    industries: ['fuel-stations', 'fleet-depots', 'oil-marketing'],
    seoDescription: 'ILACORE FMS monitors fuel tanks and pumps, reconciles deliveries against sales and alerts you when litres go missing.',
  },
  {
    slug: 'telematics',
    name: 'ILACORE Telematics',
    status: 'live',
    promise: 'See every vehicle, and every risk on the road, as it happens.',
    summary: 'Live vehicle tracking with AI dashcam alerts, for fleets that need to know where vehicles are and how they are driven.',
    outcomes: [
      'Every vehicle and its status on a live map',
      'AI dashcam alerts for fatigue, distraction and collisions',
      'Escalation rules that notify the right manager',
    ],
    problems: [
      { title: 'Risk you hear about afterwards', body: 'Fatigue and near misses are reported after the fact, if they are reported at all.' },
      { title: "Vehicles you can't see", body: 'Calling drivers to ask where they are wastes time and rarely gives a straight answer.' },
      { title: 'Alerts nobody owns', body: 'When every alert goes to everyone, nobody acts on any of them.' },
    ],
    featureGroups: [
      {
        job: 'See the fleet',
        features: [
          { title: 'Live map', body: 'Every vehicle, its position and its status, updated as it moves.', screen: placeholder('Live map', 'Telematics live map showing vehicles and their status') },
          { title: 'Installable app', body: 'Add the dashboard to a phone home screen and use it like an app.' },
        ],
      },
      {
        job: 'Catch risk early',
        features: [
          { title: 'AI dashcam alerts', body: 'Driver monitoring and collision warnings, detected on the camera itself.', screen: placeholder('Alerts feed', 'Telematics alerts feed with dashcam events') },
          { title: 'Escalation rules', body: 'For example: three fatigue alerts in 30 minutes notifies the fleet manager.' },
        ],
      },
      {
        job: 'Act and keep a record',
        features: [
          { title: 'Alerts feed', body: 'Acknowledge and resolve each alert, with a record of who did what and when.' },
          { title: 'Team access', body: 'Admin and operator roles, so each person sees and does only what they should.' },
        ],
      },
    ],
    comingSoon: [
      { title: 'Spoken in-cab driver companion', body: 'Spoken guidance for the driver, from the device in the cab.' },
      { title: 'Automatic crash SOS', body: 'An automatic alert to your team when the camera detects a crash.' },
    ],
    hardware: {
      body: 'An AI dashcam and tracker in each vehicle. ILACORE installs and configures them.',
      offline: 'Out of coverage, the device keeps recording and uploads when the signal returns.',
    },
    screens: [placeholder('Telematics overview', 'ILACORE Telematics live map and alerts')],
    industries: ['fleet-depots', 'transport'],
    seoDescription: 'ILACORE Telematics shows every vehicle on a live map and raises AI dashcam alerts for fatigue, distraction and collisions.',
  },
  {
    slug: 'lpg',
    name: 'ILACORE LPG',
    status: 'coming-soon',
    promise: 'Stock and distribution tracking for LPG.',
    summary: 'A solution for LPG distributors, in development. Register your interest to hear first.',
    outcomes: ['In development', 'In development', 'In development'],
    problems: [],
    featureGroups: [],
    comingSoon: [],
    hardware: { body: '', offline: '' },
    screens: [],
    industries: [],
    seoDescription: 'ILACORE LPG is in development. Register your interest.',
  },
];

export const liveProducts = () => products.filter((p) => p.status === 'live');
export const comingSoonProducts = () => products.filter((p) => p.status === 'coming-soon');
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
```

- [ ] **Step 5: Write `content/countries.ts`**

```ts
export const countries = [
  // Africa
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon',
  'Central African Republic', 'Chad', 'Comoros', "Côte d'Ivoire", 'Democratic Republic of the Congo',
  'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia',
  'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
  'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria',
  'Republic of the Congo', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone',
  'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia',
  'Zimbabwe',
  // Middle East
  'Bahrain', 'Iraq', 'Jordan', 'Kuwait', 'Lebanon', 'Oman', 'Qatar', 'Saudi Arabia', 'Syria', 'Türkiye',
  'United Arab Emirates', 'Yemen',
  'Other',
] as const;
```

- [ ] **Step 6: Write `content/site.ts`**

```ts
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
```

The unit test runs without the env var, so `digits` falls back to `0` and the regex still matches.

- [ ] **Step 7: Run the tests**

Run: `npm test`. Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add content tests/unit/content.test.ts
git commit -m "feat: add typed content model for products, industries, countries and site"
```

---

### Task 3: Site shell: logo, buttons, header, mobile menu, footer, skip link

**Files:**
- Create: `components/logo.tsx`, `components/button-link.tsx`, `components/site-header.tsx`, `components/mobile-menu.tsx`, `components/site-footer.tsx`, `components/ui/sheet.tsx` and `lib/utils.ts` (both generated)
- Modify: `app/layout.tsx`, `app/globals.css` (shadcn init)
- Test: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Consumes: `navItems()`, `site`, `whatsappLink()`, `telLink()`, `liveProducts()`.
- Produces: `<Logo variant?: 'color' | 'white' className? />`; `<ButtonLink href variant?: 'gold' | 'navy' | 'outline-light' | 'outline-dark' className?>`; `<SiteHeader />`; `<SiteFooter />`. Each page renders its own `<main id="main">`.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/shell.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('desktop header shows nav and Book a demo', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const header = page.getByRole('banner');
  for (const label of ['FMS', 'Telematics', 'Solutions', 'Industries', 'About']) {
    await expect(header.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await expect(header.getByRole('link', { name: 'Book a demo' })).toHaveAttribute('href', '/demo');
});

test('skip link is the first focusable element and targets main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('keeps Book a demo pinned and opens the menu by keyboard', async ({ page }) => {
    await page.goto('/');
    const header = page.getByRole('banner');
    await expect(header.getByRole('link', { name: 'Book a demo' })).toBeVisible();
    await header.getByRole('button', { name: 'Open menu' }).focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('link', { name: 'Telematics', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

test('footer has contact and legal links', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  await expect(footer.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  await expect(footer.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /wa\.me/);
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx playwright test tests/e2e/shell.spec.ts`. Expected: FAIL (no banner).

- [ ] **Step 3: Add shadcn and the Sheet component**

```bash
npx shadcn@latest init -d
npx shadcn@latest add sheet
```

`init` adds CSS variables and imports to `app/globals.css`. Keep them, but check that the Task 1 `@theme` block and the `html`/`body` base rules survived unchanged. Run `npm test` to confirm the token test still passes.

- [ ] **Step 4: Write `components/logo.tsx`**

Set `LOGO_RATIO` to the ratio printed for `logo-color.svg` in Task 1, Step 9.

```tsx
import Image from 'next/image';

const LOGO_RATIO = 3.2; // replace with the measured ratio from scripts/crop-logos.mjs
const HEIGHT = 32;

export function Logo({ variant = 'color', className }: { variant?: 'color' | 'white'; className?: string }) {
  return (
    <Image
      src={variant === 'white' ? '/brand/logo-white.svg' : '/brand/logo-color.svg'}
      alt="ILACORE"
      width={Math.round(HEIGHT * LOGO_RATIO)}
      height={HEIGHT}
      priority
      unoptimized
      className={className}
    />
  );
}
```

- [ ] **Step 5: Write `components/button-link.tsx`**

```tsx
import Link from 'next/link';

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
    </Link>
  );
}
```

- [ ] **Step 6: Write `components/mobile-menu.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-line text-navy lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper">
        <SheetTitle className="font-display text-20 text-navy">Menu</SheetTitle>
        <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-control px-3 py-3 font-display text-20 text-navy hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 7: Write `components/site-header.tsx`**

```tsx
import Link from 'next/link';
import { navItems } from '@/content/site';
import { ButtonLink } from './button-link';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';

export function SiteHeader() {
  const items = navItems();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="ILACORE home" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex gap-6">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-display text-16 font-semibold text-navy hover:text-ink">
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
```

- [ ] **Step 8: Write `components/site-footer.tsx`**

```tsx
import Link from 'next/link';
import { liveProducts } from '@/content/products';
import { site, telLink, whatsappLink } from '@/content/site';
import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-white/80">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="white" />
          <p className="mt-4 max-w-sm text-14">Fuel and fleet software for operators across {site.regions}.</p>
        </div>
        <nav aria-label="Products">
          <h2 className="font-display text-16 text-white">Products</h2>
          <ul className="mt-3 space-y-2 text-14">
            {liveProducts().map((p) => (
              <li key={p.slug}><Link href={`/${p.slug}`} className="hover:text-white">{p.name}</Link></li>
            ))}
            <li><Link href="/solutions" className="hover:text-white">All solutions</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-16 text-white">Contact</h2>
          <ul className="mt-3 space-y-2 text-14">
            <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            {site.phone && <li><a href={telLink()} className="hover:text-white">{site.phone}</a></li>}
            <li><a href={whatsappLink()} className="hover:text-white" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>
          </ul>
        </div>
        <nav aria-label="Legal">
          <h2 className="font-display text-16 text-white">Legal</h2>
          <ul className="mt-3 space-y-2 text-14">
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-[1280px] px-4 pb-8 text-14 text-white/70 sm:px-6">© {new Date().getFullYear()} {site.legalEntity}</p>
    </footer>
  );
}
```

- [ ] **Step 9: Wire the layout**

In `app/layout.tsx` import `SiteHeader` and `SiteFooter`, and change the body to:

```tsx
<body className="flex min-h-screen flex-col">
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-gold focus:px-4 focus:py-2 focus:text-navy-deep"
  >
    Skip to content
  </a>
  <SiteHeader />
  <div className="flex-1">{children}</div>
  <SiteFooter />
</body>
```

- [ ] **Step 10: Run the tests and look at it**

Run: `npx playwright test tests/e2e/shell.spec.ts`. Expected: 4 passed. Then run `npm run dev` and check the header at 375px and 1280px in the browser pane. The logo must not be clipped, and the gold button must read clearly.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add site header, mobile menu, footer and skip link"
```

---

### Task 4: Hero instrument

**Files:**
- Create: `components/hero-instrument/model.ts`, `components/hero-instrument/hero-instrument.tsx`
- Test: `tests/unit/hero-model.test.ts`, `tests/e2e/hero.spec.ts`

**Interfaces:**
- Produces:
  - `CYCLE_MS = 12000`, `TANK_CAPACITY_L = 33000`, `STATIC_PHASE = 0.62`
  - `instrumentState(phase: number): { tankLitres: number; tankFraction: number; truckProgress: number; delivered: number; sold: number; unaccounted: number }`. `phase` wraps into [0, 1).
  - `<HeroInstrument />`, a client component rendering `<figure data-testid="hero-instrument" data-static="true|false">` with a `data-testid="tank-litres"` reading.

The loop runs 12 s. The station's AGO tank drains as the pumps sell, while the delivery truck drives from the Mombasa depot to Kampala station 04. At the end the truck delivers and the tank refills, so the loop closes. The readout shows delivered, sold and unaccounted litres. Unaccounted stays small but above zero, because that is what the product catches.

- [ ] **Step 1: Write the failing model test**

`tests/unit/hero-model.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { STATIC_PHASE, TANK_CAPACITY_L, instrumentState } from '@/components/hero-instrument/model';

describe('instrumentState', () => {
  it('starts with the tank at 24,418 L and the truck at the depot', () => {
    const s = instrumentState(0);
    expect(s.tankLitres).toBe(24418);
    expect(s.truckProgress).toBe(0);
  });

  it('drains the tank while the truck travels', () => {
    expect(instrumentState(0.5).tankLitres).toBeLessThan(instrumentState(0.1).tankLitres);
    expect(instrumentState(0.5).truckProgress).toBeGreaterThan(instrumentState(0.1).truckProgress);
  });

  it('keeps every reading in range and reconciled for the whole loop', () => {
    for (let i = 0; i < 100; i++) {
      const s = instrumentState(i / 100);
      expect(s.tankLitres).toBeGreaterThanOrEqual(0);
      expect(s.tankLitres).toBeLessThanOrEqual(TANK_CAPACITY_L);
      expect(s.tankFraction).toBeCloseTo(s.tankLitres / TANK_CAPACITY_L, 5);
      expect(s.truckProgress).toBeGreaterThanOrEqual(0);
      expect(s.truckProgress).toBeLessThanOrEqual(1);
      expect(s.unaccounted).toBe(s.delivered - s.sold - (s.tankLitres - 24418));
      expect(Number.isInteger(s.tankLitres)).toBe(true);
    }
  });

  it('ends the loop where it started so it repeats without a jump', () => {
    expect(Math.abs(instrumentState(0.9999).tankLitres - instrumentState(0).tankLitres)).toBeLessThan(50);
  });

  it('shows a non-zero unaccounted figure in the static frame', () => {
    expect(instrumentState(STATIC_PHASE).unaccounted).toBeGreaterThan(0);
  });

  it('wraps phases outside [0, 1)', () => {
    expect(instrumentState(1.25)).toEqual(instrumentState(0.25));
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test`. Expected: FAIL, cannot resolve the model.

- [ ] **Step 3: Write `components/hero-instrument/model.ts`**

```ts
export const CYCLE_MS = 12000;
export const TANK_CAPACITY_L = 33000;
export const STATIC_PHASE = 0.62;

const START_L = 24418;
const SOLD_PER_LOOP = 9000; // litres sold during the drive
const LOSS_PER_LOOP = 140; // litres that go missing during the drive
const DELIVERY_L = SOLD_PER_LOOP + LOSS_PER_LOOP; // what the truck brings, so the loop closes
const DRIVE_END = 0.85; // the truck arrives at 85% of the loop
const DELIVERY_END = 0.97; // the tank is refilled by 97%

const ease = (t: number) => t * t * (3 - 2 * t);

export function instrumentState(rawPhase: number) {
  const phase = ((rawPhase % 1) + 1) % 1;
  const drive = Math.min(phase / DRIVE_END, 1);
  const unload = phase <= DRIVE_END ? 0 : Math.min((phase - DRIVE_END) / (DELIVERY_END - DRIVE_END), 1);

  const sold = Math.round(SOLD_PER_LOOP * drive);
  const lost = Math.round(LOSS_PER_LOOP * drive);
  const delivered = Math.round(DELIVERY_L * ease(unload));
  const tankLitres = START_L - sold - lost + delivered;

  return {
    tankLitres,
    tankFraction: tankLitres / TANK_CAPACITY_L,
    truckProgress: ease(drive),
    delivered,
    sold,
    unaccounted: delivered - sold - (tankLitres - START_L),
  };
}
```

The arithmetic: `unaccounted = delivered − sold − (delivered − sold − lost) = lost`. It grows from 0 to 140 L over the drive and is about 102 L in the static frame. At the end of the loop the tank is back at `START_L`.

- [ ] **Step 4: Run the model tests**

Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Write the e2e test (it passes after Task 5)**

`tests/e2e/hero.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('animates for normal motion', async ({ page }) => {
  await page.goto('/');
  const fig = page.getByTestId('hero-instrument');
  await expect(fig).toHaveAttribute('data-static', 'false');
  const first = await fig.getByTestId('tank-litres').textContent();
  await page.waitForTimeout(1500);
  expect(await fig.getByTestId('tank-litres').textContent()).not.toBe(first);
});

test('is static with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const fig = page.getByTestId('hero-instrument');
  await expect(fig).toHaveAttribute('data-static', 'true');
  const first = await fig.getByTestId('tank-litres').textContent();
  await page.waitForTimeout(1500);
  expect(await fig.getByTestId('tank-litres').textContent()).toBe(first);
});

test('describes itself to screen readers', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-instrument').locator('figcaption')).toContainText('litres');
});
```

- [ ] **Step 6: Write `components/hero-instrument/hero-instrument.tsx`**

The route is an abstract corridor, not a map: a curved path between two labelled points. The tank is a vertical gauge, filled gold because AGO is fuel. Console styling (uppercase mono labels) is allowed here because this is the product UI.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { CYCLE_MS, STATIC_PHASE, TANK_CAPACITY_L, instrumentState } from './model';

const ROUTE = 'M 40 210 C 120 200, 140 120, 220 110 S 330 60, 400 40';
const fmt = (n: number) => n.toLocaleString('en-US');
const label = { fill: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)' };

export function HeroInstrument() {
  const [reduced, setReduced] = useState(true); // static on the server and on first paint
  const [phase, setPhase] = useState(STATIC_PHASE);
  const [truck, setTruck] = useState({ x: 40, y: 210 });
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) {
      setPhase(STATIC_PHASE);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setPhase(((now - start) % CYCLE_MS) / CYCLE_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const s = instrumentState(phase);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const p = path.getPointAtLength(path.getTotalLength() * s.truckProgress);
    setTruck({ x: p.x, y: p.y });
  }, [s.truckProgress]);

  const tankTop = 30 + 180 * (1 - s.tankFraction);

  return (
    <figure
      data-testid="hero-instrument"
      data-static={reduced ? 'true' : 'false'}
      className="min-w-0 rounded-panel border border-white/15 bg-navy-deep p-5 text-white"
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <svg viewBox="0 0 440 250" className="h-auto w-full" aria-hidden="true">
          <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="4 6" />
          <path ref={pathRef} d={ROUTE} fill="none" stroke="transparent" />
          <circle cx="40" cy="210" r="5" fill="#dca238" />
          <circle cx="400" cy="40" r="5" fill="#dca238" />
          <text x="52" y="236" {...label}>MOMBASA DEPOT</text>
          <text x="300" y="26" {...label}>KAMPALA STN 04</text>
          <circle cx={truck.x} cy={truck.y} r="12" fill="none" stroke="#1cd1a1" strokeOpacity="0.4" />
          <circle cx={truck.x} cy={truck.y} r="7" fill="#1cd1a1" />
        </svg>
        <svg viewBox="0 0 80 230" className="h-56 w-auto justify-self-start" aria-hidden="true">
          <rect x="10" y="30" width="60" height="180" rx="4" fill="none" stroke="rgba(255,255,255,0.4)" />
          <rect x="11" y={tankTop} width="58" height={210 - tankTop} rx="3" fill="#dca238" />
          <text x="10" y="20" {...label}>AGO T2</text>
        </svg>
      </div>
      <dl className="readout mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-14 sm:grid-cols-4">
        <div className="min-w-0"><dt className="text-white/70">TANK</dt><dd data-testid="tank-litres" className="text-20">{fmt(s.tankLitres)} L</dd></div>
        <div className="min-w-0"><dt className="text-white/70">DELIVERED</dt><dd className="text-20">{fmt(s.delivered)} L</dd></div>
        <div className="min-w-0"><dt className="text-white/70">SOLD</dt><dd className="text-20">{fmt(s.sold)} L</dd></div>
        <div className="min-w-0"><dt className="text-white/70">UNACCOUNTED</dt><dd className="text-20 text-gold">{fmt(s.unaccounted)} L</dd></div>
      </dl>
      <figcaption className="sr-only">
        Illustration: a diesel tank holding {fmt(s.tankLitres)} of {fmt(TANK_CAPACITY_L)} litres while a delivery truck drives
        from the depot to the station, with delivered, sold and unaccounted litres reconciled.
      </figcaption>
    </figure>
  );
}
```

Two notes:
- `reduced` starts as `true`, so the server HTML is the static frame. That avoids a hydration mismatch and means reduced-motion users never see motion at all.
- The caption is not a live region, so screen readers aren't flooded with updates while it animates.

- [ ] **Step 7: Commit**

```bash
git add components/hero-instrument tests/unit/hero-model.test.ts tests/e2e/hero.spec.ts
git commit -m "feat: add hero instrument with reconciliation model and reduced-motion fallback"
```

---

### Task 5: Home page and shared sections

**Files:**
- Create: `components/screenshot.tsx`, `components/product-row.tsx`, `components/demo-section.tsx`
- Modify: `app/page.tsx`
- Test: `tests/e2e/home.spec.ts` (and `tests/e2e/hero.spec.ts` from Task 4)

**Interfaces:**
- Consumes: `liveProducts()`, `comingSoonProducts()`, `Product`, `Screen`, `ProductSlug`, `whatsappLink()`, `ButtonLink`, `HeroInstrument`.
- Produces: `<Screenshot screen={Screen} priority? sizes? />`; `<ProductRow product={Product} mirrored? />`; `<DemoSection product?: ProductSlug heading?: string />`.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('home tells the story in order', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Account for every litre and every kilometre.');
  const h2s = await page.locator('main h2').allTextContents();
  const order = ['ILACORE FMS', 'ILACORE Telematics', 'Works offline', 'How it starts', 'Coming next', 'Book a demo'];
  const idx = order.map((t) => h2s.findIndex((h) => h.includes(t)));
  expect(idx.every((i) => i >= 0)).toBe(true);
  expect([...idx].sort((a, b) => a - b)).toEqual(idx);
});

test('hero actions go to the demo and WhatsApp', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  await expect(main.getByRole('link', { name: 'Book a demo' }).first()).toHaveAttribute('href', '/demo');
  await expect(main.getByRole('link', { name: 'Chat on WhatsApp' }).first()).toHaveAttribute('href', /wa\.me/);
});

test('coming next registers interest for LPG', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Register interest' })).toHaveAttribute('href', '/demo?product=lpg&intent=interest');
});

test('placeholder screenshots are clearly marked', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Screenshot placeholder').first()).toBeVisible();
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx playwright test tests/e2e/home.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Write `components/screenshot.tsx`**

```tsx
import Image from 'next/image';
import type { Screen } from '@/content/products';

export function Screenshot({ screen, priority = false, sizes = '(min-width: 1024px) 640px, 100vw' }: { screen: Screen; priority?: boolean; sizes?: string }) {
  if (!screen.src) {
    return (
      <div
        role="img"
        aria-label={`${screen.alt} (placeholder)`}
        className="flex aspect-[16/10] w-full min-w-0 flex-col justify-end rounded-panel border border-line bg-[linear-gradient(#0e1a2c,#050b14)] p-5"
      >
        <span className="text-14 text-white/80">Screenshot placeholder</span>
        <span className="font-display text-20 text-white">{screen.caption}</span>
      </div>
    );
  }
  return (
    <Image
      src={screen.src}
      alt={screen.alt}
      width={screen.width}
      height={screen.height}
      sizes={sizes}
      priority={priority}
      className="h-auto w-full rounded-panel border border-line"
    />
  );
}
```

The placeholder gradient is the dark console surface (`#0E1A2C` to `#050B14`) from the FMS design system. It reads as "a product screen goes here", not as decoration.

- [ ] **Step 4: Write `components/product-row.tsx`**

```tsx
import Link from 'next/link';
import type { Product } from '@/content/products';
import { Screenshot } from './screenshot';

export function ProductRow({ product, mirrored = false }: { product: Product; mirrored?: boolean }) {
  return (
    <section aria-labelledby={`row-${product.slug}`} className="border-t border-line py-16 sm:py-24">
      <div className={`mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 ${mirrored ? 'lg:grid-cols-[7fr_5fr]' : 'lg:grid-cols-[5fr_7fr]'}`}>
        <div className={`min-w-0 ${mirrored ? 'lg:order-2' : ''}`}>
          <h2 id={`row-${product.slug}`} className="text-31 sm:text-39">{product.name}</h2>
          <p className="reading mt-4 text-20 text-ink">{product.promise}</p>
          <ul className="mt-6 space-y-3">
            {product.outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-16 text-ink-muted">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                {o}
              </li>
            ))}
          </ul>
          <Link href={`/${product.slug}`} className="mt-8 inline-block font-display text-16 font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
            See {product.name}
          </Link>
        </div>
        <div className={`min-w-0 ${mirrored ? 'lg:order-1' : ''}`}>
          <Screenshot screen={product.screens[0]} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write `components/demo-section.tsx`**

```tsx
import type { ProductSlug } from '@/content/products';
import { whatsappLink } from '@/content/site';
import { ButtonLink } from './button-link';

export function DemoSection({ product, heading = 'Book a demo' }: { product?: ProductSlug; heading?: string }) {
  const href = product ? `/demo?product=${product}` : '/demo';
  return (
    <section aria-labelledby="demo-cta" className="bg-navy-deep py-16 text-white sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <h2 id="demo-cta" className="text-31 text-white sm:text-39">{heading}</h2>
        <p className="reading mt-4 text-20 text-white/85">
          We'll show you the system on your own tanks or vehicles and explain what installation involves. It takes about 30 minutes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={href}>Book a demo</ButtonLink>
          <ButtonLink href={whatsappLink('Hello ILACORE, I would like a demo.')} variant="outline-light">Chat on WhatsApp</ButtonLink>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write `app/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { ButtonLink } from '@/components/button-link';
import { DemoSection } from '@/components/demo-section';
import { HeroInstrument } from '@/components/hero-instrument/hero-instrument';
import { ProductRow } from '@/components/product-row';
import { comingSoonProducts, liveProducts } from '@/content/products';
import { whatsappLink } from '@/content/site';

export const metadata: Metadata = {
  title: { absolute: 'ILACORE: fuel management and fleet telematics' },
  description: 'ILACORE FMS and ILACORE Telematics help fuel and fleet operators across Africa and the Middle East account for every litre and every kilometre.',
  alternates: { canonical: '/' },
};

const steps = [
  { title: 'Install', body: 'Our team fits the gateway, probes, trackers or dashcams on site.' },
  { title: 'Connect', body: 'Devices connect over mobile data and start sending readings.' },
  { title: 'Dashboards', body: 'Your team signs in and sees live stock, vehicles and history.' },
  { title: 'Alerts', body: 'You choose who is told about what, and when.' },
];

export default function Home() {
  return (
    <main id="main">
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[6fr_5fr]">
          <div className="min-w-0">
            <h1 className="text-39 text-white sm:text-49 lg:text-61">Account for every litre and every kilometre.</h1>
            <p className="reading mt-6 text-20 text-white/85">
              Live tank, pump and vehicle data for fuel and fleet operators across Africa and the Middle East. See losses as they happen, not at month end.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/demo">Book a demo</ButtonLink>
              <ButtonLink href={whatsappLink('Hello ILACORE, I would like to know more.')} variant="outline-light">Chat on WhatsApp</ButtonLink>
            </div>
          </div>
          <HeroInstrument />
        </div>
      </section>

      {liveProducts().map((p, i) => <ProductRow key={p.slug} product={p} mirrored={i % 2 === 1} />)}

      <section aria-labelledby="offline" className="border-t border-line bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 id="offline" className="text-31 sm:text-39">Works offline</h2>
          <p className="reading mt-4 text-20 text-ink-muted">
            Coverage drops on highways and at remote depots. Gateways and in-vehicle devices keep recording while offline and send everything once the signal returns, so no reading is lost.
          </p>
        </div>
      </section>

      <section aria-labelledby="how" className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 id="how" className="text-31 sm:text-39">How it starts</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-l-2 border-navy pl-5">
                <span className="font-display text-25 font-bold text-navy">{i + 1}</span>
                <h3 className="mt-1 text-20">{s.title}</h3>
                <p className="mt-2 text-16 text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="next" className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 id="next" className="text-31 sm:text-39">Coming next</h2>
          {comingSoonProducts().map((p) => (
            <div key={p.slug} className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
              <div className="min-w-0">
                <h3 className="text-25">{p.name}</h3>
                <p className="reading mt-2 text-16 text-ink-muted">{p.summary}</p>
              </div>
              <ButtonLink href={`/demo?product=${p.slug}&intent=interest`} variant="outline-dark">Register interest</ButtonLink>
            </div>
          ))}
        </div>
      </section>

      <DemoSection />
    </main>
  );
}
```

- [ ] **Step 7: Run the tests and look at it**

Run: `npx playwright test tests/e2e/home.spec.ts tests/e2e/hero.spec.ts tests/e2e/shell.spec.ts`. Expected: all pass. Then check the page at 375px and 1280px in the browser pane: the headline wraps cleanly, the instrument fits, and there's no horizontal scroll.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: build home page with product rows, offline, steps and demo section"
```

---

### Task 6: Product page template

**Files:**
- Create: `app/[product]/page.tsx`, `app/not-found.tsx`
- Test: `tests/e2e/product.spec.ts`

**Interfaces:**
- Consumes: `liveProducts()`, `getProduct()`, `industries`, `Screenshot`, `ButtonLink`, `DemoSection`.
- Produces: static routes `/fms` and `/telematics`. Any other slug returns 404. Product JSON-LD on each product page. Links to `/industries#<slug>`.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/product.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('FMS page has its promise, sections and a pre-selected demo link', async ({ page }) => {
  await page.goto('/fms');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ILACORE FMS');
  await expect(page.getByText("Know what's in every tank and where every litre went.")).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: 'Book a demo' }).first()).toHaveAttribute('href', '/demo?product=fms');
  for (const h of ['What it stops', 'What it does', 'What we install', "Who it's for"]) {
    await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
  }
});

test('Telematics labels the driver companion and crash SOS as coming soon', async ({ page }) => {
  await page.goto('/telematics');
  const soon = page.getByRole('region', { name: 'Coming soon' });
  await expect(soon).toContainText('Spoken in-cab driver companion');
  await expect(soon).toContainText('Automatic crash SOS');
});

test('coming-soon and unknown products are 404', async ({ page }) => {
  for (const path of ['/lpg', '/nope']) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
  }
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx playwright test tests/e2e/product.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Write `app/[product]/page.tsx`**

In current Next.js, `params` is a Promise.

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/button-link';
import { DemoSection } from '@/components/demo-section';
import { Screenshot } from '@/components/screenshot';
import { industries } from '@/content/industries';
import { getProduct, liveProducts } from '@/content/products';

export const dynamicParams = false;

export function generateStaticParams() {
  return liveProducts().map((p) => ({ product: p.slug }));
}

type Props = { params: Promise<{ product: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).product);
  if (!p) return {};
  return { title: p.name, description: p.seoDescription, alternates: { canonical: `/${p.slug}` } };
}

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6';
const linkStyle = 'font-display text-20 font-bold text-navy underline decoration-gold decoration-2 underline-offset-4';

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).product);
  if (!product || product.status !== 'live') notFound();
  const forWho = industries.filter((i) => product.industries.includes(i.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription,
    brand: { '@type': 'Organization', name: 'ILACORE' },
    category: product.slug === 'fms' ? 'Fuel management system' : 'Fleet telematics',
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-navy text-white">
        <div className={`${container} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[5fr_7fr]`}>
          <div className="min-w-0">
            <h1 className="text-39 text-white sm:text-49">{product.name}</h1>
            <p className="reading mt-5 text-25 text-white/90">{product.promise}</p>
            <p className="reading mt-4 text-16 text-white/80">{product.summary}</p>
            <div className="mt-8"><ButtonLink href={`/demo?product=${product.slug}`}>Book a demo</ButtonLink></div>
          </div>
          <div className="min-w-0"><Screenshot screen={product.screens[0]} priority /></div>
        </div>
      </section>

      <section aria-labelledby="problems" className="py-16 sm:py-24">
        <div className={container}>
          <h2 id="problems" className="text-31 sm:text-39">What it stops</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {product.problems.map((pr) => (
              <div key={pr.title} className="border-t-2 border-gold pt-5">
                <h3 className="text-20">{pr.title}</h3>
                <p className="mt-2 text-16 text-ink-muted">{pr.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="features" className="border-t border-line bg-white py-16 sm:py-24">
        <div className={container}>
          <h2 id="features" className="text-31 sm:text-39">What it does</h2>
          {product.featureGroups.map((g) => {
            const shot = g.features.find((f) => f.screen)?.screen;
            return (
              <div key={g.job} className="mt-14 grid gap-10 lg:grid-cols-[5fr_7fr]">
                <div className="min-w-0">
                  <h3 className="text-25">{g.job}</h3>
                  <dl className="mt-5 space-y-5">
                    {g.features.map((f) => (
                      <div key={f.title}>
                        <dt className="font-display text-16 font-bold text-navy">{f.title}</dt>
                        <dd className="mt-1 text-16 text-ink-muted">{f.body}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {shot && <div className="min-w-0"><Screenshot screen={shot} /></div>}
              </div>
            );
          })}
          {product.comingSoon.length > 0 && (
            <section aria-labelledby="soon" className="mt-16 rounded-panel border border-line p-6">
              <h3 id="soon" className="text-20">Coming soon</h3>
              <ul className="mt-4 space-y-3">
                {product.comingSoon.map((f) => (
                  <li key={f.title}>
                    <span className="font-display font-bold text-navy">{f.title}.</span>{' '}
                    <span className="text-ink-muted">{f.body}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>

      <section aria-labelledby="hardware" className="border-t border-line py-16 sm:py-24">
        <div className={container}>
          <h2 id="hardware" className="text-31 sm:text-39">What we install</h2>
          <p className="reading mt-4 text-20 text-ink">{product.hardware.body}</p>
          <p className="reading mt-3 text-16 text-ink-muted">{product.hardware.offline}</p>
        </div>
      </section>

      <section aria-labelledby="who" className="border-t border-line py-16 sm:py-24">
        <div className={container}>
          <h2 id="who" className="text-31 sm:text-39">Who it's for</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {forWho.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries#${i.slug}`} className={linkStyle}>{i.name}</Link>
                <p className="mt-2 text-16 text-ink-muted">{i.problem}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DemoSection product={product.slug} />
    </main>
  );
}
```

The "Coming soon" block is a `<section>` named by its heading, which gives it the `region` role the test looks for.

- [ ] **Step 4: Write `app/not-found.tsx`**

```tsx
import { ButtonLink } from '@/components/button-link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-[1280px] px-4 py-24 sm:px-6">
      <h1 className="text-39">This page doesn't exist.</h1>
      <p className="reading mt-4 text-20 text-ink-muted">Check the address, or go to the home page to find FMS and Telematics.</p>
      <div className="mt-8"><ButtonLink href="/" variant="navy">Go to the home page</ButtonLink></div>
    </main>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npx playwright test tests/e2e/product.spec.ts`. Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add product page template for live products"
```

---

### Task 7: Solutions, Industries, About, Privacy and Terms

**Files:**
- Create: `components/page-hero.tsx`, `app/solutions/page.tsx`, `app/industries/page.tsx`, `app/about/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `products`, `industries`, `getProduct()`, `site`, `whatsappLink()`, `telLink()`, `ButtonLink`, `DemoSection`.
- Produces: `<PageHero title lead? />`. Industry sections carry `id={industry.slug}`, so product pages can link to `/industries#<slug>`.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/pages.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('solutions lists live and coming-soon products', async ({ page }) => {
  await page.goto('/solutions');
  await expect(page.getByRole('link', { name: 'See ILACORE FMS' })).toHaveAttribute('href', '/fms');
  await expect(page.getByRole('link', { name: 'See ILACORE Telematics' })).toHaveAttribute('href', '/telematics');
  await expect(page.locator('main').getByRole('link', { name: 'Register interest' })).toHaveAttribute('href', '/demo?product=lpg&intent=interest');
});

test('industries has four anchored sections', async ({ page }) => {
  await page.goto('/industries');
  for (const id of ['fuel-stations', 'fleet-depots', 'oil-marketing', 'transport']) {
    await expect(page.locator(`section#${id} h2`)).toBeVisible();
  }
});

test('about, privacy and terms render', async ({ page }) => {
  for (const [path, h1] of [['/about', 'About ILACORE'], ['/privacy', 'Privacy policy'], ['/terms', 'Terms of use']]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
  }
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx playwright test tests/e2e/pages.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Write `components/page-hero.tsx`**

```tsx
export function PageHero({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="text-39 sm:text-49">{title}</h1>
        {lead && <p className="reading mt-4 text-20 text-ink-muted">{lead}</p>}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `app/solutions/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/button-link';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { products } from '@/content/products';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'ILACORE solutions for fuel and fleet operators: FMS and Telematics today, LPG next.',
  alternates: { canonical: '/solutions' },
};

export default function Solutions() {
  return (
    <main id="main">
      <PageHero title="Solutions" lead="Two products in use today, and more in development. ILACORE installs and supports each one." />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {products.map((p) => (
          <section key={p.slug} aria-labelledby={`sol-${p.slug}`} className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line py-12">
            <div className="reading min-w-0">
              <h2 id={`sol-${p.slug}`} className="text-31">
                {p.name}
                {p.status === 'coming-soon' && <span className="ml-3 align-middle font-body text-14 font-normal text-ink-muted">Coming soon</span>}
              </h2>
              <p className="mt-3 text-20 text-ink">{p.promise}</p>
              <p className="mt-2 text-16 text-ink-muted">{p.summary}</p>
            </div>
            {p.status === 'live' ? (
              <Link href={`/${p.slug}`} className="font-display text-16 font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">See {p.name}</Link>
            ) : (
              <ButtonLink href={`/demo?product=${p.slug}&intent=interest`} variant="outline-dark">Register interest</ButtonLink>
            )}
          </section>
        ))}
      </div>
      <DemoSection />
    </main>
  );
}
```

- [ ] **Step 5: Write `app/industries/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { industries } from '@/content/industries';
import { getProduct } from '@/content/products';

export const metadata: Metadata = {
  title: 'Industries',
  description: 'How fuel stations, fleet depots, oil marketing companies and transport operators use ILACORE.',
  alternates: { canonical: '/industries' },
};

export default function Industries() {
  return (
    <main id="main">
      <PageHero title="Industries" lead="Who uses ILACORE, and the problem each of them brings to us." />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {industries.map((i) => (
          <section key={i.slug} id={i.slug} aria-labelledby={`ind-${i.slug}`} className="scroll-mt-24 border-b border-line py-14 lg:grid lg:grid-cols-[4fr_8fr] lg:gap-12">
            <h2 id={`ind-${i.slug}`} className="text-31">{i.name}</h2>
            <div className="reading mt-4 min-w-0 lg:mt-0">
              <p className="text-20 text-ink">{i.problem}</p>
              <p className="mt-3 text-16 text-ink-muted">{i.answer}</p>
              <ul className="mt-5 flex flex-wrap gap-4">
                {i.products.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${slug}`} className="font-display font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">{getProduct(slug)!.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
      <DemoSection />
    </main>
  );
}
```

- [ ] **Step 6: Write `app/about/page.tsx`**

ILACORE still has to supply the about-page facts (spec §10). Keep the copy short and factual, and don't invent a founding year or HQ.

```tsx
import type { Metadata } from 'next';
import { DemoSection } from '@/components/demo-section';
import { PageHero } from '@/components/page-hero';
import { site, telLink, whatsappLink } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'ILACORE builds fuel management and fleet telematics systems for operators across Africa and the Middle East.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <main id="main">
      <PageHero title="About ILACORE" lead={`ILACORE builds software and hardware for fuel and fleet operators across ${site.regions}.`} />
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
        <div className="reading space-y-4 text-16 text-ink">
          {/* CONFIRM: add founding, HQ and countries served once ILACORE supplies them (spec §10). */}
          <p>We install, connect and support every system ourselves, so one team answers for the device in your tank or cab and the dashboard on your screen.</p>
          <p>Our products are built for patchy coverage, long distances and mixed fleets, because that is where our customers work.</p>
        </div>
        <section aria-labelledby="contact" className="mt-12">
          <h2 id="contact" className="text-25">Contact</h2>
          <ul className="mt-4 space-y-2 text-16">
            <li><a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a></li>
            {site.phone && <li><a className="text-navy underline" href={telLink()}>{site.phone}</a></li>}
            <li><a className="text-navy underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>
          </ul>
        </section>
      </div>
      <DemoSection />
    </main>
  );
}
```

- [ ] **Step 7: Write `app/privacy/page.tsx` and `app/terms/page.tsx`**

These describe what the site actually does: one form, emailed to sales, no analytics, no tracking cookies. Before launch they need ILACORE's legal entity name and a legal review (Task 14).

`app/privacy/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What ILACORE collects through this website and why.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <main id="main">
      <PageHero title="Privacy policy" />
      <div className="reading mx-auto max-w-[1280px] space-y-4 px-4 py-14 text-16 sm:px-6 [&_h2]:mt-8 [&_h2]:text-25">
        <p>This policy explains what {site.legalEntity} collects through this website and why.</p>
        <h2>What we collect</h2>
        <p>Only what you type into the demo form: your name, company, country, phone or WhatsApp number, the products you are interested in and, if you choose, your fleet or station size.</p>
        <h2>How we use it</h2>
        <p>We email it to our sales team so we can contact you about a demo. We don't sell it, and we don't share it with anyone else for marketing.</p>
        <h2>Cookies and analytics</h2>
        <p>This website sets no tracking cookies and runs no analytics.</p>
        <h2>How long we keep it</h2>
        <p>We keep your request while we are discussing a demo or a contract with you, and delete it when you ask.</p>
        <h2>Your rights</h2>
        <p>To see, correct or delete what we hold about you, email <a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
    </main>
  );
}
```

`app/terms/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms that cover your use of the ILACORE website.',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <main id="main">
      <PageHero title="Terms of use" />
      <div className="reading mx-auto max-w-[1280px] space-y-4 px-4 py-14 text-16 sm:px-6 [&_h2]:mt-8 [&_h2]:text-25">
        <p>These terms cover your use of this website, which {site.legalEntity} runs.</p>
        <h2>Information on this site</h2>
        <p>We describe our products as accurately as we can. Features marked "coming soon" are in development and not yet available. Contracts for our products are agreed separately.</p>
        <h2>Screenshots and trademarks</h2>
        <p>The ILACORE name, logo and product screenshots belong to {site.legalEntity}. Don't reuse them without permission.</p>
        <h2>Contact</h2>
        <p>For questions about these terms, email <a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Run the tests**

Run: `npx playwright test tests/e2e/pages.spec.ts`. Expected: 3 passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add solutions, industries, about, privacy and terms pages"
```

---

### Task 8: Lead handling library

**Files:**
- Create: `lib/lead.ts`
- Test: `tests/unit/lead.test.ts`

**Interfaces:**
- Consumes: `countries`, `products`, `ProductSlug`.
- Produces:
  - `type LeadInput = { name: string; company: string; country: string; phone: string; products: ProductSlug[]; size?: string }`
  - `type FormValues = Record<string, string | string[]>`; `type FieldErrors = Partial<Record<keyof LeadInput, string>>`
  - `type LeadResult = { status: 'idle' } | { status: 'invalid'; fieldErrors: FieldErrors; values: FormValues } | { status: 'rate-limited'; values: FormValues } | { status: 'failed'; values: FormValues } | { status: 'sent' }`
  - `type Transport = (msg: { subject: string; text: string }) => Promise<void>`; `type RateLimiter = { hit(key: string): boolean }` (`true` = allowed)
  - `parseLead(fd: FormData)`, `createRateLimiter({ limit, windowMs, now? })`, `formatLeadEmail(lead)`, `resendTransport({ apiKey, from, to, fetchImpl? })`, `mockTransport`, `getTransport()`, `submitLead(fd, { ip, transport, limiter }): Promise<LeadResult>`
  - Form field names: `name`, `company`, `country`, `phone`, `products` (repeated), `size`, honeypot `website`.
  - Error messages (used verbatim by Task 9's tests): `Enter your name.`, `Enter your company name.`, `Choose your country.`, `Enter a phone or WhatsApp number, including the country code.`, `Choose at least one product.`

- [ ] **Step 1: Write the failing tests**

`tests/unit/lead.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter, formatLeadEmail, mockTransport, parseLead, resendTransport, submitLead } from '@/lib/lead';

function form(fields: Record<string, string | string[]>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) for (const item of [v].flat()) fd.append(k, item);
  return fd;
}

const valid = { name: 'Amina Yusuf', company: 'Coast Fuels', country: 'Kenya', phone: '+254 712 345 678', products: ['fms'] };
const allow = { hit: () => true };

describe('parseLead', () => {
  it('accepts a valid lead and trims fields', () => {
    const r = parseLead(form({ ...valid, name: '  Amina Yusuf ' }));
    expect(r.ok && r.data.name).toBe('Amina Yusuf');
  });

  it('reports every missing required field', () => {
    const r = parseLead(form({}));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.fieldErrors).sort()).toEqual(['company', 'country', 'name', 'phone', 'products']);
  });

  it('rejects an unknown country, a bad phone and an unknown product', () => {
    const r = parseLead(form({ ...valid, country: 'Atlantis', phone: 'call me', products: ['rockets'] }));
    if (r.ok) throw new Error('expected invalid');
    expect(r.fieldErrors.country).toBe('Choose your country.');
    expect(r.fieldErrors.phone).toBeDefined();
    expect(r.fieldErrors.products).toBeDefined();
  });

  it('accepts several products and an optional size', () => {
    const r = parseLead(form({ ...valid, products: ['fms', 'telematics'], size: '40 trucks' }));
    expect(r.ok && r.data.products).toEqual(['fms', 'telematics']);
    expect(r.ok && r.data.size).toBe('40 trucks');
  });
});

describe('submitLead', () => {
  it('pretends success and sends nothing when the honeypot is filled', async () => {
    const transport = vi.fn();
    const r = await submitLead(form({ ...valid, website: 'http://spam' }), { ip: '1', transport, limiter: allow });
    expect(r.status).toBe('sent');
    expect(transport).not.toHaveBeenCalled();
  });

  it('returns field errors and the submitted values when invalid', async () => {
    const r = await submitLead(form({ name: 'A' }), { ip: '1', transport: vi.fn(), limiter: allow });
    expect(r.status).toBe('invalid');
    if (r.status === 'invalid') expect(r.values.name).toBe('A');
  });

  it('does not count invalid submissions against the rate limit', async () => {
    const limiter = { hit: vi.fn(() => true) };
    await submitLead(form({}), { ip: '1', transport: vi.fn(), limiter });
    expect(limiter.hit).not.toHaveBeenCalled();
  });

  it('stops when the rate limit is hit, keeping the values', async () => {
    const r = await submitLead(form(valid), { ip: '1', transport: vi.fn(), limiter: { hit: () => false } });
    expect(r).toMatchObject({ status: 'rate-limited', values: { company: 'Coast Fuels' } });
  });

  it('sends the lead email', async () => {
    const transport = vi.fn().mockResolvedValue(undefined);
    const r = await submitLead(form(valid), { ip: '1', transport, limiter: allow });
    expect(r.status).toBe('sent');
    expect(transport.mock.calls[0][0].subject).toBe('Demo request: Coast Fuels (Kenya)');
  });

  it('reports failure and keeps the values when the send fails', async () => {
    const transport = vi.fn().mockRejectedValue(new Error('down'));
    const r = await submitLead(form(valid), { ip: '1', transport, limiter: allow });
    expect(r).toMatchObject({ status: 'failed', values: { name: 'Amina Yusuf', products: ['fms'] } });
  });
});

describe('createRateLimiter', () => {
  it('allows `limit` hits per key per window', () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect([rl.hit('a'), rl.hit('a'), rl.hit('a'), rl.hit('b')]).toEqual([true, true, false, true]);
    t = 1001;
    expect(rl.hit('a')).toBe(true);
  });
});

describe('formatLeadEmail', () => {
  it('lists every field and marks a missing size', () => {
    const { text } = formatLeadEmail({ name: 'Amina Yusuf', company: 'Coast Fuels', country: 'Kenya', phone: '+254', products: ['fms', 'telematics'] });
    expect(text).toContain('Products: ILACORE FMS, ILACORE Telematics');
    expect(text).toContain('Size: not given');
  });
});

describe('transports', () => {
  it('resendTransport posts to the Resend API and throws on a non-2xx', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('no', { status: 500 }));
    const t = resendTransport({ apiKey: 'k', from: 'site@x', to: 'sales@x', fetchImpl });
    await t({ subject: 's', text: 't' });
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.resend.com/emails');
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toMatchObject({ from: 'site@x', to: ['sales@x'], subject: 's', text: 't' });
    await expect(t({ subject: 's', text: 't' })).rejects.toThrow();
  });

  it('mockTransport fails only for the test company', async () => {
    await expect(mockTransport({ subject: 's', text: 'Company: Coast Fuels' })).resolves.toBeUndefined();
    await expect(mockTransport({ subject: 's', text: 'Company: Fail Test Ltd' })).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npm test`. Expected: FAIL, cannot resolve `@/lib/lead`.

- [ ] **Step 3: Write `lib/lead.ts`**

```ts
import { z } from 'zod';
import { countries } from '@/content/countries';
import { products, type ProductSlug } from '@/content/products';

const slugs = products.map((p) => p.slug) as [ProductSlug, ...ProductSlug[]];

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(100, 'Enter your name.'),
  company: z.string().trim().min(2, 'Enter your company name.').max(120, 'Enter your company name.'),
  country: z.enum(countries, { message: 'Choose your country.' }),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a phone or WhatsApp number, including the country code.'),
  products: z.array(z.enum(slugs, { message: 'Choose at least one product.' })).min(1, 'Choose at least one product.'),
  size: z.string().trim().max(60).optional(),
});

export type LeadInput = z.infer<typeof schema>;
export type FormValues = Record<string, string | string[]>;
export type FieldErrors = Partial<Record<keyof LeadInput, string>>;
export type LeadResult =
  | { status: 'idle' }
  | { status: 'invalid'; fieldErrors: FieldErrors; values: FormValues }
  | { status: 'rate-limited'; values: FormValues }
  | { status: 'failed'; values: FormValues }
  | { status: 'sent' };
export type Transport = (msg: { subject: string; text: string }) => Promise<void>;
export type RateLimiter = { hit(key: string): boolean };

function valuesOf(fd: FormData): FormValues {
  const str = (k: string) => String(fd.get(k) ?? '');
  return {
    name: str('name'),
    company: str('company'),
    country: str('country'),
    phone: str('phone'),
    size: str('size'),
    products: fd.getAll('products').map(String),
  };
}

export function parseLead(fd: FormData):
  | { ok: true; data: LeadInput }
  | { ok: false; fieldErrors: FieldErrors; values: FormValues } {
  const values = valuesOf(fd);
  const size = String(values.size).trim();
  const result = schema.safeParse({ ...values, size: size === '' ? undefined : size });
  if (result.success) return { ok: true, data: result.data };
  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof LeadInput;
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, fieldErrors, values };
}

export function createRateLimiter({ limit, windowMs, now = Date.now }: { limit: number; windowMs: number; now?: () => number }): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
      const allowed = recent.length < limit;
      if (allowed) recent.push(t);
      if (hits.size > 10_000) hits.clear(); // keep memory bounded on a long-running server
      hits.set(key, recent);
      return allowed;
    },
  };
}

export function formatLeadEmail(lead: LeadInput) {
  const names = lead.products.map((s) => products.find((p) => p.slug === s)?.name ?? s).join(', ');
  return {
    subject: `Demo request: ${lead.company} (${lead.country})`,
    text: [
      `Name: ${lead.name}`,
      `Company: ${lead.company}`,
      `Country: ${lead.country}`,
      `Phone/WhatsApp: ${lead.phone}`,
      `Products: ${names}`,
      `Size: ${lead.size ?? 'not given'}`,
    ].join('\n'),
  };
}

export function resendTransport({ apiKey, from, to, fetchImpl = fetch }: { apiKey: string; from: string; to: string; fetchImpl?: typeof fetch }): Transport {
  return async ({ subject, text }) => {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  };
}

export const mockTransport: Transport = async ({ text }) => {
  if (text.includes('Company: Fail Test Ltd')) throw new Error('mock send failure');
};

export function getTransport(): Transport {
  if (process.env.LEAD_TRANSPORT === 'mock') return mockTransport;
  const { RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_FROM_EMAIL || !LEAD_TO_EMAIL) {
    return async () => {
      throw new Error('Lead email is not configured');
    };
  }
  return resendTransport({ apiKey: RESEND_API_KEY, from: LEAD_FROM_EMAIL, to: LEAD_TO_EMAIL });
}

export async function submitLead(fd: FormData, deps: { ip: string; transport: Transport; limiter: RateLimiter }): Promise<LeadResult> {
  if (String(fd.get('website') ?? '').trim() !== '') return { status: 'sent' };
  const parsed = parseLead(fd);
  if (!parsed.ok) return { status: 'invalid', fieldErrors: parsed.fieldErrors, values: parsed.values };
  const values = valuesOf(fd);
  if (!deps.limiter.hit(deps.ip)) return { status: 'rate-limited', values };
  try {
    await deps.transport(formatLeadEmail(parsed.data));
    return { status: 'sent' };
  } catch (err) {
    console.error('lead send failed:', err instanceof Error ? err.message : String(err));
    return { status: 'failed', values };
  }
}
```

The error log holds only the error message, never the lead's details.

`z.enum(countries)` works with zod v4, which accepts a readonly tuple. If `npm ls zod` shows v3, use `z.enum(countries as unknown as [string, ...string[]], { errorMap: () => ({ message: 'Choose your country.' }) })` and the same `errorMap` form for products.

- [ ] **Step 4: Run the tests**

Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add lib/lead.ts tests/unit/lead.test.ts
git commit -m "feat: add lead validation, honeypot, rate limit and Resend transport"
```

---

### Task 9: Demo page, form and server action

**Files:**
- Create: `app/demo/actions.ts`, `app/demo/demo-form.tsx`, `app/demo/demo-heading.tsx`, `app/demo/page.tsx`
- Test: `tests/e2e/demo.spec.ts`

**Interfaces:**
- Consumes: `submitLead`, `getTransport`, `createRateLimiter`, `LeadResult`, `FormValues` (Task 8); `countries`, `products`; `site`, `whatsappLink()`, `telLink()`.
- Produces: `requestDemo(prev: LeadResult, fd: FormData): Promise<LeadResult>`; `<DemoForm />`; `<DemoHeading />`.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/demo.spec.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';

async function fill(page: Page, company: string) {
  await page.getByLabel('Name', { exact: true }).fill('Amina Yusuf');
  await page.getByLabel('Company', { exact: true }).fill(company);
  await page.getByLabel('Country').selectOption('Kenya');
  await page.getByLabel('Phone or WhatsApp').fill('+254 712 345 678');
  await page.getByLabel('ILACORE FMS').check();
}

test('shows inline errors when submitted empty', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Request a demo' }).click();
  await expect(page.getByText('Enter your name.')).toBeVisible();
  await expect(page.getByText('Choose at least one product.')).toBeVisible();
  await expect(page.getByLabel('Name', { exact: true })).toHaveAttribute('aria-invalid', 'true');
});

test('confirms a sent request', async ({ page }) => {
  await page.goto('/demo');
  await fill(page, 'Coast Fuels');
  await page.getByRole('button', { name: 'Request a demo' }).click();
  await expect(page.getByRole('status')).toContainText("We'll contact you within one working day");
  await expect(page.getByRole('status').getByRole('link', { name: 'Chat on WhatsApp' })).toBeVisible();
});

test('offers WhatsApp and keeps the data when sending fails', async ({ page }) => {
  await page.goto('/demo');
  await fill(page, 'Fail Test Ltd');
  await page.getByRole('button', { name: 'Request a demo' }).click();
  await expect(page.getByRole('alert')).toContainText("Your request didn't send. Message us on WhatsApp or try again.");
  await expect(page.getByLabel('Company', { exact: true })).toHaveValue('Fail Test Ltd');
  await expect(page.getByLabel('ILACORE FMS')).toBeChecked();
});

test('pre-fills the product and interest intent from the URL', async ({ page }) => {
  await page.goto('/demo?product=lpg&intent=interest');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Register your interest');
  await expect(page.getByLabel('ILACORE LPG')).toBeChecked();
  await page.goto('/demo?product=telematics');
  await expect(page.getByLabel('ILACORE Telematics')).toBeChecked();
  await expect(page.getByLabel('ILACORE FMS')).not.toBeChecked();
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx playwright test tests/e2e/demo.spec.ts`. Expected: FAIL (404).

- [ ] **Step 3: Write `app/demo/actions.ts`**

```ts
'use server';

import { headers } from 'next/headers';
import { createRateLimiter, getTransport, submitLead, type LeadResult } from '@/lib/lead';

const limiter = createRateLimiter({ limit: Number(process.env.LEAD_RATE_LIMIT ?? 5), windowMs: 10 * 60 * 1000 });

export async function requestDemo(_prev: LeadResult, fd: FormData): Promise<LeadResult> {
  const h = await headers();
  // Caddy sets X-Forwarded-For; the left-most entry is the visitor.
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  return submitLead(fd, { ip, transport: getTransport(), limiter });
}
```

- [ ] **Step 4: Write `app/demo/demo-form.tsx`**

```tsx
'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { countries } from '@/content/countries';
import { products } from '@/content/products';
import { whatsappLink } from '@/content/site';
import type { FormValues, LeadResult } from '@/lib/lead';
import { requestDemo } from './actions';

const input = 'mt-1 block w-full min-h-11 rounded-control border border-line bg-white px-3 text-16 text-ink aria-[invalid=true]:border-[#b42318]';
const label = 'font-display text-16 font-bold text-navy';
const err = 'mt-1 text-14 text-[#b42318]';

export function DemoForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<LeadResult, FormData>(requestDemo, { status: 'idle' });

  if (state.status === 'sent') {
    return (
      <div role="status" className="rounded-panel border border-line bg-white p-6">
        <h2 className="text-25">Thank you. Your request was sent.</h2>
        <p className="mt-2 text-16 text-ink-muted">We'll contact you within one working day.</p>
        <a
          href={whatsappLink('Hello ILACORE, I just requested a demo.')}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center rounded-control bg-gold px-5 font-display font-bold text-navy-deep"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  const values: FormValues = 'values' in state ? state.values : {};
  const errors = state.status === 'invalid' ? state.fieldErrors : {};
  const preselected = params.get('product');
  const checked = (slug: string) => (Array.isArray(values.products) ? values.products.includes(slug) : preselected === slug);
  const v = (k: string) => (typeof values[k] === 'string' ? (values[k] as string) : '');
  // Remount the form when the server returns values, so defaultValue and defaultChecked apply.
  const formKey = JSON.stringify(values);

  return (
    <form key={formKey} action={action} noValidate className="min-w-0 space-y-6">
      {state.status === 'failed' && (
        <p role="alert" className="rounded-panel border border-[#b42318] bg-white p-4 text-16 text-ink">
          Your request didn't send. Message us on WhatsApp or try again.{' '}
          <a className="font-bold text-navy underline" href={whatsappLink('Hello ILACORE, I would like a demo.')} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </p>
      )}
      {state.status === 'rate-limited' && (
        <p role="alert" className="rounded-panel border border-gold bg-white p-4 text-16 text-ink">
          Too many attempts. Try again in a few minutes, or message us on WhatsApp.{' '}
          <a className="font-bold text-navy underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </p>
      )}

      {([
        ['name', 'Name', 'name'],
        ['company', 'Company', 'organization'],
      ] as const).map(([field, text, auto]) => (
        <div key={field}>
          <label htmlFor={field} className={label}>{text}</label>
          <input
            id={field}
            name={field}
            autoComplete={auto}
            required
            defaultValue={v(field)}
            aria-invalid={!!errors[field]}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
            className={input}
          />
          {errors[field] && <p id={`${field}-error`} className={err}>{errors[field]}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="country" className={label}>Country</label>
        <select
          id="country"
          name="country"
          required
          defaultValue={v('country')}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'country-error' : undefined}
          className={input}
        >
          <option value="">Choose a country</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.country && <p id="country-error" className={err}>{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={label}>Phone or WhatsApp</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="+254 712 345 678"
          defaultValue={v('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={input}
        />
        {errors.phone && <p id="phone-error" className={err}>{errors.phone}</p>}
      </div>

      <fieldset aria-describedby={errors.products ? 'products-error' : undefined}>
        <legend className={label}>Products</legend>
        <div className="mt-2 space-y-2">
          {products.map((p) => (
            <label key={p.slug} className="flex min-h-11 items-center gap-3 text-16">
              <input type="checkbox" name="products" value={p.slug} defaultChecked={checked(p.slug)} className="h-5 w-5 accent-navy" />
              {p.name}
              {p.status === 'coming-soon' && <span className="text-14 text-ink-muted">(coming soon)</span>}
            </label>
          ))}
        </div>
        {errors.products && <p id="products-error" className={err}>{errors.products}</p>}
      </fieldset>

      <div>
        <label htmlFor="size" className={label}>
          Fleet or station size <span className="font-body font-normal text-ink-muted">(optional)</span>
        </label>
        <input id="size" name="size" placeholder="For example: 12 stations, or 40 trucks" defaultValue={v('size')} className={input} />
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center rounded-control bg-gold px-6 font-display text-16 font-bold text-navy-deep disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Request a demo'}
      </button>
    </form>
  );
}
```

The error red `#b42318` has about 6.5:1 contrast on white, which passes AA.

- [ ] **Step 5: Write `app/demo/demo-heading.tsx`**

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export function DemoHeading() {
  const interest = useSearchParams().get('intent') === 'interest';
  return <h1 className="text-39 sm:text-49">{interest ? 'Register your interest' : 'Book a demo'}</h1>;
}
```

- [ ] **Step 6: Write `app/demo/page.tsx`**

The heading and form read query params on the client inside Suspense boundaries, so the page stays static.

```tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { site, telLink, whatsappLink } from '@/content/site';
import { DemoForm } from './demo-form';
import { DemoHeading } from './demo-heading';

export const metadata: Metadata = {
  title: 'Book a demo',
  description: 'Book a demo of ILACORE FMS or ILACORE Telematics. We reply within one working day.',
  alternates: { canonical: '/demo' },
};

export default function DemoPage() {
  return (
    <main id="main" className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
      <Suspense fallback={<h1 className="text-39 sm:text-49">Book a demo</h1>}>
        <DemoHeading />
      </Suspense>
      <p className="reading mt-4 text-20 text-ink-muted">Tell us a little about your operation. We'll reply within one working day to arrange a time.</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_4fr]">
        <Suspense fallback={null}>
          <DemoForm />
        </Suspense>
        <aside aria-labelledby="direct" className="lg:border-l lg:border-line lg:pl-10">
          <h2 id="direct" className="text-25">Prefer to talk now?</h2>
          <ul className="mt-4 space-y-3 text-16">
            <li><a className="font-bold text-navy underline" href={whatsappLink('Hello ILACORE, I would like a demo.')} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>
            {site.phone && <li><a className="text-navy underline" href={telLink()}>{site.phone}</a></li>}
            <li><a className="text-navy underline" href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Run the tests**

Run: `npx playwright test tests/e2e/demo.spec.ts`. Expected: 4 passed. Then run the whole suite: `npm test && npm run test:e2e`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add demo form with server action, inline errors and WhatsApp fallback"
```

---

### Task 10: SEO: metadata, sitemap, robots, Open Graph, Organization JSON-LD

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `liveProducts()`, `site`.
- Produces: `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, and an `Organization` JSON-LD script on every page.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/seo.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

const routes = ['/', '/fms', '/telematics', '/solutions', '/industries', '/about', '/demo', '/privacy', '/terms'];

test('sitemap lists every route on the production URL', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const r of routes) expect(xml).toContain(`<loc>https://ilacore.com${r === '/' ? '' : r}</loc>`);
});

test('robots allows crawling and points at the sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toContain('Allow: /');
  expect(txt).toContain('Sitemap: https://ilacore.com/sitemap.xml');
});

test('every route has a unique title, one description and one canonical', async ({ page }) => {
  const titles = new Set<string>();
  for (const r of routes) {
    await page.goto(r);
    titles.add(await page.title());
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }
  expect(titles.size).toBe(routes.length);
});

test('home has Organization JSON-LD and product pages add Product JSON-LD', async ({ page }) => {
  await page.goto('/');
  const home = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(home.some((s) => JSON.parse(s)['@type'] === 'Organization')).toBe(true);
  await page.goto('/fms');
  const fms = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(fms.some((s) => JSON.parse(s)['@type'] === 'Product')).toBe(true);
});

test('Open Graph image renders', async ({ request }) => {
  const res = await request.get('/opengraph-image');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx playwright test tests/e2e/seo.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Write `app/sitemap.ts` and `app/robots.ts`**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { liveProducts } from '@/content/products';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...liveProducts().map((p) => `/${p.slug}`), '/solutions', '/industries', '/about', '/demo', '/privacy', '/terms'];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 }));
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${site.url}/sitemap.xml` };
}
```

- [ ] **Step 4: Write `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const alt = 'ILACORE: account for every litre and every kilometre';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#010875', color: 'white', padding: 72 }}>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>ILACORE</div>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 900 }}>Account for every litre and every kilometre.</div>
        <div style={{ fontSize: 28, color: '#dca238' }}>Fuel management and fleet telematics</div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 5: Add defaults and Organization JSON-LD to the layout**

In `app/layout.tsx`, import `site` from `@/content/site` and extend `metadata`:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'ILACORE', template: '%s | ILACORE' },
  description: 'Fuel management and fleet telematics for operators across Africa and the Middle East.',
  openGraph: { type: 'website', siteName: 'ILACORE', locale: 'en' },
  twitter: { card: 'summary_large_image' },
};
```

Inside `<body>`, before the skip link, add:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ILACORE',
      url: site.url,
      logo: `${site.url}/brand/logo-color.svg`,
      areaServed: ['Africa', 'Middle East'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: site.email },
    }),
  }}
/>
```

- [ ] **Step 6: Run the tests**

Run: `npx playwright test tests/e2e/seo.spec.ts`. Expected: 5 passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots, Open Graph image and structured data"
```

---

### Task 11: Route, responsive and accessibility checks

**Files:**
- Test: `tests/e2e/routes.spec.ts`, `tests/e2e/a11y.spec.ts`
- Modify: whichever component a failing check points at

**Interfaces:**
- Consumes: every route from Tasks 5–10.

- [ ] **Step 1: Write the route and responsive test**

`tests/e2e/routes.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

const routes = ['/', '/fms', '/telematics', '/solutions', '/industries', '/about', '/demo', '/privacy', '/terms'];

for (const r of routes) {
  test(`${r} returns 200 with exactly one h1`, async ({ page }) => {
    const res = await page.goto(r);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  for (const width of [360, 768, 1440]) {
    test(`${r} has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(r);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test('pages contain no banned words', async ({ page }) => {
  for (const r of routes) {
    await page.goto(r);
    expect(await page.locator('main').innerText()).not.toMatch(/seamless|unlock|empower/i);
  }
});
```

- [ ] **Step 2: Write the accessibility test**

`tests/e2e/a11y.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/fms', '/telematics', '/solutions', '/industries', '/about', '/demo', '/privacy', '/terms'];
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const r of routes) {
  test(`${r} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(r);
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('demo form showing errors has no violations', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Request a demo' }).click();
  await page.getByText('Enter your name.').waitFor();
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
```

- [ ] **Step 3: Run both and fix what they find**

Run: `npx playwright test tests/e2e/routes.spec.ts tests/e2e/a11y.spec.ts`.

They may fail at first. Likely causes and fixes:
- **Contrast:** translucent white text on navy-deep, or `ink-muted` on paper. Raise the opacity (for example `/70` to `/80`) or switch to `ink`. Stay within the token palette.
- **Overflow at 360px:** a long headline word or a grid child that refuses to shrink. Add `min-w-0` to that grid child or `break-words` to that heading.
- **Landmarks:** each `<nav>` needs a distinct `aria-label` (already the case). Keep exactly one `<main>` per page.

Fix each in the component it points at, then re-run until both pass.

- [ ] **Step 4: Run the full suite**

Run: `npm test && npm run test:e2e`. Expected: everything passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: check every route for status, h1, overflow and WCAG 2.2 AA"
```

---

### Task 12: Container image

**Files:**
- Create: `Dockerfile`, `.dockerignore`
- Test: `tests/unit/deploy-files.test.ts`

**Interfaces:**
- Produces: an image that listens on port 3000 as uid 1001, with `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_SITE_URL` as build args, a healthcheck on `GET /`, and `/app/.next/cache` expected to be a writable tmpfs.

Docker isn't available locally. This task writes the files and checks them statically, plus a standalone run without Docker. The first real image build happens on the VPS in Task 14.

- [ ] **Step 1: Write the failing static test**

`tests/unit/deploy-files.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');

describe('Dockerfile', () => {
  it('builds on node:24-alpine and runs as a non-root user', () => {
    const d = read('Dockerfile');
    expect(d).toMatch(/^FROM node:24-alpine AS deps/m);
    expect(d).toMatch(/^USER app$/m);
    expect(d).toContain('ARG NEXT_PUBLIC_WHATSAPP_NUMBER');
    expect(d).toContain('ARG NEXT_PUBLIC_SITE_URL');
    expect(d).toMatch(/127\.0\.0\.1:3000\//);
  });

  it('keeps secrets and local clutter out of the build context', () => {
    const ignore = read('.dockerignore').split('\n').map((l) => l.trim());
    for (const entry of ['.env', 'node_modules', '.next', '.git', 'tests', 'brand']) expect(ignore).toContain(entry);
  });
});

describe('next config', () => {
  it('uses standalone output', () => {
    expect(read('next.config.ts')).toContain("output: 'standalone'");
  });
});

describe('env example', () => {
  it('lists names only', () => {
    expect(existsSync('.env.example')).toBe(true);
    for (const line of read('.env.example').split('\n').filter(Boolean)) {
      const [name, value] = line.split('=');
      expect(name).toMatch(/^[A-Z_]+$/);
      if (name !== 'NEXT_PUBLIC_SITE_URL') expect(value).toBe('');
    }
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test`. Expected: FAIL (no Dockerfile).

- [ ] **Step 3: Write `Dockerfile`**

```dockerfile
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 app && adduser -S -u 1001 -G app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "server.js"]
```

- [ ] **Step 4: Write `.dockerignore`**

```
.env
.env.*
!.env.example
node_modules
.next
.git
tests
test-results
playwright-report
brand
docs
deploy
scripts
```

- [ ] **Step 5: Run the tests and a standalone smoke run**

Run: `npm test`. Expected: all pass.

Then check the standalone server works the way the image runs it, without Docker:

```bash
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
(cd .next/standalone && PORT=3200 node server.js) &
sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3200/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3200/demo
kill %1
```

Expected: `200` twice.

- [ ] **Step 6: Commit**

```bash
git add Dockerfile .dockerignore tests/unit/deploy-files.test.ts
git commit -m "build: add multi-stage Dockerfile for the standalone server"
```

---

### Task 13: Compose file, Caddy snippets and deploy scripts

**Files:**
- Create: `deploy/compose.yml`, `deploy/caddy/ilacore-site.caddy`, `deploy/caddy/ilacore-site.preview.caddy`, `scripts/deploy.sh`, `scripts/remote-deploy.sh`, `scripts/rollback.sh`
- Modify: `tests/unit/deploy-files.test.ts`, `package.json` (add `"deploy": "bash scripts/deploy.sh"`)

**Interfaces:**
- Consumes: the image from Task 12.
- Produces:
  - `scripts/deploy.sh [--public-url URL]`, run locally. It refuses a dirty tree, runs unit and e2e tests, streams `git archive HEAD` to `fms-vps:/home/fms/ilacore-site/src`, copies `deploy/compose.yml`, then runs `remote-deploy.sh <sha> [public-url]` over ssh.
  - `scripts/remote-deploy.sh <sha> [public-url]`, run on the VPS. It builds `ilacore-site:<sha>`, brings it up and waits for healthy, then checks `/` and `/demo` from inside the container (and on the public URL if given). It rolls back on failure, records the tag in `tags.log`, and prunes to the last 3 images.
  - `scripts/rollback.sh`, run locally. It switches the VPS to the previous tag in `tags.log`.
  - Remote layout: `/home/fms/ilacore-site/{compose.yml, .env, src/, tags.log}`.

None of these scripts run in this task. Running them changes the VPS, which needs the user's go-ahead (Task 14).

- [ ] **Step 1: Extend the static test**

Append to `tests/unit/deploy-files.test.ts`:

```ts
describe('compose.yml', () => {
  const c = read('deploy/compose.yml');
  it('joins fms-prod_edge with the ilacore-site alias and publishes no ports', () => {
    expect(c).toContain('name: ilacore-site');
    expect(c).toContain('name: fms-prod_edge');
    expect(c).toContain('external: true');
    expect(c).toContain('- ilacore-site');
    expect(c).not.toMatch(/^\s*ports:/m);
  });
  it('applies the resource and hardening limits', () => {
    for (const s of ['mem_limit: 384m', 'restart: unless-stopped', 'read_only: true', 'no-new-privileges:true', 'max-size: 10m', 'max-file: "5"', '/app/.next/cache']) {
      expect(c).toContain(s);
    }
  });
});

describe('caddy snippets', () => {
  for (const f of ['deploy/caddy/ilacore-site.caddy', 'deploy/caddy/ilacore-site.preview.caddy']) {
    it(`${f} proxies to the container with security headers`, () => {
      const s = read(f);
      expect(s).toContain('reverse_proxy ilacore-site:3000');
      for (const h of ['Strict-Transport-Security', 'X-Content-Type-Options "nosniff"', 'X-Frame-Options "DENY"', "frame-ancestors 'none'"]) expect(s).toContain(h);
      expect(s).toContain('/_next/static/*');
    });
  }
  it('redirects www to the apex on the real snippet', () => {
    expect(read('deploy/caddy/ilacore-site.caddy')).toMatch(/www\.ilacore\.com \{\s*redir https:\/\/ilacore\.com\{uri\} permanent/);
  });
  it('serves only the sslip.io host on the preview snippet', () => {
    const s = read('deploy/caddy/ilacore-site.preview.caddy');
    expect(s).toContain('site-preview.167-86-99-73.sslip.io {');
    expect(s).not.toContain('ilacore.com {');
  });
});

describe('deploy scripts', () => {
  for (const f of ['scripts/deploy.sh', 'scripts/remote-deploy.sh', 'scripts/rollback.sh']) {
    it(`${f} stops on the first error and uses LF line endings`, () => {
      const s = read(f);
      expect(s).toContain('set -euo pipefail');
      expect(s).not.toContain('\r');
    });
  }
  it('ships committed files only and never the local .env', () => {
    const s = read('scripts/deploy.sh');
    expect(s).toContain('git archive');
    expect(s).not.toMatch(/\.env/);
  });
});
```

Run: `npm test`. Expected: FAIL (files missing).

- [ ] **Step 2: Write `deploy/compose.yml`**

```yaml
name: ilacore-site

services:
  site:
    image: ilacore-site:${SITE_TAG:?set SITE_TAG}
    env_file: .env
    restart: unless-stopped
    mem_limit: 384m
    read_only: true
    tmpfs:
      - /tmp
      - /app/.next/cache:uid=1001,gid=1001,mode=0755
    security_opt:
      - no-new-privileges:true
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: "5"
    networks:
      edge:
        aliases:
          - ilacore-site

networks:
  edge:
    external: true
    name: fms-prod_edge
```

- [ ] **Step 3: Write the Caddy snippets**

`deploy/caddy/ilacore-site.caddy`:

```
ilacore.com {
	encode zstd gzip
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "DENY"
		Content-Security-Policy "frame-ancestors 'none'"
		Referrer-Policy "strict-origin-when-cross-origin"
		-Server
	}
	@static path /_next/static/*
	header @static Cache-Control "public, max-age=31536000, immutable"
	reverse_proxy ilacore-site:3000
}

www.ilacore.com {
	redir https://ilacore.com{uri} permanent
}
```

`deploy/caddy/ilacore-site.preview.caddy`:

```
site-preview.167-86-99-73.sslip.io {
	encode zstd gzip
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "DENY"
		Content-Security-Policy "frame-ancestors 'none'"
		Referrer-Policy "strict-origin-when-cross-origin"
		X-Robots-Tag "noindex"
		-Server
	}
	@static path /_next/static/*
	header @static Cache-Control "public, max-age=31536000, immutable"
	reverse_proxy ilacore-site:3000
}
```

Before Task 14 installs either snippet, compare its header block with the `myfms.ilacore.com` block in the FMS Caddyfile. Copy across any header FMS sets that these lack.

- [ ] **Step 4: Write `scripts/remote-deploy.sh`**

```bash
#!/usr/bin/env bash
# Runs on the FMS VPS (piped over ssh by deploy.sh). Usage: remote-deploy.sh <sha> [public-url]
set -euo pipefail

SHA="$1"
PUBLIC_URL="${2:-}"
cd /home/fms/ilacore-site

set -a
# shellcheck disable=SC1091
. ./.env
set +a

PREV="$(tail -n 1 tags.log 2>/dev/null || true)"

docker build -t "ilacore-site:$SHA" \
  --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER \
  --build-arg NEXT_PUBLIC_SITE_URL \
  src

check() {
  docker compose exec -T site wget -qO- http://127.0.0.1:3000/ >/dev/null || return 1
  docker compose exec -T site wget -qO- http://127.0.0.1:3000/demo >/dev/null || return 1
  if [ -n "$PUBLIC_URL" ]; then
    curl -fsS -o /dev/null "$PUBLIC_URL/" || return 1
    curl -fsS -o /dev/null "$PUBLIC_URL/demo" || return 1
  fi
}

export SITE_TAG="$SHA"
if docker compose up -d --wait --wait-timeout 90 && check; then
  [ "$PREV" = "$SHA" ] || echo "$SHA" >> tags.log
  # Keep the last 3 tags; remove the images of older ones.
  tail -n 3 tags.log > tags.keep
  grep -vxF -f tags.keep tags.log | while read -r old; do
    docker image rm "ilacore-site:$old" >/dev/null 2>&1 || true
  done
  mv tags.keep tags.log
  echo "Deployed ilacore-site:$SHA"
else
  echo "Deploy of $SHA failed its health checks." >&2
  if [ -n "$PREV" ]; then
    echo "Rolling back to $PREV." >&2
    export SITE_TAG="$PREV"
    docker compose up -d --wait --wait-timeout 90
  fi
  exit 1
fi
```

`SITE_TAG` is exported before every `docker compose` call, because compose resolves `${SITE_TAG:?}` for `exec` as well as `up`.

- [ ] **Step 5: Write `scripts/deploy.sh`**

```bash
#!/usr/bin/env bash
# Run from the repo root on the developer machine.
# Usage: scripts/deploy.sh [--public-url https://ilacore.com]
set -euo pipefail

HOST="${DEPLOY_HOST:-fms-vps}"
REMOTE=/home/fms/ilacore-site
PUBLIC_URL=""
if [ "${1:-}" = "--public-url" ]; then PUBLIC_URL="${2:?missing URL}"; fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Commit or stash your changes first; only committed files are deployed." >&2
  exit 1
fi
SHA="$(git rev-parse --short HEAD)"

npm ci
npm test
npm run test:e2e

echo "Shipping $SHA to $HOST"
ssh "$HOST" "mkdir -p $REMOTE && rm -rf $REMOTE/src && mkdir $REMOTE/src"
git archive --format=tar HEAD | ssh "$HOST" "tar -x -C $REMOTE/src"
ssh "$HOST" "cat > $REMOTE/compose.yml" < deploy/compose.yml
ssh "$HOST" "bash -s -- $SHA $PUBLIC_URL" < scripts/remote-deploy.sh
```

- [ ] **Step 6: Write `scripts/rollback.sh`**

```bash
#!/usr/bin/env bash
# Run locally. Switches the VPS to the tag before the current one.
set -euo pipefail

HOST="${DEPLOY_HOST:-fms-vps}"
ssh "$HOST" 'bash -s' <<'EOF'
set -euo pipefail
cd /home/fms/ilacore-site
CUR="$(tail -n 1 tags.log)"
PREV="$(tail -n 2 tags.log | head -n 1)"
if [ -z "$PREV" ] || [ "$PREV" = "$CUR" ]; then echo "No earlier tag to roll back to." >&2; exit 1; fi
export SITE_TAG="$PREV"
docker compose up -d --wait --wait-timeout 90
head -n -1 tags.log > tags.tmp && mv tags.tmp tags.log
echo "Rolled back from $CUR to $PREV"
EOF
```

- [ ] **Step 7: Syntax-check and test**

```bash
bash -n scripts/deploy.sh && bash -n scripts/remote-deploy.sh && bash -n scripts/rollback.sh && echo "syntax ok"
npm test
```

Expected: `syntax ok`, and all unit tests pass, including the no-CR check. Add `"deploy": "bash scripts/deploy.sh"` to the `package.json` scripts.

- [ ] **Step 8: Commit**

```bash
git add deploy scripts/deploy.sh scripts/remote-deploy.sh scripts/rollback.sh tests/unit/deploy-files.test.ts package.json
git commit -m "build: add compose file, Caddy snippets and deploy/rollback scripts"
```

---

### Task 14: Launch (gated: each step needs the user's go-ahead)

This task changes systems outside the repo. **Before each step, tell the user exactly what will change and wait for a clear yes.** Approving one step doesn't approve the next.

- [ ] **Step 1: Collect the inputs (spec §10)**

Ask the user for: real screenshots, the sales email, the phone and WhatsApp numbers, the about-page facts, the legal entity name, and DNS access for `ilacore.com`.

Put screenshots in `public/screens/<product>-<name>.png` (at least 1600px wide) and set each `src`, `width` and `height` in `content/products.ts`. Replace every `CONFIRM` value in `content/site.ts` and `app/about/page.tsx`. Run `npm test && npm run test:e2e`; the "placeholder screenshots are clearly marked" test in `home.spec.ts` should then be deleted, since no placeholders remain. Commit.

If screenshots aren't ready, the site can launch with the marked placeholders, but only if the user says so.

- [ ] **Step 2: Decide how Caddy picks up snippet changes**

The FMS Caddy runs with its admin API off, so `caddy reload` fails. Put both options to the user:
- **a)** As part of the FMS change, set `admin localhost:2019` in the Caddyfile's global options. It is reachable only inside the Caddy container and isn't published. Snippet changes then apply with no downtime: `docker exec fms-prod-caddy-1 caddy reload --config /etc/caddy/Caddyfile`.
- **b)** Keep admin off and apply snippet changes with `docker restart fms-prod-caddy-1`. That gives `myfms.ilacore.com` a few seconds of downtime each time.

Recommend (a).

- [ ] **Step 3: FMS repository change (go-ahead, then FMS's own release process)**

In the FMS repo:
- Append `import /etc/caddy/sites/*.caddy` to `deploy/caddy/Caddyfile`, and add the admin option if the user chose 2a.
- In `compose.prod.yml`, add `- /home/fms/edge-sites:/etc/caddy/sites:ro` to the caddy service's volumes.

Before that release is deployed, create the mount source on the VPS (go-ahead): `ssh fms-vps 'mkdir -p /home/fms/edge-sites'`. An `import` glob that matches no files is not an error in Caddy, but the bind-mount source folder must exist. Then ship the change through FMS's normal release process.

- [ ] **Step 4: Prepare the VPS (go-ahead)**

```bash
ssh fms-vps 'mkdir -p /home/fms/ilacore-site && touch /home/fms/ilacore-site/.env && chmod 600 /home/fms/ilacore-site/.env'
```

The user fills `/home/fms/ilacore-site/.env` with the five §5 variables, or asks you to. Until Resend is set up (Step 7), leave `RESEND_API_KEY` empty. The form then shows the WhatsApp fallback, which is the designed failure path.

- [ ] **Step 5: First deploy and tunnel preview (go-ahead)**

Run: `npm run deploy`. Expected: `Deployed ilacore-site:<sha>`.

The container publishes no ports, so preview it through an SSH tunnel to its address on the edge network:

```bash
IP=$(ssh fms-vps "docker inspect -f '{{(index .NetworkSettings.Networks \"fms-prod_edge\").IPAddress}}' ilacore-site-site-1")
ssh -N -L 3300:$IP:3000 fms-vps
```

Open http://localhost:3300 in the browser pane and review the site with the user.

- [ ] **Step 6: Preview host (go-ahead; needs the Step 3 release deployed)**

Copy the snippet, then validate the full FMS config including the snippet in a throwaway container:

```bash
scp deploy/caddy/ilacore-site.preview.caddy fms-vps:/home/fms/edge-sites/ilacore-site.caddy
ssh fms-vps 'CF=$(docker inspect -f "{{range .Mounts}}{{if eq .Destination \"/etc/caddy/Caddyfile\"}}{{.Source}}{{end}}{{end}}" fms-prod-caddy-1); docker run --rm -v /home/fms/edge-sites:/etc/caddy/sites:ro -v "$CF":/etc/caddy/Caddyfile:ro caddy:2.11.6-alpine caddy validate --config /etc/caddy/Caddyfile'
```

If `validate` fails, delete the snippet (`ssh fms-vps rm /home/fms/edge-sites/ilacore-site.caddy`) and fix it. Don't reload. If it passes, reload (2a) or restart (2b). Then check that both `https://site-preview.167-86-99-73.sslip.io/` and `https://myfms.ilacore.com/` return 200.

- [ ] **Step 7: Resend (go-ahead; the user creates the account)**

The user creates the Resend account, verifies `ilacore.com` by adding the DNS records Resend gives, and creates an API key. They put the key, `LEAD_FROM_EMAIL` (for example `website@ilacore.com`) and `LEAD_TO_EMAIL` into the VPS `.env`. Then re-run `npm run deploy` (go-ahead) and send one real test lead from the preview host while the user watches the inbox.

- [ ] **Step 8: Quality audit on the preview host**

Run a mobile Lighthouse audit on `/`, `/fms`, `/telematics` and `/demo` with the Chrome DevTools tools. All four categories must score ≥ 95. Check reduced motion and the 360px layout in the browser pane. Fix anything below the bar, then redeploy (go-ahead).

- [ ] **Step 9: Go live (go-ahead for each change)**

1. The user points the `ilacore.com` and `www.ilacore.com` A records at `167.86.99.73`.
2. Once `nslookup ilacore.com` returns that IP, copy `deploy/caddy/ilacore-site.caddy` over the preview snippet. Validate and reload exactly as in Step 6.
3. Run `npm run deploy -- --public-url https://ilacore.com` (go-ahead). This also checks the public URL.
4. Confirm that `https://ilacore.com/`, `https://www.ilacore.com/` (redirects), `https://ilacore.com/sitemap.xml` and `https://myfms.ilacore.com/` all work.

- [ ] **Step 10: Record the launch**

Update the project memory file (`ilacore-website.md`) with: the site is live, the deploy command, where `.env` lives, and which Caddy reload method was chosen. Commit any repo changes.
