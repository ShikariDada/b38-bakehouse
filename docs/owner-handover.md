# B38 Bake House — Owner Handover

Everything Chhaya (or anyone helping her) needs to run this site.

## Where things are

| Thing | Where |
|---|---|
| The website itself | `/` — designs archive, custom cake flow, checkout, tracking |
| Your studio (admin) | `/studio` — passcode protected |
| Design catalogue data | `content/designs.json` (names, stories, prices) — loaded into the database by `node scripts/seed.mjs` |
| Business settings | Studio → Settings (phone, address, UPI, zones) — live immediately |
| Orders & customer data | `data/b38.db` (SQLite file) — back this file up regularly |
| Customer reference photos | `data/uploads/` (private, never published) |
| Cake photos (published) | `public/media/` — optimized AVIF/WebP, logo-free |
| Original album photos | `_incoming/` (private, not in git) |

## Studio guide (2 minutes)

- **Today**: what's due today, briefs waiting for quotes, payments in progress, the week's oven load.
- **Orders** → click an order: see the full spec, the customer, the money, and buttons to move it
  through *confirmed → in production → ready → completed*. If a customer pays by manual/direct UPI,
  a **Verify paid** button appears; only press it after you see the money in your account.
- **Requests**: every custom brief lands here. Read it, look at the reference photos, write what
  you'll make, enter the total ₹, deposit %, and validity, then **Send quote**. The customer
  accepts and pays the deposit on their tracking page — no bargaining, it's all in writing.
- **Designs**: change a price, lead time, or take a design off the site. Instant.
- **Capacity**: the oven takes 6 "points" per day by default (simple cake = 1, detailed = 2,
  showcase = 3). Block a day (festivals, family) or raise/lower a day's limit.
- **Settings**: business details, WhatsApp number, delivery zone fees, UPI VPA, FSSAI number,
  deposit %, quote validity.

## Honest things to finish before real launch (go-live checklist)

Also visible in Studio → Settings:

1. **FSSAI**: add your registration/licence number in Studio → Settings. Until then the site
   doesn't claim anything about FSSAI. Verify your category on FoSCoS — a home bakery selling
   through its own website has specific obligations.
2. **Delivery zones**: seeded with real Mathura pin codes (281001 ₹99, 281003/281004 ₹149,
   281121 Vrindavan ₹199). Confirm the fees are right for you and adjust.
3. **Payments**: checkout runs on a **demo UPI gateway** — money is simulated. To take real money:
   - easiest true-up: put your UPI VPA in Studio → Settings (checkout then offers a direct-UPI
     flow with manual verification in the studio), or
   - proper automation: create a Cashfree (or PhonePe/Razorpay) account, then connect it —
     see `docs/payment-provider-decision.md`. The codebase is built so this is one adapter file
     plus a webhook route.
4. **Studio passcode**: set `STUDIO_PASSWORD` in `.env.local` to something private.
5. **Prices**: the live prices were set as sensible defaults for a Mathura home bakery
   (₹1,050–1,450 per kg by complexity). Change any of them in Studio → Designs. Nothing is
   hard-coded.

## Changing photos

Photos come from the Google Photos album you shared. The watermarked ones were cleaned
(logo removed, gently enhanced) before publishing. To add new cakes later:

1. Put the original photos in `_incoming/b38-photos/` (e.g. `photo-31.jpg`).
2. If they carry the watermark: add their number to `WATERMARKED` in `scripts/clean-photos.py`.
3. Run `py scripts/clean-photos.py && node scripts/media-pipeline.mjs` after adding the new photo
   to the design map in `scripts/media-pipeline.mjs`.
4. Add the design's name/story/price to `content/designs.json`, then `node scripts/seed.mjs`.

## Backups

Copy `data/b38.db` somewhere safe (Google Drive, email to yourself) once a week. That file is
every order, quote and request. Photos live in git + the original album.

## The one rule

The site never pretends: no fake reviews, no fake "X left!" timers, no invented discounts. If a
date is full, it's because the oven is full. Keep it that way — it's why people trust it.
