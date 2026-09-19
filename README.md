# B38 Bake House

Design-led custom cakes from Chhaya Savargaonkar's home kitchen — 38-B Krishna Nagar, Mathura.
This is the full ordering site: a real-cake design archive, deterministic personalisation pricing,
date-based capacity, quote workflow for custom work, and an owner studio.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind CSS 4
- SQLite (better-sqlite3) — schema in `scripts/schema.sql`, seeded from `content/*.json`
- Self-hosted Newsreader + Georama (SIL OFL 1.1) in `public/fonts`
- Media pipeline: `scripts/clean-photos.py` (watermark removal + enhancement) → `scripts/media-pipeline.mjs` (AVIF/WebP derivatives)
- Payments: provider-adapter pattern. `MockUpiProvider` runs the exact production flow (server-created order → signed webhook → idempotent verification). Swap in Cashfree/PhonePe by implementing one adapter file.

## Run locally

```bash
npm install
node scripts/seed.mjs     # seeds data/b38.db from content/
npm run build && npm start
```

- Site: http://localhost:3000
- Owner studio: http://localhost:3000/studio — passcode from `STUDIO_PASSWORD` (default `b38-demo`; **change it in `.env.local` before going public**)

## The demo payment gateway

Checkout completes through a simulated UPI gateway that mirrors a real one: the order is created
server-side with an exact amount, the "gateway" delivers a signed webhook, and confirmation only
happens after signature verification, idempotency checks, and amount matching. To go live with a
real gateway, implement the same webhook contract against Cashfree (or PhonePe/Razorpay) and set
their keys in `.env` — the checkout UI and order flow do not change.

## Regenerating media

Originals live privately in `_incoming/b38-photos` (gitignored). To rebuild all published
derivatives after editing photos:

```bash
py scripts/clean-photos.py && node scripts/media-pipeline.mjs && node scripts/seed.mjs
```

## Docs

- `docs/owner-handover.md` — everything the owner needs: studio guide, go-live checklist, how to change prices/practices
- `docs/payment-provider-decision.md` — payment notes for the India/UPI context (Oct 2026 MDR change)
