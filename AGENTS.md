# AGENTS.md — Handover for the next agent

You are taking over the B38 Bake House website: a real, working, full-stack custom-cake
ordering site for a home bakery in Krishna Nagar, Mathura, India (owner: Chhaya Savargaonkar).
It is deployed and used as the business's primary web presence.

**Your job is a UI/UX redesign.** This document deliberately contains NO design direction —
that is yours. It contains everything factual: how the system works, what is built, what is
missing, where things live, and known problems (read the photo section carefully).

---

## 1. READ THIS FIRST: the photos are wrong

- **The photos currently on the site are NOT production-ready.** A previous automated
  enhancement pass overexposed them (too bright, washed out). Do not ship them.
- **The true original photos from the owner's Google Photos album are in `/original-photos/`**
  (30 JPGs, untouched downloads, 39 MB). Many carry a white "B38 BAKEHOUSE" watermark in the
  top-right corner (photos 02, 05, 06, 07, 13, 14, 16, 17 by number).
- **Your task with photos:** start from `/original-photos/`, remove the watermarks where
  present, and enhance the images accurately — keep every cake exactly as designed (same
  colours, decorations, text) while making lighting/background/colour cohesive and appetizing
  across the set. The previous agent's tools live in `scripts/` (watermark inpainting:
  `scripts/clean-photos.py`; an over-strong grade: `scripts/grade-photos.py` — do better).
  A cloud-AI batch editor also exists: `scripts/ai-batch.py` (FLUX Kontext via free HF Spaces,
  resumable, anonymous quota-limited) — it produced good results but the owner rejected the
  AI-generated look for the full set; use judgement.
- Derivatives the site serves are generated into `public/media/designs/<slug>/` by
  `scripts/media-pipeline.mjs` (which reads from a source folder constant at its top —
  currently `_incoming/b38-photos-graded/`, which is gitignored and overexposed). The photo →
  design mapping is inside that script, and `node scripts/media-pipeline.mjs` regenerates all
  published AVIF/WebP assets, then `node scripts/seed.mjs` refreshes the database.
- The owner's exact round logo is at `public/logo.png` (and `src/app/icon.png`).

## 2. What this project is

- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4
  (CSS-first `@theme` tokens in `src/app/globals.css`) · SQLite via better-sqlite3 (file:
  `data/b38.db`, gitignored) · self-hosted fonts in `public/fonts*` · Playwright E2E.
- **The full original product specification** is in `docs/PRODUCT_SPEC_V2.md` — 4,400 lines
  covering product strategy, benchmarks, photo direction, payments research (India/UPI,
  Oct-2026 MDR change), information architecture, data model, testing strategy. Read it for
  intent and completeness gaps. Where the shipped site differs, the shipped site wins unless
  you decide otherwise.
- Other docs: `README.md` (stack + run), `docs/owner-handover.md` (non-technical owner guide),
  `docs/payment-provider-decision.md` (gateway comparison + activation checklist).

## 3. How to run it

```bash
npm install
node scripts/seed.mjs     # creates + seeds data/b38.db from content/designs.json
npm run build && npm start   # or: npx next dev
```

- Site: http://localhost:3000 · Owner studio: `/studio` (passcode in `STUDIO_PASSWORD` env,
  default `b38-demo`; the deployed Codespace uses a different one via `.devcontainer/devcontainer.json`).
- Tests: `npx playwright test` (needs the server on :3111 or set BASE_URL; 4 suites,
  ~15s). `node scripts/audit.mjs` crawls all 35 pages checking console errors/404s/broken images.

## 4. Architecture — how everything works

### Data layer (`src/lib/`)
- `db.ts` — better-sqlite3 connection (WAL, busy_timeout) + full schema DDL. Also mirrored in
  `scripts/schema.sql` for the seeder. Keep both in sync.
- `catalog.ts` — designs/images/flavours/addons/delivery-zones queries + variant price ladder
  (sizes derive from the 1 kg price: 500g = 0.6×, 1.5kg = 1.45×, 2kg = 1.85×, rounded to ₹50).
- `pricing.ts` — **the single server-authoritative price engine.** Browser sends option IDs
  only; server recomputes line items (design variant, flavour adjustment, eggless +₹50,
  add-ons, rush +15% when inside the lead window, delivery by pincode zone, coupon validation
  and discount). Coupons table supports percent/flat, min spend, cap, usage limit, date window.
- `capacity.ts` — per-day point system (simple cake = 1pt, detailed = 2, showcase = 3;
  default 6 pts/day, overridable per day, days can be blocked). Orders in
  `awaiting_payment` softly hold capacity for 30 minutes.
- `tokens.ts` — order codes (B38-xxxx), tracking tokens (stored hashed), webhook HMAC signing.
- `settings.ts` — key/value business settings (name, phone, WhatsApp, address, Instagram,
  UPI VPA, deposit %, quote expiry, capacity defaults). Seeded in `scripts/seed.mjs`, editable
  in Studio → Settings, live immediately.

### Content source
- `content/designs.json` — the 20-design catalogue: names, taglines, stories, price tiers,
  lead times, capacity points, style/occasion/colour tags. Editable; `node scripts/seed.mjs`
  upserts by slug (images come from the media manifest).

### Public flows
1. **Direct order:** `/designs` → `/designs/[slug]` — gallery + `OrderConfigurator`
   (client) which live-prices via `POST /api/quote` → "Continue" creates the order via
   `POST /api/orders` (recomputes price server-side, enforces lead time + capacity, creates a
   30-min soft hold) → `/checkout/[code]?t=token` (contact form via server action) →
   `POST /api/checkout/pay` creates a payment attempt → `/checkout/[code]/pay` is the UPI
   moment (app chooser; approve/fail buttons in demo mode) → the mock gateway fires a **signed
   webhook** at `/api/webhooks/mock` → handler verifies signature, enforces idempotency by
   event id AND never double-credits a settled payment, matches amount, then confirms the
   order → customer lands on `/track/[token]`.
2. **Custom/quote flow:** `/custom` (3 tiers) → `/custom/from-scratch` or
   `/custom/from-design/[slug]` — `CustomBrief` 9-step form (occasion, reference image uploads,
   must-keep/avoid, size/flavour/eggless, style direction with archive thumbnails, message,
   budget bands, fulfilment, review). Submits to `POST /api/custom-requests` (stores refs
   privately under `data/uploads/`) → customer tracks at `/request/[token]` → owner writes a
   quote in Studio → customer accepts (server action in the request page) → a bespoke order is
   created with deposit due → same checkout.
3. **Tracking:** `/track` explains the private-link system; `/track/[token]` shows status
   timeline, spec, balance, WhatsApp CTA.

### Payments
- `MockUpiProvider` simulates a gateway end-to-end: server-created attempt → signed webhook →
  verified, idempotent confirmation. The public route `POST /api/mock-gateway/approve` plays
  the UPI app. **This is demo-mode: no real money.** To go live, implement a real adapter
  (Cashfree recommended; see `docs/payment-provider-decision.md`) — the webhook contract to
  satisfy is exactly what `/api/webhooks/mock` implements (signature, event-id idempotency,
  double-capture defense, amount match).
- If the owner fills a UPI VPA in Studio → Settings, a direct-UPI manual-verification flow is
  available (owner confirms payment in Studio → order page).

### Owner studio (`/studio`, passcode-gated — `src/lib/auth.ts`)
- `/studio` — today's due orders, action queue (briefs awaiting quotes, payments in progress,
  expired holds), 7-day oven-load strip.
- `/studio/orders` + `/[id]` — order pipeline with allowed status transitions, payment list,
  manual "Verify paid" for direct UPI, WhatsApp deep link to the customer.
- `/studio/requests` + `/[id]` — custom-brief inbox with reference photos (served via
  auth-gated `/api/uploads/[file]` from `data/uploads/`) and the quote composer (spec text,
  total, deposit %, validity days; versioned quotes; customer accepts from their tracking page).
- `/studio/designs` + `/[id]` — edit name/tagline/price/lead time/rush/visibility/featured.
- `/studio/designs/new` — **add a new design with photo upload** (sharp generates all
  derivatives at save time; design goes live instantly).
- `/studio/offers` — coupon CRUD (percent/flat, min spend, cap, usage limit, end date,
  pause/resume).
- `/studio/capacity` — block days or set custom daily points.
- `/studio/settings` — business identity, WhatsApp/phone, address, maps link, Instagram,
  UPI VPA + payee, FSSAI number, deposit %, quote expiry, delivery-zone fees.

### Business facts already baked in
- Owner: Chhaya Savargaonkar · 38-B, Krishna Nagar, Mathura, UP 281001 · phone/WhatsApp
  +91 93685 65911 · Instagram @b38bakehouse · logo `/logo.png` (the owner's real round logo).
- Delivery zones seeded: Mathura city 281001 (₹99), 281003/281004 (₹149), Vrindavan 281121 (₹199);
  pickup free from Krishna Nagar.
- 20 designs with real names/stories derived from the owner's actual album; prices are
  sensible defaults the owner can change in Studio.

## 5. Deployment

- **Live URL:** recorded in `deploy-url.txt` — a GitHub Codespace public port
  (`*.app.github.dev`), created via the devcontainer in `.devcontainer/devcontainer.json`:
  postCreate installs + seeds + builds; postStart launches `next start` on :3000. The container
  auto-recovers the server on wake (it sleeps after ~4 idle hours; wake by visiting
  github.com/codespaces or `gh codespace start`).
- Visitors see a one-time GitHub "Continue" interstitial (inherent to codespace public ports).
- For a permanent production host: the repo deploys as-is to any Node host (Vercel/Render/
  Railway) — swap SQLite for a hosted DB when you do, and add real gateway keys.

## 6. What is built vs. what is needed (gap list)

Built and working: everything in §4 — catalogue, configurator, orders, soft holds, checkout,
mock gateway with signed idempotent webhooks, order tracking, 9-step custom brief with uploads,
quote workflow with versioning, studio (orders/quotes/designs/new-design/offers/capacity/
settings), E2E tests, per-page SEO + Product JSON-LD, policies pages, 404.

Needed / known gaps (yours to decide):
1. **Photos (top priority — see §1).**
2. Real payment gateway integration (mock is complete but simulated).
3. FSSAI number + real delivery fees + real UPI VPA from the owner (fields exist in Studio).
4. Email/WhatsApp outbound notifications are stubbed to zero (spec §38 suggests Resend or
   click-to-chat only — current site relies on tracking links + WhatsApp deep links).
5. Coupons have no storefront discovery (codes are typed at checkout; there is no banner).
6. The media pipeline and seed are two separate manual steps; a redesign may restructure how
   photos flow into the site.
7. `data/` is gitignored: the deployed Codespace DB starts empty and needs `node scripts/seed.mjs`
   on first boot (the devcontainer postCreate does this automatically).

## 7. Conventions and constraints

- **Money is integer paise everywhere** (`formatINR` in `src/lib/money.ts`). Never floats.
- **Never trust browser totals** — every price goes through `computeQuote`/`POST /api/orders`.
- **Route groups:** `(public)` = site with header/footer; `(focus)` = brief flow (no footer,
  fixed step bar); `(auth)` = studio login outside the guarded layout; `studio/*` has its own
  auth check in its layout.
- **Server actions** are used for mutations (checkout contact, quote accept, studio ops);
  client fetch for live pricing.
- No customer accounts: tracking links are unguessable tokens, stored hashed.
- Customer reference uploads are private (`data/uploads/`, auth-gated route), never published
  without owner permission.
- Design tokens live in `src/app/globals.css` `@theme`; fonts are self-hosted WOFF2 (see
  `src/styles/fonts-v2.css`). The current palette/type/motion are the previous agent's choices —
  replace them freely; just keep contrast sane and the owner's logo colours (cocoa + gold)
  harmonised with whatever you build.
- E2E tests assert: full order+pay+track, client-side navigation reveals ALL content (there
  was a bug where animated elements stayed invisible after <Link> navigation — the test in
  `tests/e2e/navigation.spec.ts` guards it), custom brief submission, studio auth.

## 8. Hard rules from the owner

- Do not fabricate: no fake reviews, no fake statistics, no invented scarcity. The archive
  designs are real cakes that really came out of this kitchen.
- Prices must always be visible and fixed; no "DM for price".
- Customers get a fixed quote before paying anything on custom work.
- Allergen honesty: kitchen handles nuts/gluten; eggless is +₹50 on everything.
