import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { menu } from './menu';
import { dishPhoto, photoCredits } from './photos';

describe('licensed menu imagery', () => {
  it('maps every catalogue tile to a locally hosted photo with attribution', () => {
    const missing = menu.filter((item) => !dishPhoto(item));
    expect(missing.map((item) => item.name)).toEqual([]);
    for (const item of menu) {
      const photo = dishPhoto(item)!;
      expect(existsSync(`public${photo.path}`)).toBe(true);
      expect(photo.source).toMatch(/^https:\/\/commons.wikimedia.org\/wiki\//);
      expect(photo.license).toMatch(/CC BY|CC0|Public domain/);
    }
  });
  it('keeps meat-specific rice dishes separate from vegetarian images', () => {
    expect(dishPhoto({ name: 'Chicken Fry Piece Biryani', category: 'Rice & Biryani' })).toBe(
      photoCredits['chicken-biryani'],
    );
    expect(dishPhoto({ name: 'Veg Biryani', category: 'Rice & Biryani' })).toBe(
      photoCredits['veg-biryani'],
    );
  });
  it('uses a dessert family photo for ambiguous sweet names', () => {
    expect(dishPhoto({ name: 'Cashaw Channa', category: 'Sweets' })).toBe(photoCredits.sweets);
    expect(dishPhoto({ name: 'Sweet Vada', category: 'Sweets' })).toBe(photoCredits.sweets);
  });
});
