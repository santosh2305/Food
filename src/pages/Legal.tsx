import { Link, useLocation } from 'react-router-dom';
export default function Legal() {
  const { pathname } = useLocation();
  const privacy = pathname === '/privacy';
  const allergens = pathname === '/allergens';
  return (
    <article className="container page-space legal">
      <p className="eyebrow">CLEAR INFORMATION, WITH CARE</p>
      <h1>
        {privacy ? 'Privacy notice' : allergens ? 'Food allergen notice' : 'Terms & cancellations'}
      </h1>
      {!allergens && (
        <p className="notice">
          <strong>Policy placeholder — pending business review.</strong> This page describes the
          current website behaviour. The merchant’s full approved policy has not yet been supplied.
        </p>
      )}
      {privacy ? (
        <>
          <h2>What this website keeps</h2>
          <p>
            Your cart is stored on your device using localStorage so it can survive a refresh. It
            contains dish selections and cooking instructions. Please do not include personal or
            payment details in cooking instructions.
          </p>
          <p>
            Your name, phone number, address, requested time and transaction reference are held in
            the current tab’s memory. This website has no customer database, advertising trackers or
            analytics integration.
          </p>
          <h2>When you share an order</h2>
          <p>
            Nothing is sent automatically. If you copy the order message and send it on WhatsApp,
            the message is shared with the kitchen through WhatsApp. Their platform policies apply.
            Azure hosting may process standard request logs. Clipboard content remains until
            replaced on your device.
          </p>
          <h2>Questions and deletion requests</h2>
          <p>
            Contact the kitchen on 8147988709. Merchant retention periods, data handling details and
            the final privacy policy are awaiting business review.
          </p>
        </>
      ) : allergens ? (
        <>
          <h2>Please speak to us before ordering</h2>
          <p>
            The supplied menu does not contain ingredient-level allergen information or
            cross-contact assurances. Do not assume a dish is allergen-free based on its name, image
            or dietary label.
          </p>
          <p>
            Tell the kitchen about any allergy before placing or paying for an order. Cooking notes
            alone are not confirmation that an allergy request can be accommodated.
          </p>
          <p>
            Vegetarian labels are shown only where the source menu explicitly provides them. No
            vegan claims are made.
          </p>
        </>
      ) : (
        <>
          <h2>Order requests and confirmation</h2>
          <p>
            Creating a request or opening WhatsApp does not submit or accept an order. The customer
            must send the request, and the kitchen must confirm availability, serviceability and
            timing. All food is prepared after an order is received; please order in advance.
          </p>
          <h2>Payment</h2>
          <p>
            UPI payment references and customer acknowledgements do not verify settlement. The
            merchant verifies payments manually. Pay-on-pickup and cash-on-delivery appear only when
            enabled by the business.
          </p>
          <h2>Delivery, pickup and cancellations</h2>
          <p>
            Minimum order: ₹300. Free delivery on eligible orders of ₹300 and above across
            Bangalore, subject to serviceability confirmation. Pickup address and time must be
            confirmed with the kitchen.
          </p>
          <p>
            The business has not yet supplied cancellation windows, refund eligibility, refund
            timelines or a final delivery policy. Contact the kitchen and agree these details before
            paying. No refund or cancellation guarantee is implied.
          </p>
        </>
      )}
      <Link className="text-link" to="/menu">
        Back to the menu →
      </Link>
    </article>
  );
}
