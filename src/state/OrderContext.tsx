import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Order } from '../types';
const Context = createContext<{
  order: Order | null;
  setOrder: (order: Order | null) => void;
} | null>(null);
// Customer details, address and transaction reference are intentionally memory-only.
export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null);
  return <Context.Provider value={{ order, setOrder }}>{children}</Context.Provider>;
}
export function useOrder() {
  const value = useContext(Context);
  if (!value) throw new Error('OrderProvider is required');
  return value;
}
