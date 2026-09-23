import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../state/CartContext';
import { business, money } from '../config';
import { FoodPlaceholder, Modal, Quantity } from './Primitives';
export function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const cart = useCart();
  const [confirm, setConfirm] = useState(false);
  if (!cart.lines.length)
    return (
      <div className="empty-state">
        <ShoppingBag size={46} strokeWidth={1} />
        <h2>A little hungry?</h2>
        <p>Your next homemade meal is waiting. Add something lovely from the menu.</p>
        <Link to="/menu" className="button" onClick={onNavigate}>
          Explore the menu <ArrowRight size={16} />
        </Link>
      </div>
    );
  return (
    <>
      <div className="cart-layout">
        <div>
          {cart.storageWarning && (
            <p role="status" className="notice">
              Your browser cannot save this cart. Keep this page open while ordering.
            </p>
          )}
          {cart.lines.map((line) => (
            <article className="cart-line" key={line.key}>
              <FoodPlaceholder category={line.item.category} compact />
              <div className="cart-line-details">
                <h3>{line.item.name}</h3>
                <p className="small">
                  {line.item.portion} · {money(line.unitPrice)} each
                </p>
                {line.optionNames.length > 0 && (
                  <p className="small">{line.optionNames.join(', ')}</p>
                )}
                <div className="flex items-center gap-3">
                  <Quantity
                    label={line.item.name}
                    value={line.quantity}
                    onChange={(n) => cart.update(line.key, n)}
                  />
                  <button
                    className="icon-button"
                    aria-label={`Remove ${line.item.name}`}
                    onClick={() => cart.update(line.key, 0)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                <label className="small note-label">
                  Cooking instructions
                  <input
                    key={line.key}
                    maxLength={300}
                    defaultValue={line.instructions}
                    onBlur={(e) => cart.instructions(line.key, e.target.value)}
                    placeholder="Optional preparation request"
                  />
                </label>
              </div>
              <strong>{money(line.total)}</strong>
            </article>
          ))}
          <button className="text-button danger" onClick={() => setConfirm(true)}>
            Clear cart
          </button>
        </div>
        <aside className="order-totals">
          <p className="eyebrow">Made for you</p>
          <h2>Your order</h2>
          <div>
            <span>Subtotal</span>
            <strong>{money(cart.subtotal)}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>Free</strong>
          </div>
          <p className="small">Free delivery across Bangalore on orders of ₹300 and above.</p>
          <label className="field">
            Discount code
            <input disabled placeholder="No offers configured" />
          </label>
          <div className="total">
            <span>Total</span>
            <strong>{money(cart.total)}</strong>
          </div>
          {!cart.eligible && (
            <p className="notice">
              Add {money(business.minimum - cart.subtotal)} more to meet the ₹300 minimum.
            </p>
          )}
          {cart.eligible ? (
            <Link className="button full" to="/checkout" onClick={onNavigate}>
              Continue to checkout <ArrowRight size={16} />
            </Link>
          ) : (
            <button className="button full" disabled>
              Minimum order ₹300
            </button>
          )}
          <p className="small">
            Made to order. Timing and availability are confirmed by our kitchen.
          </p>
        </aside>
      </div>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Clear your cart?">
        <p>This removes all items and cooking instructions.</p>
        <div className="flex gap-3">
          <button className="button secondary" onClick={() => setConfirm(false)}>
            Keep my cart
          </button>
          <button
            className="button"
            onClick={() => {
              cart.clear();
              setConfirm(false);
            }}
          >
            Clear cart
          </button>
        </div>
      </Modal>
    </>
  );
}
