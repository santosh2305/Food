import { expect, it } from 'vitest';
import { menu } from './menu';
it('has unique catalogue IDs and safe integer prices from the source menu', () => {
  expect(new Set(menu.map((i) => i.id)).size).toBe(menu.length);
  for (const item of menu) {
    expect(item.sourcePage).toBeGreaterThan(0);
    if (item.available) {
      expect(Number.isSafeInteger(item.price)).toBe(true);
      expect(item.price).toBeGreaterThan(0);
    }
  }
});
it('does not make missing-price dishes orderable or invent unsupported dietary facts', () => {
  for (const name of ['Fish Curry', 'Ghee Laddu']) {
    const item = menu.find((i) => i.name === name);
    expect(item?.price).toBeNull();
    expect(item?.available).toBe(false);
  }
  expect(menu.some((i) => i.vegan || i.spice || i.allergens)).toBe(false);
  expect(menu.find((i) => i.name === 'Cashaw Channa')?.price).toBe(20000);
  expect(menu.find((i) => i.name === 'Chicken Donne Biryani')?.price).toBe(19000);
});
