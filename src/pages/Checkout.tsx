import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Info, MapPin, QrCode } from 'lucide-react';
import { useCart } from '../state/CartContext';
import { useOrder } from '../state/OrderContext';
import { business, money } from '../config';
import { orderReference, validateCustomer, whatsappUrl } from '../services/order';
import type { Customer } from '../types';
const initial: Customer = {
  name: '',
  phone: '',
  fulfilment: 'delivery',
  address: '',
  landmark: '',
  time: '',
  notes: '',
  areaConfirmed: false,
  payment: '',
  transactionReference: '',
  paid: false,
};
export default function Checkout() {
  const cart = useCart();
  const { setOrder } = useOrder();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const [paidCart, setPaidCart] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const signature = JSON.stringify(cart.lines.map((l) => [l.key, l.quantity, l.unitPrice]));
  const paidValid = customer.paid && signature === paidCart;
  const enabled = {
    upi: !!business.qrPath && qrLoaded && !qrFailed,
    cash: business.cashEnabled,
    pickup: business.pickupEnabled,
  };
  const noPayments = !business.qrPath && !business.cashEnabled && !business.pickupEnabled;
  function update<K extends keyof Customer>(key: K, value: Customer[K]) {
    setCustomer((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'fulfilment' ? { payment: '', paid: false, transactionReference: '' } : {}),
    }));
  }
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const current = { ...customer, paid: paidValid };
    const next = validateCustomer(current, enabled);
    setErrors(next);
    if (Object.keys(next).length) {
      setTimeout(() => summary.current?.focus(), 0);
      return;
    }
    if (!cart.eligible) return;
    setSubmitting(true);
    setOrder({
      reference: orderReference(),
      createdAt: new Date().toISOString(),
      customer: {
        ...current,
        name: current.name.trim(),
        phone: current.phone.trim(),
        address: current.fulfilment === 'delivery' ? current.address.trim() : '',
        landmark: current.fulfilment === 'delivery' ? current.landmark.trim() : '',
        transactionReference: current.payment === 'upi' ? current.transactionReference.trim() : '',
      },
      lines: structuredClone(cart.lines),
      subtotal: cart.subtotal,
      delivery: cart.delivery,
      total: cart.total,
      status: current.payment === 'upi' ? 'Pending verification' : 'Payment due',
    });
    navigate('/confirmation');
  };
  function inputProps(key: keyof Customer) {
    return {
      id: key,
      'aria-invalid': !!errors[key],
      'aria-describedby': errors[key] ? `${key}-error` : undefined,
    };
  }
  const error = (key: keyof Customer) =>
    errors[key] ? (
      <span className="field-error" id={`${key}-error`}>
        {errors[key]}
      </span>
    ) : null;
  if (!cart.eligible)
    return (
      <div className="container page-space empty-state">
        <h1>Your meal comes first.</h1>
        <p>Add at least ₹300 of dishes before checking out.</p>
        <Link to="/menu" className="button">
          Explore the menu
        </Link>
      </div>
    );
  return (
    <div className="container page-space">
      <div className="page-heading">
        <p className="eyebrow">ONE STEP CLOSER TO HOMEMADE</p>
        <h1>
          Make yourself <em>at home.</em>
        </h1>
        <p>This is an order request. The kitchen will confirm your order and requested time.</p>
      </div>
      {noPayments && (
        <div className="notice payment-notice">
          <Info />
          <div>
            <strong>Online payment is being set up.</strong>
            <p>
              You can review your meal, but checkout is unavailable until the merchant QR or another
              payment method is enabled. Contact our kitchen to arrange your order.
            </p>
            <a className="text-link" href={whatsappUrl()} target="_blank" rel="noreferrer">
              Contact the kitchen <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
      <form onSubmit={submit} noValidate className="checkout-layout">
        {' '}
        <div className="checkout-form">
          {Object.keys(errors).length > 0 && (
            <div className="error-summary" role="alert" tabIndex={-1} ref={summary}>
              <strong>Please check the following:</strong>
              <ul>
                {Object.entries(errors).map(([key, msg]) => (
                  <li key={key}>
                    <a href={`#${key}`}>{msg}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <fieldset>
            <legend>
              <span>01</span> A little about you
            </legend>
            <div className="form-row">
              <label className="field" htmlFor="name">
                Your name
                <input
                  {...inputProps('name')}
                  autoComplete="name"
                  maxLength={80}
                  value={customer.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                />
                {error('name')}
              </label>
              <label className="field" htmlFor="phone">
                Mobile number
                <input
                  {...inputProps('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={15}
                  placeholder="10-digit mobile number"
                  value={customer.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  required
                />
                {error('phone')}
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>02</span> From our kitchen to you
            </legend>
            <div className="choice-row">
              {(['delivery', 'pickup'] as const).map((value) => (
                <label
                  className={`choice ${customer.fulfilment === value ? 'selected' : ''}`}
                  key={value}
                >
                  <input
                    type="radio"
                    name="fulfilment"
                    value={value}
                    checked={customer.fulfilment === value}
                    onChange={() => update('fulfilment', value)}
                  />
                  {value === 'delivery' ? 'Deliver to me' : 'I’ll pick it up'}
                </label>
              ))}
            </div>
            {customer.fulfilment === 'delivery' ? (
              <>
                <label className="field" htmlFor="address">
                  Delivery address
                  <textarea
                    {...inputProps('address')}
                    autoComplete="street-address"
                    maxLength={500}
                    placeholder="Flat / house number, street, area and PIN code"
                    value={customer.address}
                    onChange={(e) => update('address', e.target.value)}
                    required
                  />
                  {error('address')}
                </label>
                <label className="field" htmlFor="landmark">
                  Landmark <span className="muted">(optional)</span>
                  <input
                    {...inputProps('landmark')}
                    maxLength={150}
                    value={customer.landmark}
                    onChange={(e) => update('landmark', e.target.value)}
                  />
                  {error('landmark')}
                </label>
                <label className="check-label">
                  <input
                    {...inputProps('areaConfirmed')}
                    type="checkbox"
                    checked={customer.areaConfirmed}
                    onChange={(e) => update('areaConfirmed', e.target.checked)}
                  />
                  My delivery address is in Bangalore. I understand exact serviceability is
                  confirmed by the kitchen.
                </label>
                {error('areaConfirmed')}
              </>
            ) : (
              <p className="notice">
                <MapPin size={18} />
                {business.pickupAddress ||
                  'Please contact the kitchen for the pickup address before travelling.'}
              </p>
            )}
            <label className="field" htmlFor="time">
              Preferred {customer.fulfilment === 'delivery' ? 'delivery' : 'pickup'} date and time
              <input
                {...inputProps('time')}
                type="datetime-local"
                value={customer.time}
                onChange={(e) => update('time', e.target.value)}
                required
              />
              <small>
                All times are Bangalore time (IST). Please order in advance; timing is confirmed by
                the kitchen.
              </small>
              {error('time')}
            </label>
            <label className="field" htmlFor="notes">
              Order notes <span className="muted">(optional)</span>
              <textarea
                {...inputProps('notes')}
                maxLength={500}
                value={customer.notes}
                onChange={(e) => update('notes', e.target.value)}
              />
              {error('notes')}
            </label>
          </fieldset>
          <fieldset id="payment" aria-describedby={errors.payment ? 'payment-error' : undefined}>
            <legend>
              <span>03</span> Payment
            </legend>
            <p className="muted">
              Exact amount payable: <strong>{money(cart.total)}</strong>
            </p>
            <label className={`choice ${customer.payment === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                disabled={!business.qrPath || qrFailed}
                checked={customer.payment === 'upi'}
                onChange={() => update('payment', 'upi')}
              />
              <QrCode size={18} />
              Pay using UPI QR{' '}
              {!business.qrPath && <span className="small">· Not yet available</span>}
            </label>
            {business.cashEnabled && customer.fulfilment === 'delivery' && (
              <label className="choice">
                <input
                  type="radio"
                  name="payment"
                  checked={customer.payment === 'cash'}
                  onChange={() => update('payment', 'cash')}
                />
                Cash on delivery
              </label>
            )}
            {business.pickupEnabled && customer.fulfilment === 'pickup' && (
              <label className="choice">
                <input
                  type="radio"
                  name="payment"
                  checked={customer.payment === 'pickup'}
                  onChange={() => update('payment', 'pickup')}
                />
                Pay on pickup
              </label>
            )}
            {error('payment')}
            {business.qrPath && (
              <div className={customer.payment === 'upi' ? 'qr-payment' : 'hidden'}>
                {!qrLoaded && !qrFailed && <p role="status">Loading merchant QR…</p>}
                {qrFailed ? (
                  <p className="notice" role="alert">
                    The merchant QR could not load. Do not make a payment here. Contact the kitchen.
                  </p>
                ) : (
                  <img
                    className="payment-qr"
                    src={business.qrPath}
                    alt="Merchant-approved UPI QR code"
                    width="300"
                    height="300"
                    onLoad={() => setQrLoaded(true)}
                    onError={() => setQrFailed(true)}
                  />
                )}
                <h3>Pay exactly {money(cart.total)}</h3>
                <p>
                  Verify that the merchant name is <strong>{business.merchantName}</strong> in your
                  UPI app before paying.
                </p>
                <p className="small">
                  Never share your UPI PIN, OTP or banking credentials. A transaction reference does
                  not prove successful settlement.
                </p>
                <label className="field" htmlFor="transactionReference">
                  UPI transaction / reference number
                  <input
                    {...inputProps('transactionReference')}
                    maxLength={40}
                    autoComplete="off"
                    value={customer.transactionReference}
                    onChange={(e) => update('transactionReference', e.target.value)}
                  />
                  {error('transactionReference')}
                </label>
                <label className="check-label">
                  <input
                    {...inputProps('paid')}
                    type="checkbox"
                    checked={paidValid}
                    onChange={(e) => {
                      update('paid', e.target.checked);
                      setPaidCart(signature);
                    }}
                  />
                  I completed the payment of {money(cart.total)} to the merchant shown above.
                </label>
                {error('paid')}
                <p className="notice">
                  Payment confirmation pending until the merchant verifies the transaction. If your
                  cart changes after payment, contact the kitchen before paying again.
                </p>
              </div>
            )}
          </fieldset>
        </div>
        <aside className="order-totals checkout-summary">
          <p className="eyebrow">YOUR HOMEMADE MOMENT</p>
          <h2>Order summary</h2>
          {cart.lines.map((l) => (
            <div key={l.key}>
              <span>
                {l.quantity} × {l.item.name}
                {l.item.portion ? ` (${l.item.portion})` : ''}
              </span>
              <strong>{money(l.total)}</strong>
            </div>
          ))}
          <div>
            <span>Subtotal</span>
            <strong>{money(cart.subtotal)}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>Free</strong>
          </div>
          <div className="total">
            <span>Total</span>
            <strong>{money(cart.total)}</strong>
          </div>
          <p className="small">
            Review your details before creating the request. Nothing is sent automatically.
          </p>
          <button className="button full" type="submit" disabled={noPayments || submitting}>
            {submitting ? 'Preparing your request…' : 'Create order request'}{' '}
            <ArrowRight size={16} />
          </button>
          <Link to="/cart" className="text-link">
            Back to cart
          </Link>
          <p className="small">
            Your details stay in this tab until you choose to send them. Read our{' '}
            <Link to="/privacy">privacy notice</Link> and{' '}
            <Link to="/terms">terms & cancellation placeholder</Link>.
          </p>
        </aside>
      </form>
    </div>
  );
}
