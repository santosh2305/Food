# Release verification — 23 September 2026

Initial application commit: `faac73907b9e860848ba25de6363b4fd55dbab88` on `feat/shanvis-kitchen`.

Published to [Shanvis kitchen on Azure](https://gray-plant-06086f600.4.azurestaticapps.net).

## Completed checks

- TypeScript and Vite production build: passed locally and in GitHub Actions.
- ESLint and Prettier: passed locally and in GitHub Actions.
- Vitest / React Testing Library: 19 passed, including invalid cart persistence, exact totals/minimum, QR load failure, changed-cart payment acknowledgement and pending-verification UPI requests.
- Playwright: 4 passed on the local production build and 4 passed against the live Azure site. Desktop Chrome and mobile Chrome emulation cover search, customization, cart persistence, clear-cart confirmation, checkout-unavailable state and 404 route.
- Axe WCAG A/AA scans of home and checkout: no reported violations in the tested states on desktop or mobile. This is not a certification or a substitute for broader assistive-technology testing.
- Production dependency audit: no reported vulnerabilities at verification time.
- HTTP homepage: 200 with correct brand content; CSP and no-referrer security headers present. Real hero image loaded successfully.
- Independent read-only code review found no high-impact defects; recommended QR test cases were added and passed.
- Initial [GitHub deployment run](https://github.com/santosh2305/Food/actions/runs/35892789584): successful. Follow-up workflow maintenance replaces deprecated Action pins with current verified official revisions.

## Outstanding business inputs

Approved merchant QR is absent, so the deployed site intentionally does not permit checkout submission. Cash on delivery and pay on pickup remain disabled. Merchant settlement and order acceptance have not been tested with real payments or messages; no money or WhatsApp messages were sent during verification.

Fish Curry and Ghee Laddu have no visible source price and remain unavailable. Legal policy pages and testimonials are clearly marked placeholders. Pickup address and precise business policies await owner input. The delivery boundary assumption is free delivery at and above the ₹300 minimum. See `menu-transcription.md` and the README for maintenance.
