# ILACORE Website — Design Spec

**Date:** 2026-11-19
**Status:** Approved in brainstorming, awaiting written-spec review
**Location:** `D:\ilacore website`

## 1. Purpose

A B2B marketing site for ILACORE, a multi-solution company. Its one job is to get qualified buyers to **book a demo**. Pricing stays private.

- **Market:** fuel and fleet operators across Africa and the Middle East. English at launch.
- **Live products:** ILACORE FMS (Fuel Management System) and ILACORE Telematics.
- **Future products:** LPG solution and others. Adding one must not require a redesign.
- **Proof available:** real product screenshots. No client logos or public numbers yet; the live hero instrument and screenshots carry the credibility.

## 2. Visual direction — "Command console", revised

### Concept
The most characteristic thing in the customer's world is **accounting for every litre and every vehicle**. The hero is one live instrument: a diesel tank level drains while a truck moves along a route across Africa and the Middle East, and a reconciliation readout (delivered / sold / unaccounted) ticks alongside. This is the single bold element. Everything else is calm, light and product-led.

### Colour tokens
| Token | Hex | Use |
|---|---|---|
| `navy` | `#010875` | Hero background, headings, primary buttons |
| `navy-deep` | `#000133` | Footer, contrast panels, demo section |
| `gold` | `#DCA238` | Fuel (AGO), cautions, logo "o", the **Book a demo** button. Never decorative |
| `emerald` | `#1CD1A1` | Live data only: online dots, moving vehicles |
| `paper` | `#F9F9FF` | Content section background |
| `ink` | `#141C29` | Body text |
| `ink-muted` | `#454652` | Secondary text |
| `line` | `#C6C5D4` | Hairline borders |

Colour encodes meaning: gold = fuel or caution, emerald = live.

### Type
- **Nunito Sans** for display and headings. Large, tight tracking (`-0.02em`); the headline is an active visual element.
- **Inter** for body text, 16–18px, line length ≤ 75 characters.
- **JetBrains Mono** only for real readings (`24,418 L`, coordinates, timestamps), with `tabular-nums`.
- Scale (1.25 ratio): 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61px (hero headline 61px desktop, 39px mobile).

### Shape and depth
Radii from the brand system: 4px for inputs, buttons and chips; 8px for panels and screenshots. No pills except status dots. Depth comes from tonal layers and 1px hairlines, not soft shadows.

### Rules
- Left-aligned throughout.
- No uppercase labels and no decorative monospace on marketing pages. Console styling (uppercase labels) appears only inside the hero instrument and screenshots, where it is the product itself.
- No grids of identical cards. Each product gets a wide row built around a screenshot.
- Motion: only the hero instrument animates (one orchestrated sequence). No scroll-triggered fades. `prefers-reduced-motion` shows a static instrument.
- Numbered markers only where content is a real sequence ("How it starts").
- Copy: plain, specific, active voice, sentence case. No "seamless", "unlock" or "empower".

## 3. Sitemap and navigation

```
/              Home
/fms           ILACORE FMS
/telematics    ILACORE Telematics
/solutions     All solutions (live + coming soon)
/industries    Fuel stations, fleet depots, oil marketing companies, transport
/about         Company, where ILACORE operates
/demo          Book a demo
/privacy       Privacy policy
/terms         Terms
```

**Header:** logo, FMS, Telematics, Solutions, Industries, About, and the gold **Book a demo** button. On mobile, a menu button plus **Book a demo**, which stays pinned in the header.

**Footer (navy-deep):** white logo, product links, contact (email, phone, WhatsApp), legal links.

## 4. Pages

### Home
```
Hero (navy)    "Account for every litre and every kilometre."
               2-line sub · [Book a demo] [Chat on WhatsApp] · live instrument
ILACORE FMS        wide row: screenshot right, 3 outcomes, link to /fms
ILACORE Telematics wide row mirrored: screenshot left, 3 outcomes, link
Works offline  data is buffered on-site/on-device and sent when coverage returns
How it starts  1 Install · 2 Connect · 3 Dashboards · 4 Alerts
Coming next    LPG solution, "Register interest"
Demo section   shared component (navy-deep)
```

### Product page template (used by /fms and /telematics)
```
Hero         name, promise, screenshot, [Book a demo] (product pre-selected)
Problem      2–3 losses this product stops, in the buyer's words
Features     grouped by job-to-be-done, each with a screenshot crop
Hardware     what is installed; offline behaviour
Who it's for links to matching industries
Demo section product pre-selected
```

**FMS** — promise: *"Know what's in every tank and where every litre went."*
- Tank monitoring: live level and ullage per tank and grade (PMS, AGO)
- Dispensers and sales: litres dispensed per pump, reconciled against deliveries
- Loss detection: delivered vs sold vs measured, with alerts when litres go missing
- Network view: every station on one screen, for oil marketing companies
- Connectivity health: gateway and dispenser online status

**Telematics** — promise: *"See every vehicle, and every risk on the road, as it happens."*
Live features (shipped):
- Live map of every vehicle and its status
- AI dashcam alerts (driver monitoring and collision warnings), detected on the camera
- Alerts feed: acknowledge and resolve, with a record of who did what
- Escalation rules (e.g. 3 fatigue alerts in 30 minutes → notify the manager)
- Team access with admin and operator roles; installable app for phones

Coming soon (labelled as such, never presented as live): spoken in-cab driver companion and automatic crash SOS.

### Solutions
All products from `content/products.ts`. Live products link to their page. Coming-soon products show a short description and **Register interest**, which opens `/demo?product=<slug>&intent=interest`.

### Industries
One page with four sections (fuel stations → FMS; fleet depots → FMS + Telematics; oil marketing companies → FMS network view; transport and logistics → Telematics). Each section states the problem and links to the product.

### About
Who ILACORE is, the regions served, and contact details. Copy to be supplied or reviewed by ILACORE.

### Demo (`/demo`)
Form fields:
- Name (required)
- Company (required)
- Country (required, select)
- Phone or WhatsApp (required)
- Products (required, multi-select, from `products.ts`)
- Fleet or station size (optional)

Query params `product` and `intent` pre-fill the form. Beside the form: WhatsApp, phone and email.

## 5. Architecture

### Stack
- Next.js (App Router), all pages statically generated, built as a `standalone` Node server (the demo form's server action needs a server)
- Tailwind CSS with the tokens in §2
- `next/font` self-hosting Nunito Sans, Inter and JetBrains Mono
- shadcn/ui only for form controls and the mobile menu
- Hero instrument: hand-built SVG plus a small client component; no animation library

### Units
| Unit | Responsibility | Depends on |
|---|---|---|
| `content/products.ts` | Typed list of products: `slug`, `name`, `status: 'live' \| 'coming-soon'`, `promise`, `problems[]`, `features[]`, `screens[]`, `industries[]` | nothing |
| `content/site.ts` | Contact details, WhatsApp number, nav items, legal entity | nothing |
| `components/hero-instrument` | Animated tank + route + readout; static when reduced motion is on | tokens only |
| `components/product-row` | Wide screenshot + outcomes row, mirror option | `products.ts` |
| `components/demo-section` | Shared end-of-page CTA | `site.ts` |
| `app/[product]/page.tsx` | Product template, generated for every live product | `products.ts` |
| `app/demo/` | Form (client) + server action | `products.ts`, `lib/lead` |
| `lib/lead.ts` | Validate (zod), honeypot check, rate-limit, send email via Resend | Resend API key (env) |

Adding a product = add an entry to `products.ts` plus its screenshots. Setting `status: 'live'` generates its page and adds it to nav, Solutions and the form.

### Demo form data flow
```
Visitor submits → server action → zod validation
  → honeypot filled?  → pretend success, drop silently
  → rate limit hit?   → "Too many attempts. Try again in a few minutes, or message us on WhatsApp."
  → Resend send email to ILACORE sales inbox (env: LEAD_TO_EMAIL)
      ok   → confirmation: "We'll contact you within one working day" + WhatsApp button
      fail → "Your request didn't send. Message us on WhatsApp or try again." (form data kept)
```
Field errors appear inline next to each field. No lead is ever dropped silently except honeypot spam.

### Configuration (env)
`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`. Secrets are never committed; `.env.example` lists the names only.

## 6. Quality bar
- **SEO:** per-page title and description, canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph images, JSON-LD `Organization` plus a `Product` per live product.
- **Accessibility:** WCAG 2.2 AA. Contrast checked for every token pairing (gold buttons use `navy-deep` text), visible focus rings, labelled fields, skip link, keyboard-operable menu.
- **Performance:** Lighthouse ≥ 95 on mobile for Performance, Accessibility, Best Practices and SEO. Screenshots served via `next/image` (AVIF/WebP).
- **Responsive:** 360px to 1440px+, no horizontal scroll.

## 7. Testing
- **Playwright:** every route renders with a 200 status and has an `h1`; the demo form shows field errors when submitted empty; it succeeds with the email send mocked; it shows the WhatsApp fallback when the send is mocked to fail; query-param pre-fill works.
- **Unit tests:** `lib/lead.ts` validation and honeypot behaviour; `products.ts` integrity (unique slugs, every live product has at least one screen).
- **Before launch:** Lighthouse audit via Chrome DevTools, reduced-motion check, mobile check.

## 8. Hosting and launch — FMS VPS

The site runs on the FMS VPS (167.86.99.73, `ssh fms-vps`: Ubuntu 24.04, 4 CPU, 7.8 GB RAM, Docker; no Node on the host). Everything there runs in Docker Compose projects. The `fms-prod` stack's Caddy container (`fms-prod-caddy-1`) owns ports 80/443 and serves `myfms.ilacore.com`. Its Caddyfile ships inside each FMS release (`deploy/caddy/Caddyfile`, mounted read-only), and its admin API is off.

### Approach
The website is its own Compose project, `ilacore-site`, with one container. It joins the existing `fms-prod_edge` network so the FMS Caddy can reach it, and it publishes no ports.

Routing needs a **one-time change in the FMS repository**, shipped in the next FMS release:
1. The FMS Caddyfile gets one line at the end: `import /etc/caddy/sites/*.caddy`.
2. `compose.prod.yml` mounts `/home/fms/edge-sites` (read-only) at `/etc/caddy/sites` in the Caddy container.

After that, the website owns its own snippet file, `/home/fms/edge-sites/ilacore-site.caddy`, and never edits FMS files again. FMS releases leave the website untouched, and website releases leave FMS untouched.

The snippet serves `ilacore.com` (redirecting `www.ilacore.com` to it) with automatic HTTPS, zstd/gzip, security headers matching the FMS block (HSTS, nosniff, frame-deny, CSP `frame-ancestors 'none'`), long cache headers for `/_next/static/*`, and `reverse_proxy ilacore-site:3000`.

### Details
| Item | Value |
|---|---|
| Image | `ilacore-site:<git-sha>`, multi-stage Dockerfile (`node:24-alpine`), Next.js `standalone` output, runs as non-root user |
| Compose project | `/home/fms/ilacore-site/compose.yml`, project name `ilacore-site`, service `site`, network alias `ilacore-site` on external network `fms-prod_edge` |
| Limits | `mem_limit: 384m`, `restart: unless-stopped`, `no-new-privileges`, read-only root filesystem with a tmpfs for `/tmp` |
| Env | `/home/fms/ilacore-site/.env`, mode 600, holds the §5 variables |
| Logs | Docker json-file (10 MB × 5), same as the FMS services |
| Health | container healthcheck on `GET /` |

**Naming:** everything is called `ilacore-site`, which doesn't clash with any `fms-*` container, network or volume. The site uses no database and doesn't touch FMS's Postgres.

### Deploy flow
`scripts/deploy.sh`, run from the developer machine (no Docker needed locally):
```
npm ci && npm test                      (locally)
  → rsync source to fms-vps:/home/fms/ilacore-site/src/
  → on the VPS: docker build -t ilacore-site:<sha>
  → docker compose up -d with the new tag; wait for the container to be healthy
  → curl https://ilacore.com/ and /demo → if not 200, re-tag the previous image and up -d again
```
The last 3 image tags are kept for instant rollback (`scripts/rollback.sh`). Old tags are pruned so the disk (66% used) doesn't fill up.

### Preview before going live
Before the FMS Caddy change ships, the site can be reviewed through an SSH tunnel to the container. After it ships, the snippet first serves a temporary host (`site-preview.167-86-99-73.sslip.io`) for review. Then the `ilacore.com` DNS A record is pointed at 167.86.99.73 and the snippet is switched to the real domain.

### Risks
- **Shared edge:** the website shares FMS production's Caddy, so if `fms-prod` is down, the website is too. The website can't break FMS, though: it only adds a snippet. Each snippet change is validated in a throwaway `caddy:2.11.6-alpine` container (`caddy validate`) before the FMS Caddy reloads it.
- **Shared resources:** the site container is capped at 384 MB, so it can't starve FMS.

**Go-ahead needed each time:** the FMS repository change and its release, any change on the VPS, DNS changes for `ilacore.com`, creating the Resend account, and each production deploy.

## 9. Out of scope for launch
Blog, client login, public pricing, multi-language (the structure leaves room for Arabic and French), CMS (content lives in TypeScript files), analytics (none at launch; a privacy-friendly self-hosted tool can be added later).

## 10. Inputs needed from ILACORE
- Real product screenshots for FMS and Telematics (placeholders, clearly marked, until then)
- Sales email, phone and WhatsApp number
- About page facts: founding, HQ, countries served
- Domain confirmation, and access to its DNS settings (`myfms.ilacore.com` already points at the FMS VPS)
- Legal entity name for privacy and terms
