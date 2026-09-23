import { business, money } from '../config';
import type { Customer, Order } from '../types';
export type PaymentAvailability = { upi: boolean; cash: boolean; pickup: boolean };
export function validateCustomer(
  c: Customer,
  enabled: PaymentAvailability,
): Partial<Record<keyof Customer, string>> {
  const e: Partial<Record<keyof Customer, string>> = {};
  if (c.name.trim().length < 2 || c.name.length > 80) e.name = 'Enter your name (2–80 characters).';
  if (!/^(?:\+91[ -]?)?[6-9]\d{9}$/.test(c.phone.trim()))
    e.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (c.fulfilment === 'delivery') {
    if (c.address.trim().length < 10 || c.address.length > 500)
      e.address = 'Enter a complete delivery address (10–500 characters).';
    if (!c.areaConfirmed) e.areaConfirmed = 'Confirm that the delivery address is in Bangalore.';
  }
  const requestedTime = Date.parse(`${c.time}+05:30`);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(c.time) ||
    !Number.isFinite(requestedTime) ||
    requestedTime <= Date.now()
  )
    e.time = 'Choose a future date and time. The kitchen will confirm availability.';
  if (c.notes.length > 500) e.notes = 'Keep order notes under 500 characters.';
  if (c.landmark.length > 150) e.landmark = 'Keep the landmark under 150 characters.';
  if (
    !c.payment ||
    !enabled[c.payment] ||
    (c.payment === 'cash' && c.fulfilment !== 'delivery') ||
    (c.payment === 'pickup' && c.fulfilment !== 'pickup')
  )
    e.payment = 'Choose an available payment method.';
  if (c.payment === 'upi') {
    if (!/^[a-zA-Z0-9-]{6,40}$/.test(c.transactionReference.trim()))
      e.transactionReference =
        'Enter the transaction reference (6–40 letters or digits). Do not enter a PIN.';
    if (!c.paid) e.paid = 'Confirm that you completed the payment.';
  }
  return e;
}
export function orderReference() {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .replace(/-/g, '');
  return `SK-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
export const whatsappUrl = () => `https://wa.me/${business.whatsapp}`;
export function whatsappMessage(order: Order) {
  const c = order.customer;
  return [
    `Shanvis kitchen · Order request ${order.reference}`,
    ...order.lines.map(
      (line) =>
        `${line.quantity} × ${line.item.name}${line.item.portion ? ` (${line.item.portion})` : ''}${line.optionNames.length ? ` [${line.optionNames.join(', ')}]` : ''} — ${money(line.total)}${line.instructions ? `\nCooking notes: ${line.instructions}` : ''}`,
    ),
    `Subtotal: ${money(order.subtotal)}`,
    `Delivery: ${money(order.delivery)}`,
    `Total: ${money(order.total)}`,
    `Customer: ${c.name}`,
    `Mobile: ${c.phone}`,
    `Fulfilment: ${c.fulfilment}`,
    c.fulfilment === 'delivery'
      ? `Address: ${c.address}${c.landmark ? `\nLandmark: ${c.landmark}` : ''}`
      : `Pickup location: ${business.pickupAddress || 'To be confirmed by the kitchen'}`,
    `Requested time (Bangalore / IST): ${c.time.replace('T', ' ')}`,
    `Payment: ${c.payment === 'upi' ? 'UPI QR' : c.payment === 'cash' ? 'Cash on delivery' : 'Pay on pickup'}`,
    `Payment status: ${order.status}`,
    c.payment === 'upi' ? `Transaction reference: ${c.transactionReference}` : '',
    c.notes ? `Order notes: ${c.notes}` : '',
    'Subject to merchant confirmation. This message is an order request, not an accepted order.',
  ]
    .filter(Boolean)
    .join('\n');
}
