import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('public home, persisted cart, approved QR and responsive accessibility', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Good food.*Great mood/ })).toBeVisible();
  await expect(page.locator('.fresh-food-image')).toHaveJSProperty('complete', true);
  await expect(page.locator('.header .brand-emblem')).toHaveJSProperty('naturalWidth', 256);
  await expect(page.locator('.menu-card .card-image img')).toHaveCount(4);
  const fonts = await page
    .locator('h1, .nav, .menu-card h3, .menu-card .price')
    .evaluateAll((nodes) => [...new Set(nodes.map((node) => getComputedStyle(node).fontFamily))]);
  expect(fonts).toHaveLength(1);
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator('.menu-card .card-image img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
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
  await expect(page.getByRole('button', { name: /Create order request/ })).toBeEnabled();
  await expect(page.getByText('Online payment is being set up.')).toHaveCount(0);
  await page.getByRole('radio', { name: /Pay using UPI QR/ }).check();
  const qr = page.getByAltText('Merchant-approved UPI QR code');
  await expect(qr).toBeVisible();
  await expect
    .poll(() => qr.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByRole('heading', { name: 'Pay exactly ₹300' })).toBeVisible();
  await expect(
    page.getByText(/Payment confirmation pending until the merchant verifies/),
  ).toBeVisible();
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

test('monthly plan preserves the rotation and protein dishes can be ordered', async ({ page }) => {
  const response = await page.goto('/monthly');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: /A fresh bowl/ })).toBeVisible();
  await expect(page.getByText('₹2,600', { exact: false }).first()).toBeVisible();
  await expect(page.locator('.schedule-dish')).toHaveCount(8);
  await expect(page.getByRole('link', { name: /Enquire about this plan/ })).toHaveAttribute(
    'href',
    'https://wa.me/918147988709',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(scan.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  const card = page.getByRole('article').filter({
    has: page.getByRole('heading', { name: 'Boiled Chicken & Boiled Eggs', exact: true }),
  });
  await card
    .getByRole('button', { name: 'Increase Boiled Chicken & Boiled Eggs quantity' })
    .click();
  await card.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await page.goto('/cart');
  await expect(page.getByRole('link', { name: /Continue to checkout/ })).toBeVisible();
  await expect(page.getByRole('main').getByText('₹300', { exact: true }).first()).toBeVisible();
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
