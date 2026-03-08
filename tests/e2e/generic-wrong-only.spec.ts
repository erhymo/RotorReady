import { test, expect } from '@playwright/test';

const WRONG_SET_KEY = 'rr_progress_last_wrong:AW169:normal_procedures';
const OVERRIDE_KEY = 'quiz_session_override:AW169:normal_procedures';

const WRONG_SET = {
  section: 'normal_procedures',
  createdAt: '2024-01-01T00:00:00.000Z',
  items: [
    {
      id: 'np-wrong-1',
      section: 'normal_procedures',
      type: 'single',
      question: 'Seeded wrong-only question 1?',
      options: ['Alpha', 'Bravo'],
      answer: [1],
    },
    {
      id: 'np-wrong-2',
      section: 'normal_procedures',
      type: 'single',
      question: 'Seeded wrong-only question 2?',
      options: ['Charlie', 'Delta'],
      answer: [0],
    },
  ],
};

test('generic wrong-only uses saved wrong-set and clears override session after load', async ({ page }) => {
  await page.addInitScript(({ key, wrongSet }) => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem(key, JSON.stringify(wrongSet));
  }, { key: WRONG_SET_KEY, wrongSet: WRONG_SET });

  await page.goto('/quiz/normal_procedures');

  const wrongOnlyCard = page.locator('div.rounded-xl').filter({ hasText: 'Practice wrong answers only' });
  await expect(wrongOnlyCard).toBeVisible();
  await wrongOnlyCard.getByRole('button', { name: /^start$/i }).click();

  await expect(page).toHaveURL(/\/quiz\/normal_procedures\/all$/);
  await expect(page.getByText(/Seeded wrong-only question [12]\?/)).toBeVisible();
  await expect(page.getByText('Question 1 / 2').first()).toBeVisible();

  const overrideValue = await page.evaluate((key) => sessionStorage.getItem(key), OVERRIDE_KEY);
  expect(overrideValue).toBeNull();

  const resumeSnapshot = await page.evaluate(() => {
    const raw = localStorage.getItem('quiz:resume:AW169:normal_procedures:all');
    return raw ? JSON.parse(raw) : null;
  });

  expect(resumeSnapshot?.items).toHaveLength(2);
  expect(resumeSnapshot?.items.map((item: { id: string }) => item.id).sort()).toEqual(['np-wrong-1', 'np-wrong-2']);
});