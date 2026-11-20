# ILACORE website

Marketing site for ILACORE: it presents ILACORE FMS (Fuel Management System) and ILACORE Telematics, announces LPG as coming soon, and books demos through a form that emails the sales team. Built with Next.js (App Router), React, Tailwind CSS 4, Vitest and Playwright.

## Develop

```bash
npm install
npm run dev
```

Tailwind is wired through Turbopack only (`@tailwindcss/turbopack`), so run the dev server and the build with the default Turbopack bundler.

## Test

```bash
npm test               # Vitest unit tests
npx playwright test    # end-to-end tests (builds the site and serves it on port 3100)
npx eslint .
npx tsc --noEmit
```

Set `CI=1` to make Playwright always start a fresh server instead of reusing one already running on port 3100.

## Environment

Names only; copy `.env.example` and fill in the values.

- `RESEND_API_KEY`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`
- `LEAD_TRANSPORT` (test only; leave empty in production)
- `LEAD_RATE_LIMIT` (test only; leave empty in production)

On the VPS the `.env` file must be plain `KEY=value` lines: no `export`, no inline comments, no multi-line values. The deploy refuses to build if `LEAD_TRANSPORT` is anything but empty or `resend`, or if `LEAD_RATE_LIMIT` is set.

## Deploy

Deploys go through `npm run deploy` (`scripts/deploy.sh`) to the FMS VPS. It runs the tests, ships the committed files and builds there. Only run it with the owner's go-ahead.
