import { test, expect } from '@playwright/test';

// page.route() does not see requests the service worker makes; once it takes
// control mid-test it would fetch the real section and defeat the "offline" setup.
test.use({ serviceWorkers: 'block' });

// With no network, a section that was downloaded for offline use before still
// starts from its saved copy (older installs may hold one).
const CASES = [
  { section: 'emergency_procedures', heading: 'Emergency Procedures' },
  { section: 'engine-systems', heading: 'Engine, Fuel, Lubricants, Hydraulics & System Limitations' },
  { section: 'avionics_fms_limitations', heading: 'Avionics & FMS Limitations' },
] as const;

for (const { section, heading } of CASES) {
  test(`${section} starts from downloaded offline section data`, async ({ page }) => {
    const item = { id: `${section}-offline-1`, section, type: 'single', question: `${section} offline question?`, options: ['A', 'B'], answer: [1] };
    await page.addInitScript(({ section, item }) => {
      localStorage.setItem('rr_active_model_variant', 'AW169');
      localStorage.setItem(`offline:sections:AW169:${section}`, JSON.stringify({
        type: 'section', id: section, payload: { items: [item] }, savedAt: '2024-01-01T00:00:00.000Z',
      }));
    }, { section, item });

    await page.route('**/model-data/**', (route) => route.abort());
    await page.route('**/quiz-data/**', (route) => route.abort());
    await page.route('**/api/blocked-questions', (route) => route.abort());

    await page.goto(`/quiz/${section}`);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('1 total')).toBeVisible({ timeout: 15000 });

    await expect(async () => {
      await page.getByRole('button', { name: /^start quiz$/i }).first().click();
      await expect.poll(() => page.evaluate(() => window.location.pathname)).toBe(`/quiz/${section}/play/q`);
    }).toPass({ timeout: 15000 });

    await expect(page.getByText('Question 1 / 1').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(item.question)).toBeVisible({ timeout: 15000 });
  });
}
