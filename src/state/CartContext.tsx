import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { menu } from '../data/menu';
import { CART_KEY, lineKey, MAX_QUANTITY, priceCart, restoreCart } from '../services/cart';
import type { CartLine, MenuItem } from '../types';
type CartValue = ReturnType<typeof priceCart> & {
  add: (line: CartLine) => void;
  update: (key: string, quantity: number) => void;
  instructions: (key: string, note: string) => void;
  clear: () => void;
  storageWarning: boolean;
  notice: string;
  catalogue: MenuItem[];
};
const CartContext = createContext<CartValue | null>(null);
export function CartProvider({
  children,
  catalogue = menu,
}: {
  children: ReactNode;
  catalogue?: MenuItem[];
}) {
  const [storageWarning, setStorageWarning] = useState(false);
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      return restoreCart(localStorage.getItem(CART_KEY), catalogue);
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState('');
  // An external storage failure must be surfaced to the customer.
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Reflect an external storage failure in the UI.
      setStorageWarning(true);
    }
  }, [cart]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) setCart(restoreCart(e.newValue, catalogue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [catalogue]);
  const value: CartValue = {
    ...priceCart(cart, catalogue),
    catalogue,
    storageWarning,
    notice,
    add: (line) => {
      setCart((old) => restoreCart(JSON.stringify([...old, line]), catalogue));
      setNotice(
        `${catalogue.find((i) => i.id === line.itemId)?.name || 'Item'} added to your cart.`,
      );
    },
    update: (key, quantity) =>
      setCart((old) =>
        old.flatMap((l) =>
          lineKey(l) === key
            ? quantity > 0
              ? [{ ...l, quantity: Math.min(MAX_QUANTITY, quantity) }]
              : []
            : [l],
        ),
      ),
    instructions: (key, note) =>
      setCart((old) =>
        restoreCart(
          JSON.stringify(old.map((l) => (lineKey(l) === key ? { ...l, instructions: note } : l))),
          catalogue,
        ),
      ),
    clear: () => setCart([]),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartProvider is required');
  return context;
}
