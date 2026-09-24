import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import type { MenuItem } from '../types';
import { money } from '../config';
import { useCart } from '../state/CartContext';
import { FoodPlaceholder, Modal, Quantity } from './Primitives';
export function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const addItem = () => {
    add({ itemId: item.id, quantity, optionIds: selected, instructions: note });
    setAdded(true);
    setOpen(false);
  };
  return (
    <article className="menu-card">
      <div className="card-image">
        <FoodPlaceholder category={item.category} />
        {item.dietary && (
          <span className={`diet ${item.dietary}`}>
            <span aria-hidden="true">●</span> {item.dietary === 'vegetarian' ? 'Veg' : 'Non-veg'}
          </span>
        )}
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{item.category}</span>
          {item.portion && <span>{item.portion}</span>}
        </div>
        <h3>{item.name}</h3>
        <p className="dish-description">
          {item.description || 'Freshly prepared after you place your order.'}
        </p>
        {item.vegan && <span className="badge">Vegan</span>}
        {item.spice && <span className="badge">{item.spice}</span>}
        {item.allergens && <p className="small">Allergens: {item.allergens}</p>}
        <div className="card-bottom">
          <strong className="price">
            {item.price === null ? 'Price to confirm' : money(item.price)}
          </strong>
          {item.available && item.price !== null ? (
            <Quantity
              value={quantity}
              onChange={(n) => {
                setQuantity(n);
                setAdded(false);
              }}
              label={item.name}
            />
          ) : (
            <span className="unavailable">Unavailable</span>
          )}
        </div>
        <div className="card-actions">
          <button
            className="button add-button"
            disabled={!item.available || item.price === null}
            onClick={addItem}
          >
            {added ? <Check size={16} /> : <Plus size={16} />} {added ? 'Add again' : 'Add to cart'}
          </button>
          {item.available && (
            <button className="text-button" onClick={() => setOpen(true)}>
              Customise
            </button>
          )}
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={`Customise ${item.name}`}>
        <p className="muted">Requests are subject to the kitchen’s confirmation.</p>
        {item.options?.map((o) => (
          <label className="check-label" key={o.id}>
            <input
              type="checkbox"
              checked={selected.includes(o.id)}
              onChange={(e) =>
                setSelected((prev) =>
                  e.target.checked ? [...prev, o.id] : prev.filter((id) => id !== o.id),
                )
              }
            />
            {o.name} (+{money(o.price)})
          </label>
        ))}
        <label className="field">
          Cooking instructions
          <textarea
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any preparation requests?"
          />
        </label>
        <p className="small">
          For allergies, speak to the kitchen before ordering. Ingredient and cross-contact
          information has not been provided.
        </p>
        <button className="button" onClick={addItem}>
          Add {quantity} to cart
        </button>
      </Modal>
    </article>
  );
}
