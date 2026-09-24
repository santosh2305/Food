# Shanvis kitchen

A responsive Andhra homemade-food storefront, built with React, TypeScript, Vite and Tailwind CSS. Catalogue data is transcribed from the owner's four-page menu, with exact integer-paise pricing, persistent cart, checkout, manual UPI verification and customer-initiated WhatsApp order requests.

## Run and verify

Node 24 LTS is used in CI.

```sh
npm ci
npm run dev
npm run check
npm run format:check
npx playwright install chromium
npm run test:e2e
```

`npm run check` runs ESLint, Vitest/React Testing Library and the TypeScript/Vite production build. Playwright tests run against the built site on desktop and mobile, including axe accessibility scans. `TEST_BASE_URL` can point those browser checks at Azure after deployment. Browser screenshots and traces remain ignored under `artifacts/` and `test-results/`.

## Source structure

- `src/data/menu.ts`: catalogue, source page and available dietary facts; no database.
- `src/config.ts`: business details and public environment configuration.
- `src/services/`: catalogue-derived cart calculations, persistence validation, checkout validation, reference generation and WhatsApp message formatting.
- `src/state/`: cart Context and memory-only order Context.
- `src/components/`: reusable cards, quantities, dialogs, cart and layout.
- `src/pages/`: lazy-loaded menu, cart, checkout, confirmation and policy routes.
- `public/staticwebapp.config.json`: Azure SPA fallback, security headers and asset cache policy.

## Menu maintenance

Edit the catalogue, then run tests and build. All money values exposed by `MenuItem` are integer paise; the section helper takes rupees and converts once. Keep IDs stable so carts survive catalogue edits. Restored carts discard unavailable/missing items and invalid options and use current catalogue prices. See `docs/menu-transcription.md` for source ambiguities. Fish Curry and Ghee Laddu have no supplied price and cannot be ordered. No source-supported dietary label means no label shown. No supplied ingredients/allergens means no claim. Set `special: true` only after the kitchen identifies an actual special; none are currently announced.

## Payments and launch configuration

Copy `.env.example` to `.env.local` for local configuration. `VITE_` variables are public, embedded at build time, and must never contain secrets. The owner-supplied, unchanged merchant QR is available at `/assets/payments/merchant-qr.jpeg`. QR checkout creates a request with payment pending manual verification, never an accepted or automatically settled order. An explicitly empty `VITE_UPI_QR_PATH` disables QR checkout; an undefined value uses the approved asset.

When replacing the merchant-approved QR:

1. Copy the original unchanged image to `public/assets/payments/merchant-qr.png` (or approved JPG/WebP). Do not regenerate, decode into a new destination or modify payment details.
2. Set `VITE_UPI_QR_PATH=/assets/payments/merchant-qr.png` as a GitHub Actions variable and pass it to the build. The display name is Divya, as supplied. Verify the QR image loads at the deployed URL before enabling payment.
3. Rebuild, run the checkout tests and visually verify the exact amount, merchant warning, acknowledgement and pending-verification status.

Cash on delivery and pay on pickup are disabled unless `VITE_ENABLE_COD` or `VITE_ENABLE_PAY_ON_PICKUP` is explicitly set to `true`. Set the approved pickup address in `VITE_PICKUP_ADDRESS` when provided. Do not turn on a payment method merely to remove the launch warning.

The QR intentionally appears publicly to customers. Banking credentials, PINs, tokens and private payment details must never be included. No automatic settlement verification is performed. No backend accepts or fulfils an order. The merchant must independently check payment, prices, availability, delivery and order acceptance. Browser calculations improve correctness but are not a trusted financial boundary.

WhatsApp deliberately uses a clean `wa.me` URL without a `text` query. The customer copies the preformatted message, opens WhatsApp, pastes and sends. This keeps address and transaction reference out of URLs. Clipboard failures fall back to a selectable textarea. Personal details and transaction references remain in memory, not localStorage; cart cooking notes persist and should not contain personal details.

## Azure and CI

Dedicated Azure resource group: `rg-shanvis-kitchen`; free-tier Static Web App: `shanvis-kitchen`, in East Asia. Other resources are untouched.

The pinned GitHub Actions workflow validates formatting, lint, tests, build and desktop/mobile browser flows before deployment. `AZURE_STATIC_WEB_APPS_API_TOKEN` is stored only as a GitHub repository secret. No deployment token is checked into source or printed by our setup. Pushes on `feat/shanvis-refresh` deploy production; `main` is supported for later integration. Retire the feature-branch production trigger once main becomes the release branch. Pull requests run checks without a deployment secret. To roll back, revert the relevant source commit on the release branch and let the verified workflow redeploy.

Security headers include CSP, clickjacking protection, no-referrer and restricted device permissions. Routes are served by Azure's SPA fallback; unknown application routes show the in-app 404. No customer database, Azure Function, tracker or analytics SDK is introduced.

## Remaining owner content

- The two unlisted bowls/days in the monthly salad rotation (the supplied poster advertises ten but lists eight).
- Fish Curry and Ghee Laddu prices.
- Approved pickup address if pickup is offered.
- Final privacy, terms, cancellation and refund policies. Current pages are clearly labelled placeholders.
- Optional real dish photographs, actual testimonials, daily specials, allergens, verified dietary facts and approved Kannada/Telugu/Tamil translations.

Business assumption: minimum order ₹300; eligible delivery orders, including exactly ₹300, have zero delivery fee. Order requests are welcome 24/7, but preparation and delivery times require merchant confirmation. Review this boundary if the business intends a different rule.

## Image provenance

`public/assets/andhra-table.webp` is an original AI-generated editorial illustration created for this website. It is labelled illustrative and does not represent a guaranteed dish or serving. Menu cards use licensed, representative Wikimedia Commons photographs matched by dish name/family. Source, photographer and licence are preserved in `src/data/photo-credits.json` and displayed on `/image-credits`. CSS fits the original downloaded images into consistent cards. Do not remove attribution when replacing photos. `scripts/fetch-menu-photos.ps1` records sources and skips previously downloaded assets; it is a maintenance utility, not part of builds.

After downloading or replacing photos, manually inspect each match and its licence, then run `node scripts/optimize-images.mjs` to create 320/640px WebP variants and update the manifest. Search results are candidates, not approved matches. Original downloads are retained for reproducible optimisation. Cashaw Channa and Sweet Vada use a labelled representative sweets-family image because their exact appearance was not supplied.

The original cooking emblem at `public/assets/shanvis-emblem.png` was generated with the built-in image-generation tool; the site serves the smaller 256px WebP version. Prompt: a circular green and antique-gold badge showing an Indian woman cooking in a green sari with a brass pot, terracotta flame and banana leaves, on ivory, with no lettering. The wordmark is accessible HTML using the same self-hosted DM Sans family as the entire interface.

## Monthly offerings

`src/data/monthly.ts` transcribes the two owner-supplied JPEG menus. The salad subscription is ₹2,600 for 20 bowls, after the advertised ₹150 discount, with free packing/delivery. Only eight rotation entries are supplied; the page preserves their weekdays and prices without inventing missing entries. Subscriptions are enquiries requiring merchant confirmation of the full schedule before payment. Seven daily protein dishes are available in the regular cart at their individual supplied prices. No protein subscription total is invented. Original posters remain available under `public/assets/monthly/`.

Public website: https://gray-plant-06086f600.4.azurestaticapps.net/ — no sign-in required.
