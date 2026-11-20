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
    timeout: 480_000,
    reuseExistingServer: !process.env.CI,
    env: {
      LEAD_TRANSPORT: 'mock',
      LEAD_RATE_LIMIT: '50',
      NEXT_PUBLIC_SITE_URL: 'https://ilacore.com',
      NEXT_PUBLIC_WHATSAPP_NUMBER: '+254700000000',
    },
  },
});
