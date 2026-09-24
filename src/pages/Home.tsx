import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Leaf,
  MapPin,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { menu } from '../data/menu';
import { MenuCard } from '../components/MenuCard';
import { whatsappUrl } from '../services/order';
const carePoints = [
  {
    Icon: Heart,
    title: 'Home is our ingredient',
    text: 'A home kitchen, with care in every order.',
  },
  {
    Icon: UtensilsCrossed,
    title: 'Fresh, never rushed',
    text: 'We start preparing your food after your order is received.',
  },
  {
    Icon: Clock3,
    title: 'Plan a little ahead',
    text: 'Order requests are welcome 24/7. The kitchen confirms your time.',
  },
  {
    Icon: MapPin,
    title: 'Bangalore, covered',
    text: 'Free delivery on orders ₹300 and above, subject to serviceability.',
  },
];
export default function Home() {
  return (
    <div className="fresh-home">
      <section className="fresh-hero container">
        <div className="fresh-hero-copy">
          <p className="new-kicker">
            <span className="live-dot" /> YOUR HOME KITCHEN IN BANGALORE
          </p>
          <h1>
            Good food.
            <br />
            Great mood.
            <br />
            <span>Made at home.</span>
          </h1>
          <p>
            Andhra comfort food, colourful salads and daily protein. Freshly made for your cravings,
            your lunch break, your everyday.
          </p>
          <div className="fresh-hero-actions">
            <Link className="button" to="/menu">
              Explore menu <ArrowUpRight size={20} />
            </Link>
            <Link className="button secondary" to="/monthly">
              Monthly plans <CalendarDays size={18} />
            </Link>
          </div>
          <div className="fresh-hero-facts">
            <span>
              <MapPin size={15} /> Across Bangalore
            </span>
            <span>
              <Check size={15} /> Free delivery ₹300+
            </span>
          </div>
        </div>
        <div className="fresh-hero-media">
          <div className="hero-orange-label">
            <Sparkles size={16} /> HOMEMADE HITS DIFFERENT.
          </div>
          <img
            className="fresh-food-image"
            src="/assets/andhra-table.webp"
            alt="Illustrative Andhra meal with rice, brass bowls and a banana leaf"
            width="1000"
            height="1000"
            fetchPriority="high"
          />
          <div className="fresh-food-sticker">
            <span>100%</span>
            <strong>
              HOME
              <br />
              MADE
            </strong>
            <Heart size={19} />
          </div>
          <div className="hero-meal-ticket">
            <span>
              <UtensilsCrossed size={19} />
            </span>
            <div>
              <strong>Big Andhra flavour.</strong>
              <small>Made fresh after you order.</small>
            </div>
            <ArrowUpRight size={24} />
          </div>
          <p className="fresh-image-note">
            Illustrative serving. Explore the menu for available dishes.
          </p>
        </div>
      </section>
      <div className="flavour-band">
        <span>HOME MADE FOOD</span>
        <span aria-hidden="true">✳</span>
        <span>ANDHRA STYLE</span>
        <span aria-hidden="true">✳</span>
        <span>FRESH TO ORDER</span>
        <span aria-hidden="true">✳</span>
        <span>BANGALORE, WE’RE COOKING</span>
      </div>
      <section className="container fresh-section">
        <div className="new-section-title">
          <div>
            <p className="new-kicker">WHAT ARE YOU IN THE MOOD FOR?</p>
            <h2>Your kind of good food.</h2>
          </div>
          <Link className="text-link" to="/menu">
            See all dishes <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="food-paths">
          <Link className="food-path comfort-path" to="/menu">
            <span className="path-number">01 / EVERYDAY COMFORT</span>
            <UtensilsCrossed size={45} strokeWidth={1.6} />
            <div>
              <h3>
                The Andhra
                <br />
                classics.
              </h3>
              <p>Breakfast, full meals, biryani & more.</p>
            </div>
            <span className="path-link">
              Order a meal <ArrowUpRight size={22} />
            </span>
          </Link>
          <Link className="food-path salad-path" to="/monthly">
            <span className="path-number">02 / A FRESH ROUTINE</span>
            <Leaf size={45} strokeWidth={1.6} />
            <div>
              <h3>
                A month of
                <br />
                fresh bowls.
              </h3>
              <p>20 bowls. ₹2,600. Delivery included.</p>
            </div>
            <span className="path-link">
              Meet the salad plan <ArrowUpRight size={22} />
            </span>
          </Link>
          <Link className="food-path protein-path" to="/menu?category=Daily+Protein">
            <span className="path-number">03 / DAILY PROTEIN</span>
            <Sparkles size={45} strokeWidth={1.6} />
            <div>
              <h3>
                Make room
                <br />
                for protein.
              </h3>
              <p>Chicken, eggs & fish. From ₹150.</p>
            </div>
            <span className="path-link">
              Find your bowl <ArrowUpRight size={22} />
            </span>
          </Link>
        </div>
      </section>
      <section className="container fresh-section fresh-featured">
        <div className="new-section-title">
          <div>
            <p className="new-kicker">START WITH SOMETHING GOOD</p>
            <h2>Comfort, by the plate.</h2>
          </div>
          <span className="section-aside">Made to order. Always worth it.</span>
        </div>
        <div className="menu-grid featured-grid">
          {menu
            .filter((i) => i.featured)
            .map((i) => (
              <MenuCard key={i.id} item={i} />
            ))}
        </div>
      </section>
      <section className="container subscription-promo">
        <div className="subscription-promo-copy">
          <span className="pill-label">
            <CalendarDays size={15} /> THE MONTHLY CLUB
          </span>
          <h2>
            Less “what’s for lunch?”
            <br />
            More <span>“that looks good.”</span>
          </h2>
          <p>
            Fresh salads on a rotating four-week menu. Dressings on the side. Packing and delivery
            on us.
          </p>
          <div className="subscription-price">
            ₹2,600 <span>/ month · 20 bowls</span>
          </div>
          <Link className="button" to="/monthly">
            Discover the monthly plan <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="subscription-promo-art">
          <div className="salad-art-window">
            <img
              src="/assets/monthly/salad-menu.jpeg"
              alt="Sprouts bowl from the supplied monthly salad menu"
              loading="lazy"
              width="1024"
              height="1536"
            />
          </div>
          <span className="salad-art-label">
            FRESH BOWLS.
            <br />
            FRESH ROUTINE.
          </span>
          <span className="salad-art-tag">Dressing served separately ✓</span>
        </div>
      </section>
      <section className="container fresh-section fresh-story" id="our-story">
        <div>
          <p className="new-kicker">FROM SHANVIS, WITH LOVE</p>
          <h2>
            Real kitchen.
            <br />
            Real care.
            <br />
            <span>Really good food.</span>
          </h2>
          <p>
            That familiar Andhra flavour. A meal prepared just for you. We bring the warmth of home
            cooking to your everyday in Bangalore.
          </p>
          <Link className="text-link" to="/menu">
            Come hungry <ArrowRight size={18} />
          </Link>
        </div>
        <div className="care-grid">
          {carePoints.map(({ Icon, title, text }) => (
            <article key={title}>
              <Icon size={23} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="fresh-how" id="how-it-works">
        <div className="container">
          <div className="new-section-title">
            <div>
              <p className="new-kicker">GOOD FOOD. NO GUESSWORK.</p>
              <h2>Pick. Pay. Say hello.</h2>
            </div>
            <Link className="button" to="/menu">
              Order now <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="fresh-steps">
            {[
              [
                '01',
                'Build your meal',
                'Pick your dishes, add cooking notes and choose your preferred time. Minimum order ₹300.',
              ],
              [
                '02',
                'Pay with your UPI app',
                'Scan the merchant QR at checkout and verify the merchant name before paying.',
              ],
              [
                '03',
                'Send it on WhatsApp',
                'Copy and send your order request. Our kitchen confirms payment, availability and timing.',
              ],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container fresh-section today-contact">
        <div>
          <p className="new-kicker">TODAY’S SPECIALS</p>
          <h2>What’s cooking?</h2>
          <p>
            Ask the kitchen what’s available today, or plan something for your next lunch break.
          </p>
          <a className="button" href={whatsappUrl()} target="_blank" rel="noreferrer">
            Chat with our kitchen <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="community-note">
          <span>“</span>
          <h3>
            Your next favourite
            <br />
            starts at home.
          </h3>
          <p>
            Space for your stories.
            <br />
            Customer testimonials coming soon.
          </p>
          <small>Testimonial placeholder · no reviews published yet.</small>
        </div>
      </section>
    </div>
  );
}
