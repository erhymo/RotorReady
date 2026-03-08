import { test, expect } from '@playwright/test';

const RESUME_KEY = 'quiz:resume:AW169:normal_procedures:20';

const SNAPSHOT = {
  section: 'normal_procedures',
  variantId: 'AW169',
  amount: '20',
  idx: 1,
  items: [
    { id: 'gen-resume-1', section: 'normal_procedures', type: 'single', question: 'Generic resume question 1', options: ['A', 'B'], answer: [0] },
    { id: 'gen-resume-2', section: 'normal_procedures', type: 'single', question: 'Generic resume question 2', options: ['C', 'D'], answer: [1] },
    { id: 'gen-resume-3', section: 'normal_procedures', type: 'single', question: 'Generic resume question 3', options: ['E', 'F'], answer: [0] },
  ],
  answers: [0, 1, null],
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

test('generic section resume continue opens the saved runtime session', async ({ page }) => {
  await seedResumeSnapshot(page);
  await page.goto('/quiz/normal_procedures');

  const resumeCard = page.locator('div.rounded-xl').filter({ hasText: 'Resume session' });
  await expect(resumeCard).toBeVisible();
  await expect(resumeCard).toContainText('You are on question 2 of 3');

  await Promise.all([
    page.waitForURL(/\/quiz\/normal_procedures\/20$/, { timeout: 15000 }),
    resumeCard.getByRole('button', { name: /^continue$/i }).click(),
  ]);

  await expect(page.getByText('Question 2 / 3').first()).toBeVisible();
  await expect(page.getByText('Generic resume question 2')).toBeVisible();
});

test('generic section start over clears the stored resume snapshot', async ({ page }) => {
  await seedResumeSnapshot(page);
  await page.goto('/quiz/normal_procedures');

  const resumeCard = page.locator('div.rounded-xl').filter({ hasText: 'Resume session' });
  await expect(resumeCard).toBeVisible();

  await resumeCard.getByRole('button', { name: /start over/i }).click();

  await expect(page.getByText('Resume session')).toHaveCount(0);

  const storedResume = await page.evaluate((key) => localStorage.getItem(key), RESUME_KEY);
  expect(storedResume).toBeNull();
});