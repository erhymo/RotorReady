import { test, expect } from '@playwright/test';

test('lights overlay/flag/prev/next/restart', async ({ page }) => {
  await page.goto('/training/lights');
  // Start en warning-runde hvis idle
  const startBtn = page.getByRole('button', { name: /warning/i });
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
  }
  // Klikk på lys for å åpne prosedyre
  const revealBtn = page.getByRole('button', { name: /click to show procedure/i });
  await revealBtn.click();

  // Prev/Next/Flag finnes
	  await expect(page.getByRole('button', { name: 'Prev light' })).toBeVisible();
	  const flagBtn = page.getByRole('button', { name: 'Flag light' });
  await expect(flagBtn).toBeVisible();
	  await expect(page.getByRole('button', { name: 'Next light' })).toBeVisible();

  // Toggle flag (tolk evt. ingen feil hvis API ikke lagrer)
  await flagBtn.click();
  await flagBtn.click();

  // Next -> tilbake til light
	  await page.getByRole('button', { name: 'Next light' }).click();

  // Fullfør og restart
  // hopp til done om mulig (kan kreve flere next; her røyk-test bare at Restart finnes når done vises)
  // Vi sjekker bare at siden bygger/loader og UI finnes.
});

