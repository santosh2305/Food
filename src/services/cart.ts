import { business } from '../config';
import type { CartLine, MenuItem, PricedLine } from '../types';
export const MAX_QUANTITY = 99;
export const CART_KEY = 'shanvis-cart-v1';
export function lineKey(line: Pick<CartLine, 'itemId' | 'optionIds' | 'instructions'>) {
  return JSON.stringify([line.itemId, [...line.optionIds].sort(), line.instructions.trim()]);
}
export function restoreCart(raw: string | null, catalogue: MenuItem[]): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [];
    const lines = new Map<string, CartLine>();
    for (const candidate of parsed.slice(0, 150)) {
      if (!candidate || typeof candidate !== 'object') continue;
      const { itemId, quantity, optionIds, instructions } = candidate;
      const item = catalogue.find((i) => i.id === itemId);
      if (
        !item?.available ||
        item.price === null ||
        !Number.isSafeInteger(item.price) ||
        item.price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY
      )
        continue;
      const allowed = new Set(item.options?.map((o) => o.id));
      const line: CartLine = {
        itemId,
        quantity,
        optionIds: Array.isArray(optionIds)
          ? [
              ...new Set(
                optionIds.filter(
                  (id: unknown): id is string => typeof id === 'string' && allowed.has(id),
                ),
              ),
            ]
          : [],
        instructions: typeof instructions === 'string' ? instructions.trim().slice(0, 300) : '',
      };
      const key = lineKey(line);
      const existing = lines.get(key);
      lines.set(key, {
        ...line,
        quantity: Math.min(MAX_QUANTITY, quantity + (existing?.quantity || 0)),
      });
    }
    return [...lines.values()];
  } catch {
    return [];
  }
}
export function priceCart(cart: CartLine[], catalogue: MenuItem[]) {
  const lines: PricedLine[] = restoreCart(JSON.stringify(cart), catalogue).map((line) => {
    const item = catalogue.find((i) => i.id === line.itemId)!;
    const options = (item.options || []).filter((o) => line.optionIds.includes(o.id));
    const unitPrice = item.price! + options.reduce((sum, o) => sum + o.price, 0);
    return {
      ...line,
      key: lineKey(line),
      item,
      unitPrice,
      total: unitPrice * line.quantity,
      optionNames: options.map((o) => o.name),
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  // Orders below the minimum cannot proceed; every eligible delivery is free.
  return {
    lines,
    subtotal,
    delivery: 0,
    total: subtotal,
    eligible: lines.length > 0 && subtotal >= business.minimum,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}
