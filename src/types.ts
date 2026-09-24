export type Dietary = 'vegetarian' | 'non-vegetarian';
export type Option = { id: string; name: string; price: number };
export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  description?: string;
  portion?: string;
  dietary?: Dietary;
  vegan?: boolean;
  spice?: 'mild' | 'medium' | 'spicy';
  available: boolean;
  options?: Option[];
  allergens?: string;
  image?: string;
  featured?: boolean;
  special?: boolean;
  sourcePage: number;
  sourceDocument?: string;
};
export type CartLine = {
  itemId: string;
  quantity: number;
  optionIds: string[];
  instructions: string;
};
export type PricedLine = CartLine & {
  key: string;
  item: MenuItem;
  unitPrice: number;
  total: number;
  optionNames: string[];
};
export type Fulfilment = 'delivery' | 'pickup';
export type PaymentMethod = 'upi' | 'cash' | 'pickup';
export type Customer = {
  name: string;
  phone: string;
  fulfilment: Fulfilment;
  address: string;
  landmark: string;
  time: string;
  notes: string;
  areaConfirmed: boolean;
  payment: PaymentMethod | '';
  transactionReference: string;
  paid: boolean;
};
export type Order = {
  reference: string;
  createdAt: string;
  customer: Customer;
  lines: PricedLine[];
  subtotal: number;
  delivery: number;
  total: number;
  status: 'Pending verification' | 'Payment due';
};
