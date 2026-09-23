import { expect, it } from 'vitest';
import { validateCustomer, whatsappMessage, whatsappUrl } from './order';
import type { Customer, Order } from '../types';
const customer: Customer = {
  name: 'A Customer',
  phone: '9876543210',
  fulfilment: 'delivery',
  address: 'A Bangalore address',
  landmark: '',
  time: '2026-12-24T13:00',
  notes: '',
  areaConfirmed: true,
  payment: 'upi',
  transactionReference: 'REF123456',
  paid: true,
};
it('rejects QR checkout without a configured merchant QR', () => {
  expect(
    validateCustomer(customer, { upi: false, cash: false, pickup: false }).payment,
  ).toBeTruthy();
});
it('requires delivery address, area confirmation and a valid phone', () => {
  const errors = validateCustomer(
    { ...customer, address: '', phone: '123', areaConfirmed: false },
    { upi: true, cash: false, pickup: false },
  );
  expect(errors.address).toBeTruthy();
  expect(errors.phone).toBeTruthy();
  expect(errors.areaConfirmed).toBeTruthy();
});
it('requires payment acknowledgement and reference for UPI', () => {
  const errors = validateCustomer(
    { ...customer, paid: false, transactionReference: '' },
    { upi: true, cash: false, pickup: false },
  );
  expect(errors.paid).toBeTruthy();
  expect(errors.transactionReference).toBeTruthy();
});
it('does not leak customer or transaction data in WhatsApp URLs', () => {
  expect(whatsappUrl()).not.toContain('?');
  expect(whatsappUrl()).toMatch(/^https:\/\/wa.me\/\d+$/);
});
it('creates a complete request with manual verification wording', () => {
  const order: Order = {
    reference: 'SK-TEST',
    createdAt: '',
    customer,
    lines: [],
    subtotal: 30000,
    delivery: 0,
    total: 30000,
    status: 'Pending verification',
  };
  const msg = whatsappMessage(order);
  expect(msg).toContain('SK-TEST');
  expect(msg).toContain('REF123456');
  expect(msg).toContain('Pending verification');
  expect(msg).toContain('A Bangalore address');
  expect(msg).toContain('merchant confirmation');
});
