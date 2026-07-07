import { test, expect } from '@playwright/test';

test('flag feedback keeps text when typing f and F', async ({ page }) => {
  await page.goto('/limitations-quiz');

  await page.getByRole('button', { name: /^start quiz$/i }).first().click();

  const flagButton = page.getByRole('button', { name: /flag/i });
  await expect(flagButton).toBeVisible();
  await flagButton.click();

  const feedback = page.getByPlaceholder(/wrong answer, unclear wording/i);
  await expect(feedback).toBeVisible();

  await feedback.click();
  await feedback.type('Test fF');

  await expect(feedback).toHaveValue('Test fF');
  await expect(page.getByRole('button', { name: /^send$/i })).toBeVisible();
});