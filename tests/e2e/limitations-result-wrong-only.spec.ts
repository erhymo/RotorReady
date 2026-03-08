import { test, expect } from '@playwright/test';

const LAST_WRONG_KEY = 'rr_progress_last_wrong:AW169:limitations';
const HISTORY_KEY = 'rr_wrong_history:AW169:limitations';

test('limitations result page persists wrong-only set and restarts from missed items', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    sessionStorage.setItem('limq_session', JSON.stringify({
      section: 'limitations',
      createdAt: '2024-01-01T00:00:00.000Z',
      items: [
        {
          id: 'lim-result-1',
          section: 'limitations',
          type: 'single',
          question: 'Which answer is already correct?',
          options: ['A', 'B'],
          answer: [1],
        },
        {
          id: 'lim-result-2',
          section: 'limitations',
          type: 'single',
          question: 'Which item should remain for wrong-only practice?',
          options: ['A', 'B'],
          answer: [1],
        },
      ],
      answers: [1, 0],
      flags: [true, true],
    }));
  });

  await page.goto('/limitations-quiz/result');

  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Correct:').locator('..')).toContainText('1');

  await expect
    .poll(async () => page.evaluate(() => {
      const raw = localStorage.getItem('rr_progress_last_wrong:AW169:limitations');
      if (!raw) return null;
      return JSON.parse(raw).items?.map((item: { id: string }) => item.id) || null;
    }))
    .toEqual(['lim-result-2']);

  await expect
    .poll(async () => page.evaluate(() => {
      const raw = localStorage.getItem('rr_wrong_history:AW169:limitations');
      if (!raw) return null;
      return JSON.parse(raw).at(-1)?.items?.map((item: { id: string }) => item.id) || null;
    }))
    .toEqual(['lim-result-2']);

  await expect(async () => {
    await page.getByRole('button', { name: 'Practice wrong answers only' }).click();
    await expect(page).toHaveURL(/\/limitations-quiz\/1$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByText('Question 1 / 1').first()).toBeVisible();
  await expect(page.getByText('Which item should remain for wrong-only practice?')).toBeVisible();

  const session = await page.evaluate(() => JSON.parse(sessionStorage.getItem('limq_session') || 'null'));

  expect(session?.section).toBe('limitations');
  expect(session?.items?.map((item: { id: string }) => item.id)).toEqual(['lim-result-2']);
  expect(session?.answers).toEqual([null]);
  expect(session?.flags).toEqual([false]);
  expect(session?.createdAt).not.toBe('2024-01-01T00:00:00.000Z');
});