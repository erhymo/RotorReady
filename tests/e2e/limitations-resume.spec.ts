import { test, expect } from '@playwright/test';

const RESUME_KEY = 'quiz:resume:AW169:limitations:20';

const SNAPSHOT = {
  section: 'limitations',
  variantId: 'AW169',
  amount: '20',
  idx: 1,
  items: [
    { id: 'lim-resume-1', section: 'limitations', type: 'single', question: 'Question 1', options: ['A', 'B'], answer: [0] },
    { id: 'lim-resume-2', section: 'limitations', type: 'single', question: 'Question 2', options: ['A', 'B'], answer: [1] },
    { id: 'lim-resume-3', section: 'limitations', type: 'single', question: 'Question 3', options: ['A', 'B'], answer: [0] },
  ],
  answers: [null, 1, null],
  flags: [false, true, false],
  startedAt: 1704067200000,
  updatedAt: 1704067201000,
};

async function seedResumeSnapshot(page: import('@playwright/test').Page) {
  await page.addInitScript(({ key, snapshot }) => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem(key, JSON.stringify(snapshot));
  }, { key: RESUME_KEY, snapshot: SNAPSHOT });
}

test('limitations resume continue rebuilds session and opens the saved question', async ({ page }) => {
  await seedResumeSnapshot(page);
  await page.goto('/limitations-quiz');

  const resumeCard = page.locator('div.rounded-xl').filter({ hasText: 'Resume session' });
  await expect(resumeCard).toBeVisible();
  await expect(resumeCard).toContainText('You are on question 2 of 3');

  await expect(async () => {
    await resumeCard.getByRole('button', { name: /^continue$/i }).click();
    await expect(page).toHaveURL(/\/limitations-quiz\/2$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });

  const session = await page.evaluate(() => JSON.parse(sessionStorage.getItem('limq_session') || 'null'));
  expect(session?.section).toBe('limitations');
  expect(session?.amountToken).toBe('20');
  expect(session?.items).toHaveLength(3);
  expect(session?.answers).toEqual([null, 1, null]);
  expect(session?.flags).toEqual([false, true, false]);
});

test('limitations start over clears the stored resume snapshot', async ({ page }) => {
  await seedResumeSnapshot(page);
  await page.goto('/limitations-quiz');

  const resumeCard = page.locator('div.rounded-xl').filter({ hasText: 'Resume session' });
  await expect(resumeCard).toBeVisible();

  await resumeCard.getByRole('button', { name: /start over/i }).click();

  await expect(page.getByText('Resume session')).toHaveCount(0);

  const storedResume = await page.evaluate((key) => localStorage.getItem(key), RESUME_KEY);
  expect(storedResume).toBeNull();
});