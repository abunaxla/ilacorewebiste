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
  const name = page.getByLabel('Name', { exact: true });
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAttribute('aria-describedby', 'name-error');
  await expect(name).toBeFocused();
});

test('shows an inline error for an over-long size', async ({ page }) => {
  await page.goto('/demo');
  await fill(page, 'Coast Fuels');
  const size = page.getByLabel('Fleet or station size');
  await expect(size).toHaveAttribute('maxlength', '60');
  await size.evaluate((el) => el.removeAttribute('maxlength'));
  await size.fill('x'.repeat(61));
  await page.getByRole('button', { name: 'Request a demo' }).click();
  await expect(page.getByText('Fleet size is too long.')).toBeVisible();
  await expect(page.getByLabel('Fleet or station size')).toHaveAttribute('aria-invalid', 'true');
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
  // The Next.js route announcer also has role=alert, so scope to the form.
  const alert = page.locator('form [role="alert"]');
  await expect(alert).toContainText("Your request didn't send. Message us on WhatsApp or try again.");
  await expect(alert.getByRole('link', { name: 'Chat on WhatsApp' })).toBeVisible();
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

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  // The server sends the heading and form, so nothing appears or shifts after load.
  test('serves the form and the preselected product in the first HTML', async ({ page }) => {
    await page.goto('/demo?product=telematics&intent=interest');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Register your interest');
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible();
    await expect(page.getByLabel('ILACORE Telematics')).toBeChecked();
    await expect(page.getByLabel('ILACORE FMS')).not.toBeChecked();
  });
});
