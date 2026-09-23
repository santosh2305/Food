# Shanvis kitchen implementation plan

User-authorized immediate implementation, 23 September 2026.

## Design and architecture

React, TypeScript, Vite and Tailwind, using a warm ivory canvas, deep leaf green, antique brass and editorial serif headings. Responsive semantic routes for home, menu, cart, checkout, confirmation and policy placeholders. Original illustrative imagery must not imply that unconfirmed dishes are available.

Catalogue data is the only price source, in integer paise. Cart stores item IDs, option IDs, quantity and cooking notes, never authoritative prices. Revalidate restored carts and payment readiness. No backend or database: order requests are composed on the device and sent by the customer on WhatsApp. Merchant acceptance and payment verification remain manual. Customer and transaction information are held in memory only. WhatsApp uses clipboard-first composition with a clean destination URL, keeping payment references and addresses out of URL parameters.

Missing menu means no invented dishes, prices or dietary claims and no checkout. Missing approved QR means QR payment disabled. COD and pay-on-pickup default disabled. Minimum order ₹300; free delivery for eligible orders (₹300 and above), documenting the boundary assumption. English only until translations are approved.

## Work sequence

- [x] Catalogue/cart business rules: Vitest tests for exact totals, option validation, stale data, malformed persistence, quantity bounds and checkout eligibility; implement typed services and Context persistence.
- [x] Customer journey: build home, data-driven menu, customization, accessible cart dialog, checkout validation, payment status, order summary, copy-and-open WhatsApp, print and policy pages. Test important user interactions with React Testing Library.
- [x] Quality: run TypeScript, ESLint, Prettier, unit/component tests, desktop/mobile browser flows and production build; inspect missing-input states and accessibility. Verified 19 unit/component tests, four desktop/mobile browser tests and zero axe A/AA violations on home and checkout. Independently reviewed cart/payment/privacy code; expanded QR readiness and changed-cart acknowledgement tests.
- [ ] Delivery: commit feature branch, push to the supplied repository, provision isolated Azure Static Web App, configure GitHub Actions secret without exposing it, run deployment and verify live routes/assets/headers.

## Launch requirements

The supplied menu has been imported: 113 entries, 111 with known prices, in 12 categories. The approved merchant QR is still required to enable payment and order-request checkout. The real catalogue and persistent cart can be deployed with a clear checkout-unavailable notice and direct kitchen contact. Legal pages are explicitly unfinished placeholders. Release notes must distinguish verified software/deployment from outstanding business content.
