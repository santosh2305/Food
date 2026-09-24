import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, MapPin, Menu, ShoppingBag, X } from 'lucide-react';
import { business, money } from '../config';
import { useCart } from '../state/CartContext';
import { whatsappUrl } from '../services/order';
import { CartContents } from './CartContents';
import { Modal } from './Primitives';
export function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      document.getElementById('main')?.focus();
    }
  }, [location.pathname, location.hash]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        <span>
          <MapPin size={13} /> Homemade happiness, across Bangalore
        </span>
        <span>
          Free delivery on orders ₹300+ <span aria-hidden="true">✦</span> Made fresh, just for you
        </span>
      </div>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Shanvis kitchen home">
            <img
              className="brand-emblem"
              src="/assets/shanvis-emblem.webp"
              alt=""
              width="64"
              height="64"
            />
            <span>
              <strong>
                Shanvis <em>kitchen</em>
              </strong>
              <small>HOME MADE. HEART FELT.</small>
            </span>
          </Link>
          <nav className={`nav ${navOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            <NavLink to="/" end onClick={() => setNavOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/menu" onClick={() => setNavOpen(false)}>
              Our menu
            </NavLink>
            <NavLink to="/monthly" onClick={() => setNavOpen(false)}>
              Monthly plans
            </NavLink>
            <Link to="/#contact" onClick={() => setNavOpen(false)}>
              Contact
            </Link>
          </nav>
          <div className="header-actions">
            <a className="header-contact" href={whatsappUrl()} target="_blank" rel="noreferrer">
              Let’s talk food <ArrowUpRight size={15} />
            </a>
            <button
              className="cart-trigger"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cart.count} items`}
            >
              <ShoppingBag size={19} />
              <span className="cart-label">Your cart</span>
              <span className="cart-count">{cart.count}</span>
            </button>
            <button
              className="icon-button mobile-menu"
              aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={navOpen}
              onClick={() => setNavOpen(!navOpen)}
            >
              {navOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer id="contact">
        <div className="footer-main container">
          <div>
            <Link to="/" className="brand footer-brand">
              <img
                className="brand-emblem"
                src="/assets/shanvis-emblem.webp"
                alt=""
                width="64"
                height="64"
                loading="lazy"
              />
              <span>
                <strong>
                  Shanvis <em>kitchen</em>
                </strong>
                <small>{business.tagline}</small>
              </span>
            </Link>
            <p>
              A little Andhra warmth.
              <br />A whole lot of home.
            </p>
          </div>
          <div>
            <h3>Come hungry.</h3>
            <Link to="/menu">Explore our menu</Link>
            <Link to="/monthly">Monthly salad & protein menus</Link>
            <Link to="/cart">Your cart</Link>
            <a href="/#how-it-works">How to order</a>
          </div>
          <div>
            <h3>From our kitchen</h3>
            <p>
              Serving across Bangalore
              <br />
              Orders welcome 24/7
              <br />
              Please place orders in advance.
            </p>
          </div>
          <div>
            <h3>Let’s talk food</h3>
            <a href="tel:+918147988709">+91 81479 88709</a>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              Chat on WhatsApp <ArrowUpRight size={14} />
            </a>
            <p>Timing confirmed by the kitchen.</p>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>© {new Date().getFullYear()} Shanvis kitchen. Made with care.</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms & cancellations</Link>
            <Link to="/allergens">Allergen notice</Link>
          </div>
        </div>
      </footer>
      {cart.count > 0 && ['/menu', '/monthly'].includes(location.pathname) && (
        <button className="mobile-cart-bar" onClick={() => setCartOpen(true)}>
          <span>
            {cart.count} items · {money(cart.total)}
          </span>
          <span>View cart →</span>
        </button>
      )}
      <Modal
        className="cart-modal"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title="Your cart"
      >
        <CartContents onNavigate={() => setCartOpen(false)} />
      </Modal>
      <div className="sr-only" role="status" aria-live="polite">
        {cart.notice}
      </div>
    </>
  );
}
