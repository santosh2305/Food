import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { it, expect } from 'vitest';
import { MenuCard } from './MenuCard';
import { CartContents } from './CartContents';
import { CartProvider, useCart } from '../state/CartContext';
import { OrderProvider } from '../state/OrderContext';
import Checkout from '../pages/Checkout';
import Confirmation from '../pages/Confirmation';
import { business } from '../config';
import { CART_KEY } from '../services/cart';
import type { MenuItem } from '../types';
const item: MenuItem = {
  id: 'fixture',
  name: 'Fixture meal',
  category: 'Meals',
  price: 15000,
  available: true,
  sourcePage: 1,
};
function Count() {
  const cart = useCart();
  return <output aria-label="Cart count">{cart.count}</output>;
}
it('adds selected quantities and persists a cart without a stored price', async () => {
  const user = userEvent.setup();
  render(
    <CartProvider catalogue={[item]}>
      <MenuCard item={item} />
      <Count />
    </CartProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Increase Fixture meal quantity' }));
  await user.click(screen.getByRole('button', { name: 'Add to cart' }));
  expect(screen.getByLabelText('Cart count')).toHaveTextContent('2');
  await waitFor(() => expect(JSON.parse(localStorage.getItem(CART_KEY)!)[0].quantity).toBe(2));
  expect(localStorage.getItem(CART_KEY)).not.toContain('15000');
});
it('removes an item and returns to the empty-cart state', async () => {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify([{ itemId: item.id, quantity: 2, optionIds: [], instructions: '' }]),
  );
  render(
    <MemoryRouter>
      <CartProvider catalogue={[item]}>
        <CartContents />
      </CartProvider>
    </MemoryRouter>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Remove Fixture meal' }));
  expect(screen.getByText('A little hungry?')).toBeInTheDocument();
});
it('disables checkout when the approved payment configuration is missing', () => {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify([{ itemId: item.id, quantity: 2, optionIds: [], instructions: '' }]),
  );
  render(
    <MemoryRouter>
      <CartProvider catalogue={[item]}>
        <OrderProvider>
          <Checkout />
        </OrderProvider>
      </CartProvider>
    </MemoryRouter>,
  );
  expect(screen.getByRole('button', { name: /Create order request/ })).toBeDisabled();
  expect(screen.getByText('Online payment is being set up.')).toBeInTheDocument();
});
it('creates an explicitly unaccepted order request with enabled cash payment and no persistent personal data', async () => {
  const original = business.cashEnabled;
  business.cashEnabled = true;
  try {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify([{ itemId: item.id, quantity: 2, optionIds: [], instructions: '' }]),
    );
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <CartProvider catalogue={[item]}>
          <OrderProvider>
            <Routes>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText('Your name'), 'Test Customer');
    await user.type(screen.getByLabelText('Mobile number'), '9876543210');
    await user.type(screen.getByLabelText('Delivery address'), '123 Test Road, Bangalore 560001');
    await user.click(screen.getByRole('checkbox', { name: /My delivery address/ }));
    fireEvent.change(screen.getByLabelText(/Preferred delivery date and time/), {
      target: { value: '2099-12-24T13:00' },
    });
    await user.click(screen.getByLabelText('Cash on delivery'));
    await user.click(screen.getByRole('button', { name: /Create order request/ }));
    expect(await screen.findByText('It hasn’t been sent or accepted yet.')).toBeInTheDocument();
    expect(
      (screen.getByLabelText('WhatsApp order message') as HTMLTextAreaElement).value,
    ).toContain('Test Customer');
    expect(screen.getByRole('link', { name: /Send order on WhatsApp/ })).toHaveAttribute(
      'href',
      'https://wa.me/918147988709',
    );
    expect(localStorage.getItem(CART_KEY)).not.toContain('Test Customer');
  } finally {
    business.cashEnabled = original;
  }
});

function TestCartChange() {
  const cart = useCart();
  return <button onClick={() => cart.update(cart.lines[0].key, 3)}>Change test cart</button>;
}
function renderQrCheckout() {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify([{ itemId: item.id, quantity: 2, optionIds: [], instructions: '' }]),
  );
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <CartProvider catalogue={[item]}>
        <OrderProvider>
          <Routes>
            <Route
              path="/checkout"
              element={
                <>
                  <TestCartChange />
                  <Checkout />
                </>
              }
            />
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </OrderProvider>
      </CartProvider>
    </MemoryRouter>,
  );
}
async function fillCustomer() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Your name'), 'Test Customer');
  await user.type(screen.getByLabelText('Mobile number'), '9876543210');
  await user.type(screen.getByLabelText('Delivery address'), '123 Test Road, Bangalore 560001');
  await user.click(screen.getByRole('checkbox', { name: /My delivery address/ }));
  fireEvent.change(screen.getByLabelText(/Preferred delivery date and time/), {
    target: { value: '2099-12-24T13:00' },
  });
  return user;
}
it('rejects a configured QR whose image fails to load', async () => {
  const original = business.qrPath;
  business.qrPath = '/assets/payments/test-fixture.png';
  try {
    renderQrCheckout();
    const user = await fillCustomer();
    await user.click(screen.getByLabelText(/Pay using UPI QR/));
    fireEvent.error(screen.getByAltText('Merchant-approved UPI QR code'));
    await user.click(screen.getByRole('button', { name: /Create order request/ }));
    expect(
      screen.getByRole('link', { name: 'Choose an available payment method.' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Your request is ready.')).not.toBeInTheDocument();
  } finally {
    business.qrPath = original;
  }
});
it('requires a new payment acknowledgement after the cart changes', async () => {
  const original = business.qrPath;
  business.qrPath = '/assets/payments/test-fixture.png';
  try {
    renderQrCheckout();
    const user = await fillCustomer();
    await user.click(screen.getByLabelText(/Pay using UPI QR/));
    fireEvent.load(screen.getByAltText('Merchant-approved UPI QR code'));
    await user.type(screen.getByLabelText('UPI transaction / reference number'), 'TESTREF123');
    await user.click(screen.getByRole('checkbox', { name: /I completed the payment/ }));
    expect(screen.getByRole('checkbox', { name: /I completed the payment/ })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Change test cart' }));
    expect(screen.getByRole('checkbox', { name: /I completed the payment/ })).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: /Create order request/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Confirm that you completed the payment.');
  } finally {
    business.qrPath = original;
  }
});
it('creates only a pending-verification request after QR load and customer acknowledgement', async () => {
  const original = business.qrPath;
  business.qrPath = '/assets/payments/test-fixture.png';
  try {
    renderQrCheckout();
    const user = await fillCustomer();
    await user.click(screen.getByLabelText(/Pay using UPI QR/));
    fireEvent.load(screen.getByAltText('Merchant-approved UPI QR code'));
    await user.type(screen.getByLabelText('UPI transaction / reference number'), 'TESTREF123');
    await user.click(screen.getByRole('checkbox', { name: /I completed the payment/ }));
    await user.click(screen.getByRole('button', { name: /Create order request/ }));
    expect(await screen.findByText('It hasn’t been sent or accepted yet.')).toBeInTheDocument();
    expect(
      (screen.getByLabelText('WhatsApp order message') as HTMLTextAreaElement).value,
    ).toContain('Pending verification');
    expect(localStorage.getItem(CART_KEY)).not.toContain('TESTREF123');
  } finally {
    business.qrPath = original;
  }
});
