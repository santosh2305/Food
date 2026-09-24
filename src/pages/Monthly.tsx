import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Check, Package, Truck } from 'lucide-react';
import { saladPlan, proteinMenu } from '../data/monthly';
import { money } from '../config';
import { whatsappUrl } from '../services/order';
import { MenuCard } from '../components/MenuCard';
export default function Monthly() {
  return (
    <div className="monthly-page">
      <section className="plan-intro container">
        <div>
          <p className="new-kicker">
            <CalendarDays size={17} /> YOUR LUNCH BREAK, UPGRADED
          </p>
          <h1>
            A fresh bowl.
            <br />A better <span>routine.</span>
          </h1>
          <p>
            Meet your monthly salad subscription and our daily protein menu. A little less meal
            planning. A lot more to look forward to.
          </p>
          <a className="button" href="#salad-plan">
            Explore the monthly plan <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="poster-preview">
          <img
            src="/assets/monthly/salad-menu.jpeg"
            alt="Owner-supplied monthly salad subscription menu"
            width="1024"
            height="1536"
          />
          <a href="/assets/monthly/salad-menu.jpeg" target="_blank" rel="noreferrer">
            View original salad menu <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section className="container plan-section" id="salad-plan">
        <div className="plan-price-card">
          <span className="pill-label">YOUR MONTH, SORTED</span>
          <h2>
            Monthly salad
            <br />
            subscription
          </h2>
          <p className="plan-price">
            {money(saladPlan.price)}
            <span>/ month</span>
          </p>
          <p>
            <s>{money(saladPlan.originalPrice)}</s>{' '}
            <span className="saving">Save {money(saladPlan.discount)}</span>
          </p>
          <ul>
            <li>
              <Check />
              20 bowls per month
            </li>
            <li>
              <Check />
              Rotating four-week menu
            </li>
            <li>
              <Package />
              Free packing · dressing served separately
            </li>
            <li>
              <Truck />
              Free delivery
            </li>
          </ul>
          <a className="button" href={whatsappUrl()} target="_blank" rel="noreferrer">
            Enquire about this plan <ArrowUpRight size={18} />
          </a>
          <p className="small">
            An enquiry, not a subscription charge. Confirm your start date, full rotation and
            delivery schedule with the kitchen before paying.
          </p>
        </div>
        <div className="plan-schedule">
          <p className="new-kicker">WHAT’S IN YOUR ROTATION</p>
          <h2>
            New week.
            <br />
            Fresh favourites.
          </h2>
          <p className="schedule-note">
            The supplied menu shows the eight bowls below. The complete ten-bowl rotation and
            remaining delivery days are confirmed by the kitchen.
          </p>
          <div className="rotation-grid">
            {saladPlan.rotation.map((week) => (
              <section className="week-panel" key={week.weeks}>
                <h3>{week.weeks}</h3>
                {week.days.map((day) => (
                  <article className="schedule-dish" key={day.day}>
                    <span>{day.day}</span>
                    <div>
                      <h4>{day.name}</h4>
                      <strong>{money(day.price)}</strong>
                    </div>
                    <p>+ {day.dressing}</p>
                  </article>
                ))}
              </section>
            ))}
          </div>
          <p className="small">
            Prices alongside bowls are as listed in the supplied menu. The advertised 20-bowl
            monthly package is ₹2,600 after the ₹150 subscription discount; no missing menu prices
            or days have been inferred.
          </p>
        </div>
      </section>
      <section className="container section" id="daily-protein">
        <div className="new-section-title">
          <div>
            <p className="new-kicker">MORE TO YOUR EVERYDAY</p>
            <h2>Meet your daily protein.</h2>
            <p>
              Seven options from your kitchen. Order individually from the menu, or ask us about a
              monthly arrangement.
            </p>
          </div>
          <a
            className="text-link"
            href="/assets/monthly/protein-menu.jpeg"
            target="_blank"
            rel="noreferrer"
          >
            View original protein menu <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="menu-grid">
          {proteinMenu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
        <div className="notice">
          <strong>Planning protein meals for the month?</strong>
          <p>
            The listed prices are per dish. A monthly protein package price has not been provided.
            Contact the kitchen for the schedule and a quote; there is no automatic recurring
            charge.
          </p>
        </div>
        <Link className="button secondary" to="/menu">
          Explore the full kitchen menu
        </Link>
      </section>
    </div>
  );
}
