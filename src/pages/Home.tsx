import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Heart,
  Leaf,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { menu } from '../data/menu';
import { MenuCard } from '../components/MenuCard';
import { SectionHeading } from '../components/Primitives';
import { whatsappUrl } from '../services/order';
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-star">✦</span> FROM OUR HOME TO YOURS
          </p>
          <h1>
            A taste of Andhra.
            <br />A feeling of <em>home.</em>
          </h1>
          <p className="hero-description">
            Honest food. Familiar flavours. The kind of meal that feels like someone made it just
            for you.
            <br />
            <strong>Because we do.</strong>
          </p>
          <p className="hero-tagline">Home Made Food, Andhra Style</p>
          <div className="hero-buttons">
            <Link className="button" to="/menu">
              Explore menu <ArrowRight size={17} />
            </Link>
            <Link className="button secondary" to="/menu">
              Order now <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <span>
              <MapPin size={14} /> Across Bangalore
            </span>
            <span className="dot" />
            <span>Made fresh on order</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-stamp">
            <span>FRESHLY MADE</span>
            <Heart size={25} strokeWidth={1.2} />
            <span>WITH LOVE</span>
          </div>
          <img
            src="/assets/andhra-table.webp"
            alt="Illustration of a traditional Andhra meal on a banana leaf with brass bowls"
            width="1024"
            height="1024"
            fetchPriority="high"
          />
          <span className="art-caption">
            A little illustration of the warmth we bring to your table.
          </span>
          <div className="hero-handnote">
            Good food. <em>From the heart.</em>
          </div>
        </div>
      </section>
      <div className="promise-strip">
        <div className="container">
          <span>
            <Heart /> Homemade with care
          </span>
          <span>
            <Leaf /> Freshly prepared
          </span>
          <span>
            <UtensilsCrossed /> Made to order
          </span>
          <span>
            <MapPin /> Delivered across Bangalore
          </span>
        </div>
      </div>
      <section className="section container">
        <SectionHeading
          eyebrow="A LITTLE SOMETHING TO TEMPT YOU"
          title="From the heart of our menu"
        >
          <Link className="text-link" to="/menu">
            See the full menu <ArrowUpRight size={17} />
          </Link>
        </SectionHeading>
        <div className="menu-grid featured-grid">
          {menu
            .filter((i) => i.featured)
            .map((i) => (
              <MenuCard key={i.id} item={i} />
            ))}
        </div>
      </section>
      <section className="story-section" id="our-story">
        <div className="container story-grid">
          <div className="story-mark">
            <span className="eyebrow">THE SHANVIS WAY</span>
            <h2>
              Not just a meal.
              <br />
              <em>
                A little piece
                <br />
                of home.
              </em>
            </h2>
            <Leaf size={70} strokeWidth={0.7} />
          </div>
          <div className="story-copy">
            <p className="eyebrow">SIMPLE FOOD. DEEPLY ROOTED.</p>
            <h2>Our kitchen, your comfort.</h2>
            <p>
              There’s something special about a homemade meal. The familiar flavours, the care in
              its preparation, the joy of sitting down to something made for you.
            </p>
            <p>
              At Shanvis kitchen, we bring that feeling to Bangalore with Andhra-style cooking,
              prepared fresh only after your order is received.
            </p>
            <div className="story-points">
              <div>
                <Heart />
                <h3>Made with intention</h3>
                <p>A home kitchen, with care in every order.</p>
              </div>
              <div>
                <Clock3 />
                <h3>Worth planning for</h3>
                <p>Order in advance. We cook fresh for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="special-grid">
          <div className="special-panel">
            <p className="eyebrow">SOMETHING FOR TODAY</p>
            <h2>Today’s specials</h2>
            <p>Something special may be cooking. Ask our kitchen what’s available today.</p>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="text-link">
              Ask on WhatsApp <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="meal-panel">
            <div>
              <p className="eyebrow">YOUR EVERYDAY COMFORT</p>
              <h2>
                A proper meal.
                <br />
                All in one.
              </h2>
              <p>Full and half veg meals, and a full non-veg meal. Find your kind of comfort.</p>
              <Link className="button" to="/menu?category=Meals">
                Explore our meals <ArrowRight size={16} />
              </Link>
            </div>
            <span className="meal-number">
              01
              <span>
                GOOD MEAL.
                <br />
                MANY LITTLE JOYS.
              </span>
            </span>
          </div>
        </div>
      </section>
      <section className="section how-section container" id="how-it-works">
        <SectionHeading
          eyebrow="HOME COOKING, SIMPLY ORDERED"
          title="A few steps to a lovely meal"
        />
        <div className="steps-grid">
          {[
            [
              '01',
              'Find your favourites',
              'Explore the menu and build your meal. The minimum order is ₹300.',
            ],
            [
              '02',
              'Make it yours',
              'Add preparation requests and choose delivery or pickup and your preferred time.',
            ],
            [
              '03',
              'Say hello on WhatsApp',
              'Send your order request. Our kitchen confirms availability, timing and payment.',
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span className="step-number">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="testimonials container">
        <p className="eyebrow">A PLACE FOR YOUR STORIES</p>
        <h2>Good food brings people together.</h2>
        <div className="testimonial-placeholder">
          <span className="quote-mark">“</span>
          <p>Your first stories from our kitchen will go here.</p>
          <span>Testimonial placeholder — no customer review published yet.</span>
        </div>
      </section>
      <section className="delivery-banner container">
        <div>
          <p className="eyebrow">BANGALORE, LET’S EAT WELL.</p>
          <h2>
            A homemade meal is
            <br />
            closer than you think.
          </h2>
          <p>
            Free delivery on orders ₹300 and above. Order requests welcome 24/7.
            <br />
            Please order in advance; delivery times and areas are confirmed by the kitchen.
          </p>
        </div>
        <a className="button cream" href={whatsappUrl()} target="_blank" rel="noreferrer">
          Chat with our kitchen <ArrowUpRight size={18} />
        </a>
      </section>
    </>
  );
}
