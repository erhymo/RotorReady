import { test, expect } from '@playwright/test';

const SESSION_KEY = 'engineq_session';
const LAST_WRONG_KEY = 'rr_progress_last_wrong:AW169:engine-systems';
const LEGACY_LAST_WRONG_KEY = 'rr_progress_last_wrong:engine-systems';

test('engine result page persists wrong-only set and restarts from missed items', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem('rr_e2e_logged_in', '1');
    sessionStorage.setItem('engineq_session', JSON.stringify({
      section: 'ENGINE, FUEL, LUBRICANTS, HYDRAULICS & SYSTEM LIMITATIONS',
      createdAt: '2024-01-01T00:00:00.000Z',
      items: [
        { id: 'engine-result-1', section: 'engine-systems', type: 'single', question: 'Which engine answer is already correct?', options: ['A', 'B'], answer: [1] },
        { id: 'engine-result-2', section: 'engine-systems', type: 'single', question: 'Which engine item should remain for wrong-only practice?', options: ['A', 'B'], answer: [1] },
      ],
      answers: [1, 0],
      flags: [true, true],
    }));
  });

  await page.goto('/engine-systems-quiz/result');

  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Correct:').locator('..')).toContainText('1');

  await expect
    .poll(async () => page.evaluate((storageKey) => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw).items?.map((item: { id: string }) => item.id) || null;
    }, LAST_WRONG_KEY))
    .toEqual(['engine-result-2']);

  await expect
    .poll(async () => page.evaluate((storageKey) => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw).items?.map((item: { id: string }) => item.id) || null;
    }, LEGACY_LAST_WRONG_KEY))
    .toEqual(['engine-result-2']);

  await page.evaluate((key) => sessionStorage.removeItem(key), SESSION_KEY);

  await expect(async () => {
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page).toHaveURL(/\/engine-systems-quiz$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByRole('heading', { name: 'Engine, Fuel, Lubricants, Hydraulics & System Limitations' })).toBeVisible({ timeout: 15000 });
  const wrongOnlyCard = page.locator('div.rounded-xl')
    .filter({ has: page.getByText('Practice wrong answers only', { exact: true }) })
    .filter({ has: page.getByText('Builds a set of questions you recently got wrong.', { exact: true }) });
  await expect(wrongOnlyCard).toBeVisible();

  await expect(async () => {
    await wrongOnlyCard.getByRole('button', { name: /^start$/i }).click();
    await expect(page).toHaveURL(/\/engine-systems-quiz\/1$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByText('Question 1 / 1').first()).toBeVisible();
  await expect(page.getByText('Which engine item should remain for wrong-only practice?')).toBeVisible();

  const session = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key) || 'null'), SESSION_KEY);

  expect(session?.section).toBe('ENGINE, FUEL, LUBRICANTS, HYDRAULICS & SYSTEM LIMITATIONS');
  expect(session?.items?.map((item: { id: string }) => item.id)).toEqual(['engine-result-2']);
  expect(session?.answers).toEqual([null]);
  expect(session?.flags).toEqual([false]);
  expect(session?.createdAt).not.toBe('2024-01-01T00:00:00.000Z');
});