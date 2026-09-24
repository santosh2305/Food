import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../state/CartContext';
import { MenuCard } from '../components/MenuCard';
export default function MenuPage() {
  const { catalogue } = useCart();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [diet, setDiet] = useState('all');
  const categories = [...new Set(catalogue.map((i) => i.category))];
  const active = params.get('category') || 'All';
  const filters = [
    ...new Set(
      catalogue.flatMap((i) => [
        ...(i.dietary ? [i.dietary] : []),
        ...(i.vegan ? ['vegan'] : []),
        ...(i.spice ? [i.spice] : []),
      ]),
    ),
  ];
  const items = catalogue.filter(
    (i) =>
      (active === 'All' || i.category === active) &&
      (diet === 'all' || i.dietary === diet || (diet === 'vegan' && i.vegan) || i.spice === diet) &&
      `${i.name} ${i.description || ''} ${i.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  return (
    <div className="container page-space">
      <div className="page-heading">
        <p className="eyebrow">FRESH FROM OUR HOME KITCHEN</p>
        <h1>
          Made with care.
          <br />
          <em>Chosen by you.</em>
        </h1>
        <p>
          From a comforting breakfast to a proper Andhra meal.
          <br />
          Freshly prepared after your order. Please order in advance.
        </p>
      </div>
      <div className="menu-toolbar">
        <label className="search">
          <Search size={19} />
          <span className="sr-only">Search the menu</span>
          <input
            type="search"
            placeholder="What are you craving?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="filter">
          <SlidersHorizontal size={17} />
          <span className="sr-only">Dietary and spice filter</span>
          <select value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="all">All preferences</option>
            {filters.map((f) => (
              <option key={f} value={f}>
                {f === 'vegetarian' ? 'Vegetarian' : f === 'non-vegetarian' ? 'Non-vegetarian' : f}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="category-tabs" aria-label="Menu categories">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            className={active === c ? 'active' : ''}
            aria-pressed={active === c}
            onClick={() => setParams(c === 'All' ? {} : { category: c })}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="menu-results">
        <p>
          {items.length} dishes · {active === 'All' ? 'Something for every craving' : active}
        </p>
        <span>Minimum order ₹300 · Free delivery</span>
      </div>
      {items.length ? (
        <div className="menu-grid">
          {items.map((i) => (
            <MenuCard key={i.id} item={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={36} />
          <h2>No dishes found</h2>
          <p>Try another search or category.</p>
          <button
            className="button secondary"
            onClick={() => {
              setSearch('');
              setDiet('all');
              setParams({});
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      <div className="notice allergen-inline">
        <strong>A note about your food</strong>
        <p>
          Dietary labels appear only where supplied in our menu. For ingredients, allergies or
          cross-contact concerns, contact the kitchen before ordering. Photos show representative
          servings; actual portions and presentation vary. Availability is confirmed by the kitchen.
        </p>
      </div>
    </div>
  );
}
