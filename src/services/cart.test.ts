import { describe, it, expect } from 'vitest';
import { priceCart, restoreCart, lineKey } from './cart';
import type { MenuItem } from '../types';
const menu: MenuItem[] = [
  {
    id: 'test',
    name: 'Test fixture',
    category: 'Test',
    price: 10000,
    available: true,
    sourcePage: 1,
    options: [{ id: 'extra', name: 'Extra', price: 2500 }],
  },
  {
    id: 'sold',
    name: 'Sold fixture',
    category: 'Test',
    price: 3000,
    available: false,
    sourcePage: 1,
  },
];
describe('catalogue-priced cart', () => {
  it('uses integer paise and prices selected options from the catalogue', () => {
    const c = priceCart(
      [{ itemId: 'test', quantity: 3, optionIds: ['extra'], instructions: '' }],
      menu,
    );
    expect(c.subtotal).toBe(37500);
    expect(c.total).toBe(37500);
    expect(c.eligible).toBe(true);
  });
  it('enforces the minimum at the exact boundary', () => {
    expect(
      priceCart([{ itemId: 'test', quantity: 3, optionIds: [], instructions: '' }], menu).eligible,
    ).toBe(true);
    expect(
      priceCart([{ itemId: 'test', quantity: 2, optionIds: [], instructions: '' }], menu).eligible,
    ).toBe(false);
  });
  it('rejects unavailable, missing and malformed entries from storage', () => {
    expect(
      restoreCart(
        JSON.stringify([
          { itemId: 'sold', quantity: 1 },
          { itemId: 'missing', quantity: 1 },
          { itemId: 'test', quantity: -2 },
          { itemId: 'test', quantity: 1.5 },
          { itemId: 'test', quantity: 101 },
        ]),
        menu,
      ),
    ).toEqual([]);
    expect(restoreCart('{oops', menu)).toEqual([]);
    expect(restoreCart('{}', menu)).toEqual([]);
  });
  it('ignores forged prices and removes unknown options', () => {
    const c = restoreCart(
      JSON.stringify([
        {
          itemId: 'test',
          quantity: 3,
          price: 1,
          optionIds: ['extra', 'extra', 'forged'],
          instructions: ' hi ',
        },
      ]),
      menu,
    );
    expect(priceCart(c, menu).total).toBe(37500);
    expect(c[0].optionIds).toEqual(['extra']);
  });
  it('distinguishes customizations and cooking notes', () => {
    expect(lineKey({ itemId: 'test', optionIds: [], instructions: 'no onion' })).not.toBe(
      lineKey({ itemId: 'test', optionIds: [], instructions: '' }),
    );
  });
});
