import { test, expect } from '@playwright/test';

const HISTORY_KEY = 'rr_wrong_history:AW169:normal_procedures';
const FALLBACK_KEY = 'rr_progress_last_wrong:AW169:emergency_procedures';
const OVERRIDE_KEY = 'quiz_session_override:AW169:all_wrong';
const RESUME_KEY = 'quiz:resume:AW169:all_wrong:all';

test('account mixed wrong-only prefers history items over fallback duplicates', async ({ page }) => {
  await page.addInitScript(({ historyKey, fallbackKey }) => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem(historyKey, JSON.stringify([
      {
        createdAt: '2024-01-01T00:00:00.000Z',
        items: [{ id: 'shared-1', section: 'normal_procedures', question: 'History question wins', options: ['A', 'B'], answer: [0] }],
      },
    ]));
    localStorage.setItem(fallbackKey, JSON.stringify({
      section: 'emergency_procedures',
      createdAt: '2024-01-02T00:00:00.000Z',
      items: [
        { id: 'shared-1', section: 'emergency_procedures', question: 'Fallback duplicate should lose', options: ['X', 'Y'], answer: [1] },
        { id: 'unique-2', section: 'emergency_procedures', question: 'Fallback unique question', options: ['C', 'D'], answer: [1] },
      ],
    }));
  }, { historyKey: HISTORY_KEY, fallbackKey: FALLBACK_KEY });

  await page.goto('/account');
  await expect(page.getByRole('heading', { name: 'My Page' })).toBeVisible({ timeout: 15000 });

  const wrongOnlyCard = page.locator('div.rounded-xl')
    .filter({ has: page.getByText('Practice wrong answers only', { exact: true }) })
    .filter({ has: page.getByText('Builds a set of questions you recently got wrong.', { exact: true }) });
  await expect(wrongOnlyCard).toBeVisible();
  await wrongOnlyCard.getByRole('button', { name: /^start$/i }).click();

  await expect(page).toHaveURL(/\/quiz\/all_wrong\/all$/);
  await expect(page.getByText('Question 1 / 2').first()).toBeVisible();
  await expect(page.getByText(/History question wins|Fallback unique question/)).toBeVisible();

  const overrideValue = await page.evaluate((key) => sessionStorage.getItem(key), OVERRIDE_KEY);
  expect(overrideValue).toBeNull();

  const resumeSnapshot = await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, RESUME_KEY);

  expect(resumeSnapshot?.items).toHaveLength(2);
  expect(resumeSnapshot?.items.map((item: { id: string }) => item.id).sort()).toEqual(['shared-1', 'unique-2']);
  expect(resumeSnapshot?.items.find((item: { id: string }) => item.id === 'shared-1')?.question).toBe('History question wins');
});