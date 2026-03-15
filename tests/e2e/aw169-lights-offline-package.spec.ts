import { test, expect } from '@playwright/test';

const CASES = [
  {
    name: 'engine systems offline package warms AW169 lights assets',
    sectionTitle: 'Engine, Fuel, Lubricants, Hydraulics & System Limitations',
  },
  {
    name: 'emergency procedures offline package warms AW169 lights assets',
    sectionTitle: 'Emergency Procedures',
  },
] as const;

const REQUIRED_WARM_PATHS = [
  '/training/lights',
  '/training/lights/cwp/aw169',
  '/aw169/procedures/single-engine',
  '/aw169/procedures/engine-shutdown-emergency',
  '/aw169/procedures/engine-re-light',
  '/training/lights/manifest.json',
  '/training/lights/eng-oil-press.json',
  '/training/lights/pages/aw169-eng-oil-press.svg',
] as const;

for (const scenario of CASES) {
  test(scenario.name, async ({ page }) => {
    const seenPaths = new Set<string>();

    page.on('request', (request) => {
      try {
        seenPaths.add(new URL(request.url()).pathname);
      } catch {}
    });

    await page.addInitScript(() => {
      localStorage.setItem('rr_active_model_variant', 'AW169');
      localStorage.setItem('rr_e2e_logged_in', '1');
    });

    await page.goto('/offline');

    const row = page.locator('li', { hasText: scenario.sectionTitle });
    await expect(row).toBeVisible({ timeout: 15000 });
    await row.getByRole('button', { name: /last ned|oppdater/i }).click();

    await expect(row.getByText('Lagret lokalt')).toBeVisible({ timeout: 15000 });
    await expect
      .poll(() => REQUIRED_WARM_PATHS.every((path) => seenPaths.has(path)), { timeout: 15000 })
      .toBe(true);

    await page.goto('/training/lights/cwp/aw169');
    await expect(page.getByRole('heading', { name: 'CWP-trainer · AW169' })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: '1(2) ENG OIL PRESS' }).click();
    await expect
      .poll(() => page.evaluate(() => window.location.pathname), { timeout: 15000 })
      .toBe('/training/lights');
    await expect(page.getByRole('button', { name: 'Close procedure' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByAltText('1(2) ENG OIL PRESS')).toBeVisible({ timeout: 15000 });

    await page.goto('/aw169/procedures/single-engine?resume=1&v=AW169&light=eng-oil-press&mem=0&cwp=1');
    await expect(page.getByRole('heading', { name: 'SINGLE ENGINE PROCEDURE' })).toBeVisible({ timeout: 15000 });
    await page.getByRole('link', { name: 'ENGINE SHUTDOWN IN EMERGENCY' }).click();

    await expect(page.getByRole('heading', { name: 'ENGINE SHUTDOWN IN EMERGENCY' })).toBeVisible({ timeout: 15000 });
  });
}