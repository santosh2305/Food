import type { MenuItem } from '../types';
export const saladPlan = {
  name: 'Monthly Salad Subscription',
  bowls: 20,
  originalPrice: 275000,
  discount: 15000,
  price: 260000,
  rotation: [
    {
      weeks: 'Weeks 1 & 3',
      days: [
        {
          day: 'Monday',
          name: 'Sprouts Power Bowl',
          dressing: 'Lemon Mint Dressing',
          price: 11500,
        },
        {
          day: 'Tuesday',
          name: 'Paneer Protein Bowl',
          dressing: 'Creamy Hung Curd & Herb',
          price: 20000,
        },
        {
          day: 'Wednesday',
          name: 'Chickpea Crunch Bowl',
          dressing: 'Roasted Cumin Lemon',
          price: 10000,
        },
        { day: 'Friday', name: 'Pasta Salad', dressing: 'Tangy Tomato Dressing', price: 15000 },
      ],
    },
    {
      weeks: 'Weeks 2 & 4',
      days: [
        {
          day: 'Monday',
          name: 'Moong Sprouts & Pomegranate Bowl',
          dressing: 'Pudina Yogurt Dressing',
          price: 10500,
        },
        {
          day: 'Tuesday',
          name: 'Grilled Paneer Tikka Bowl',
          dressing: 'Schezwan Dressing',
          price: 17000,
        },
        {
          day: 'Wednesday',
          name: 'Black Chana Chaat Bowl',
          dressing: 'Tamarind Date Dressing',
          price: 9000,
        },
        {
          day: 'Thursday',
          name: 'Kidney Bean & Corn Mexican Bowl',
          dressing: 'Chipotle Lime Dressing',
          price: 20500,
        },
      ],
    },
  ],
};
const proteinEntries: [string, string, number][] = [
  ['Chicken Tandoori & Boiled Eggs', 'With creamy protein dip.', 150],
  ['Boiled Chicken & Boiled Eggs', 'With dip.', 150],
  [
    'Peri Peri Chicken Tandoori & Boiled Eggs',
    'Chicken tandoori with peri peri masala, boiled eggs and dip.',
    155,
  ],
  ['Boneless Chicken Tandoori & Boiled Eggs', 'With dip.', 180],
  [
    'Peri Peri Boneless Chicken & Boiled Eggs',
    'Boneless chicken tandoori with peri peri masala, boiled eggs and dip.',
    185,
  ],
  ['Fish Fry & Boiled Eggs', 'With dip.', 250],
  ['Boneless Fish Fry & Eggs', 'Boneless fish fry and eggs.', 300],
];
export const proteinMenu: MenuItem[] = proteinEntries.map(([name, description, price], index) => ({
  id: `daily-protein-${index + 1}`,
  name,
  description,
  price: price * 100,
  category: 'Daily Protein',
  available: true,
  dietary: 'non-vegetarian',
  sourcePage: 1,
  sourceDocument: 'Monthly2.jpeg',
}));
