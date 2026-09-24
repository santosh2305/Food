# Refresh validation — 24 September 2026

Feature branch: `feat/shanvis-refresh`, based on the existing deployed storefront.

- Redesigned home and monthly pages; consistent self-hosted DM Sans typography; original menu-inspired cooking emblem.
- 61 licensed representative dish-family photographs cover all 120 catalogue tiles. Attribution and licence links are available on `/image-credits`. Images have 320/640px WebP variants and lazy loading. Original photos are retained; visual curation replaced misleading search matches.
- Monthly poster data checked against both supplied images. Eight supplied salad rotation entries remain unchanged; missing entries require merchant confirmation. Seven protein dishes use supplied individual prices.
- Owner-supplied merchant QR copied unchanged. Only its public asset path is configured in GitHub. No QR decoding, banking credentials, payment destination strings or payment screenshots are added to source or logs.
- Local checks: ESLint, TypeScript/Vite build, 24 unit/integration tests, and six desktop/mobile Playwright checks pass. Browser checks cover imagery, consistent font family, menu/cart persistence, customization dialogs, approved QR loading, exact amount, monthly plan, 404 and axe accessibility.
- Browser traces are disabled to avoid recording payment/customer content. Screenshots cover the home page only.
- Independent review completed; dessert-family mappings corrected and photo maintenance scripts merge current manifest contents before writing.

QR payments remain pending merchant verification. Subscription schedule completion, two unpriced regular dishes, pickup address, and final legal policy text remain owner-content dependencies.
