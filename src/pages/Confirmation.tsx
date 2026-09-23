import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Printer, MessageCircle } from 'lucide-react';
import { useOrder } from '../state/OrderContext';
import { money } from '../config';
import { whatsappMessage, whatsappUrl } from '../services/order';
export default function Confirmation() {
  const { order, setOrder } = useOrder();
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!order)
    return (
      <div className="container page-space empty-state">
        <h1>No order request in this tab.</h1>
        <p>
          For your privacy, customer and payment details are not saved after a refresh. Your cart is
          still available.
        </p>
        <Link className="button" to="/cart">
          Return to your cart
        </Link>
      </div>
    );
  const text = whatsappMessage(order);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  return (
    <div className="container page-space confirmation">
      <p className="eyebrow">READY TO SHARE WITH OUR KITCHEN</p>
      <h1>
        Your request is <em>ready.</em>
      </h1>
      <p className="lead">It hasn’t been sent or accepted yet.</p>
      <div className="notice">
        {order.customer.payment === 'upi'
          ? 'Payment confirmation pending. The merchant must verify your transaction.'
          : 'Payment is due using your selected method.'}{' '}
        Your order and requested time are subject to merchant confirmation.
      </div>
      <div className="confirmation-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ORDER REFERENCE</p>
            <h2>{order.reference}</h2>
          </div>
          <span className="badge">{order.status}</span>
        </div>
        {order.lines.map((l) => (
          <div className="confirmation-line" key={l.key}>
            <div>
              <strong>
                {l.quantity} × {l.item.name}
              </strong>
              <p className="small">
                {l.item.portion}
                {l.optionNames.length ? ` · ${l.optionNames.join(', ')}` : ''}
              </p>
              {l.instructions && <p className="small">Cooking notes: {l.instructions}</p>}
            </div>
            <strong>{money(l.total)}</strong>
          </div>
        ))}
        <div className="confirmation-line">
          <span>Subtotal</span>
          <strong>{money(order.subtotal)}</strong>
        </div>
        <div className="confirmation-line">
          <span>Delivery</span>
          <strong>{money(order.delivery)}</strong>
        </div>
        <div className="confirmation-line total">
          <span>Total</span>
          <strong>{money(order.total)}</strong>
        </div>
        <dl className="customer-details">
          <dt>Customer</dt>
          <dd>
            {order.customer.name} · {order.customer.phone}
          </dd>
          <dt>Fulfilment</dt>
          <dd>{order.customer.fulfilment}</dd>
          {order.customer.fulfilment === 'delivery' && (
            <>
              <dt>Address</dt>
              <dd>
                {order.customer.address}
                {order.customer.landmark && ` · ${order.customer.landmark}`}
              </dd>
            </>
          )}
          <dt>Requested time</dt>
          <dd>{order.customer.time.replace('T', ' ')} (IST)</dd>
          <dt>Payment</dt>
          <dd>
            {order.customer.payment === 'upi'
              ? 'UPI QR'
              : order.customer.payment === 'cash'
                ? 'Cash on delivery'
                : 'Pay on pickup'}{' '}
            · {order.status}
          </dd>
          {order.customer.payment === 'upi' && (
            <>
              <dt>Transaction reference</dt>
              <dd>{order.customer.transactionReference}</dd>
            </>
          )}
          {order.customer.notes && (
            <>
              <dt>Notes</dt>
              <dd>{order.customer.notes}</dd>
            </>
          )}
        </dl>
      </div>
      <section className="send-order no-print">
        <h2>Send your request on WhatsApp</h2>
        <p>
          Copy the message, open WhatsApp, then paste and send it to our kitchen. This keeps your
          address and payment reference out of web links.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="button" onClick={copy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}{' '}
            {copied ? 'Message copied' : '1. Copy order message'}
          </button>
          <a className="button secondary" href={whatsappUrl()} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            2. Send order on WhatsApp
          </a>
          <button className="button secondary" onClick={() => window.print()}>
            <Printer size={18} />
            Print order request
          </button>
        </div>
        <p role="status">
          {copied
            ? 'Copied. Paste the message into WhatsApp and send it.'
            : failed
              ? 'Clipboard unavailable. Select and copy the message below manually.'
              : ''}
        </p>
        <details open={failed}>
          <summary>Review or manually copy your message</summary>
          <textarea
            className="message-preview"
            aria-label="WhatsApp order message"
            readOnly
            value={text}
            onFocus={(e) => e.target.select()}
          />
        </details>
        <p className="small">
          This page is kept only in memory. Print or send your request before closing or refreshing
          this tab.
        </p>
        <Link to="/menu" className="text-link" onClick={() => setOrder(null)}>
          Finish and remove personal details from this tab
        </Link>
      </section>
    </div>
  );
}
