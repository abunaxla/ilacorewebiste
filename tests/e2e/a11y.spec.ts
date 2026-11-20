import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { routes } from './routes';

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
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});
