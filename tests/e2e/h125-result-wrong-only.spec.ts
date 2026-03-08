import { test, expect } from '@playwright/test';

const SECTION = 'normal_procedures';
const SESSION_KEY = `h125q_session:AW169:${SECTION}`;
const LAST_WRONG_KEY = `rr_progress_last_wrong:AW169:${SECTION}`;
const HISTORY_KEY = `rr_wrong_history:AW169:${SECTION}`;

test('h125 result page persists wrong-only set and restarts from missed items', async ({ page }) => {
  await page.addInitScript(({ sessionKey }) => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    sessionStorage.setItem(sessionKey, JSON.stringify({
      section: 'normal_procedures',
      createdAt: '2024-01-01T00:00:00.000Z',
      amountToken: 'all',
      items: [
        {
          id: 'h125-result-1',
          section: 'normal_procedures',
          type: 'single',
          question: 'Which H125 answer is already correct?',
          options: ['A', 'B'],
          answer: [1],
        },
        {
          id: 'h125-result-2',
          section: 'normal_procedures',
          type: 'single',
          question: 'Which H125 item should remain for wrong-only practice?',
          options: ['A', 'B'],
          answer: [1],
        },
      ],
      answers: [1, 0],
      flags: [true, true],
    }));
  }, { sessionKey: SESSION_KEY });

  await page.goto(`/quiz/${SECTION}/h125/result`);

  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Correct:').locator('..')).toContainText('1');

  await expect
    .poll(async () => page.evaluate(storageKey => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw).items?.map((item: { id: string }) => item.id) || null;
    }, LAST_WRONG_KEY))
    .toEqual(['h125-result-2']);

  await expect
    .poll(async () => page.evaluate(storageKey => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw).at(-1)?.items?.map((item: { id: string }) => item.id) || null;
    }, HISTORY_KEY))
    .toEqual(['h125-result-2']);

  await expect(async () => {
    await page.getByRole('button', { name: 'Practice wrong answers only' }).click();
    await expect(page).toHaveURL(new RegExp(`/quiz/${SECTION}/h125/1$`), { timeout: 5000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByText('Question 1 / 1').first()).toBeVisible();
  await expect(page.getByText('Which H125 item should remain for wrong-only practice?')).toBeVisible();

  const session = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key) || 'null'), SESSION_KEY);

  expect(session?.section).toBe(SECTION);
  expect(session?.items?.map((item: { id: string }) => item.id)).toEqual(['h125-result-2']);
  expect(session?.answers).toEqual([null]);
  expect(session?.flags).toEqual([false]);
});