import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('home, menu, persisted cart, missing payment and responsive accessibility', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /A taste of Andhra/ })).toBeVisible();
  await expect(page.locator('.hero-art img')).toHaveJSProperty('complete', true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, reason: n.failureSummary })),
    })),
  ).toEqual([]);
  await page.screenshot({ path: `artifacts/home-${info.project.name}.png`, fullPage: true });
  await page.getByRole('link', { name: 'Explore menu', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search the menu' }).fill('Idli');
  const card = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'Idli', exact: true }) });
  await card.getByRole('button', { name: 'Add to cart', exact: true }).click();
  for (let i = 0; i < 5; i++)
    await card.getByRole('button', { name: 'Add again', exact: true }).click();
  await page.goto('/cart');
  await expect(page.getByRole('link', { name: /Continue to checkout/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('main').getByLabel('Idli quantity', { exact: true })).toHaveText('6');
  await page.getByRole('link', { name: /Continue to checkout/ }).click();
  await expect(page.getByRole('button', { name: /Create order request/ })).toBeDisabled();
  await expect(page.getByText('Online payment is being set up.')).toBeVisible();
  const checkoutScan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    checkoutScan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, reason: n.failureSummary })),
    })),
  ).toEqual([]);
  await page.goto('/not-a-page');
  await expect(page.getByRole('heading', { name: 'A little lost?' })).toBeVisible();
  expect(errors).toEqual([]);
});
test('customization, mobile cart dialog and clear-cart confirmation', async ({ page }) => {
  await page.goto('/menu?category=Meals');
  const card = page
    .getByRole('article')
    .filter({ hasText: 'Full' })
    .filter({ has: page.getByRole('heading', { name: 'Veg Meal', exact: true }) });
  await card.getByRole('button', { name: 'Customise' }).click();
  const dialog = page.getByRole('dialog', { name: 'Customise Veg Meal' });
  await dialog.getByLabel('Cooking instructions').fill('Please pack separately');
  await dialog.getByRole('button', { name: 'Add 1 to cart' }).click();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  const cart = page.getByRole('dialog', { name: 'Your cart', exact: true });
  await expect(cart.getByLabel('Cooking instructions')).toHaveValue('Please pack separately');
  await cart.getByRole('button', { name: 'Clear cart', exact: true }).click();
  const confirm = page.getByRole('dialog', { name: 'Clear your cart?' });
  await confirm.getByRole('button', { name: 'Keep my cart' }).click();
  await expect(cart.getByRole('heading', { name: 'Veg Meal' })).toBeVisible();
  await cart.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await confirm.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await expect(cart.getByText('A little hungry?')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(cart).not.toBeVisible();
});
