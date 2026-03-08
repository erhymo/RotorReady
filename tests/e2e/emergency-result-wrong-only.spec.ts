import { test, expect } from '@playwright/test';

const SESSION_KEY = 'emergq_session';
const LAST_WRONG_KEY = 'rr_progress_last_wrong:AW169:emergency_procedures';
const LEGACY_LAST_WRONG_KEY = 'rr_progress_last_wrong:emergency_procedures';

test('emergency result page persists wrong-only set and restarts from missed items', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem('rr_e2e_logged_in', '1');
    sessionStorage.setItem('emergq_session', JSON.stringify({
      section: 'emergency_procedures',
      createdAt: '2024-01-01T00:00:00.000Z',
      items: [
        {
          id: 'emerg-result-1',
          section: 'emergency_procedures',
          type: 'single',
          question: 'Which emergency answer is already correct?',
          options: ['A', 'B'],
          answer: [1],
        },
        {
          id: 'emerg-result-2',
          section: 'emergency_procedures',
          type: 'single',
          question: 'Which emergency item should remain for wrong-only practice?',
          options: ['A', 'B'],
          answer: [1],
        },
      ],
      answers: [1, 0],
      flags: [true, true],
    }));
  });

  await page.goto('/emergency-quiz/result');

  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Correct:').locator('..')).toContainText('1');

  await expect
    .poll(async () => page.evaluate((storageKey) => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw).items?.map((item: { id: string }) => item.id) || null;
    }, LAST_WRONG_KEY))
    .toEqual(['emerg-result-2']);

  await expect
    .poll(async () => page.evaluate((storageKey) => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw).items?.map((item: { id: string }) => item.id) || null;
    }, LEGACY_LAST_WRONG_KEY))
    .toEqual(['emerg-result-2']);

  await page.evaluate((key) => sessionStorage.removeItem(key), SESSION_KEY);

  await expect(async () => {
    await page.getByRole('link', { name: 'Try again' }).click();
    await expect(page).toHaveURL(/\/emergency-quiz$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByRole('heading', { name: 'Emergency Procedures Quiz' })).toBeVisible({ timeout: 15000 });
  const wrongOnlyCard = page.locator('div.rounded-xl')
    .filter({ has: page.getByText('Practice wrong answers only', { exact: true }) })
    .filter({ has: page.getByText('Reuse your last wrong set for focused practice.', { exact: true }) });
  await expect(wrongOnlyCard).toBeVisible();

  await expect(async () => {
    await wrongOnlyCard.getByRole('button', { name: /^start$/i }).click();
    await expect(page).toHaveURL(/\/emergency-quiz\/1$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByText('Question 1 / 1').first()).toBeVisible();
  await expect(page.getByText('Which emergency item should remain for wrong-only practice?')).toBeVisible();

  const session = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key) || 'null'), SESSION_KEY);

  expect(session?.section).toBe('emergency_procedures');
  expect(session?.items?.map((item: { id: string }) => item.id)).toEqual(['emerg-result-2']);
  expect(session?.answers).toEqual([null]);
  expect(session?.flags).toEqual([false]);
  expect(session?.createdAt).not.toBe('2024-01-01T00:00:00.000Z');
});