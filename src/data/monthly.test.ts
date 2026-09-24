import { expect, it } from 'vitest';
import { saladPlan, proteinMenu } from './monthly';
it('preserves the published monthly package without inventing missing rotation entries', () => {
  expect(saladPlan.price).toBe(260000);
  expect(saladPlan.originalPrice - saladPlan.discount).toBe(saladPlan.price);
  expect(saladPlan.bowls).toBe(20);
  expect(saladPlan.rotation.flatMap((w) => w.days)).toHaveLength(8);
  expect(saladPlan.rotation[0].days.map((d) => d.day)).toEqual([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Friday',
  ]);
  expect(saladPlan.rotation[1].days.map((d) => d.day)).toEqual([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
  ]);
});
it('imports exactly seven individually priced protein dishes', () => {
  expect(proteinMenu.map((i) => i.price)).toEqual([
    15000, 15000, 15500, 18000, 18500, 25000, 30000,
  ]);
  expect(new Set(proteinMenu.map((i) => i.id)).size).toBe(7);
  expect(proteinMenu.every((i) => i.available && i.sourceDocument === 'Monthly2.jpeg')).toBe(true);
});
