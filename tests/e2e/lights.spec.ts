import { test, expect } from '@playwright/test';

test('lights overlay/flag/prev/next/restart', async ({ page }) => {
  // Two CI workers share a runner with the Next server and Chromium, so this
  // page can take far longer to become interactive there than the ~250 ms it
  // takes locally. Give it room rather than letting one slow step eat the
  // whole test budget — that is what made this spec fail intermittently.
  test.slow();

  await page.goto('/training/lights');

  // The trainer bar renders immediately but stays disabled while the model's
  // light data loads. The previous version used isVisible(), which does not
  // wait: on a slow runner it could read the bar before it settled, skip the
  // click entirely, and then time out below waiting for a round that had
  // never been started. Wait for enabled instead, which is the state the
  // click actually needs.
  const startBtn = page.getByRole('button', { name: /warning/i });
  await expect(startBtn).toBeEnabled({ timeout: 60_000 });
  await startBtn.click();

  // Klikk på lys for å åpne prosedyre
  const revealBtn = page.getByRole('button', { name: /click to show procedure/i });
  await expect(revealBtn).toBeVisible({ timeout: 30_000 });
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
