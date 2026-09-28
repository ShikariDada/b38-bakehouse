# B38 Bake House — V2 Deep-Research Product, Mobile UX, Media, Payments & Technical Build Specification

**Status:** V2 — supersedes the previous B38 Bake House specification wherever the two conflict.  
**Research snapshot:** 20 September 2026.  
**Primary build mode:** an autonomous AI coding agent should be able to execute the project end-to-end from this document.  
**Primary customer device:** mobile web, especially 360–430 px wide phones.  
**Secondary device:** desktop/laptop, treated as an enhancement rather than the source layout.  
**Business objective:** turn B38's real custom-cake craft into a premium, structured, non-negotiable online ordering system without making a small home bakery operate like a large ecommerce company.  
**Visual objective:** make the site feel designed by a strong human art director around B38's real cakes — not like a generated bakery template, a SaaS landing page, or a 3D-tech demo.

> **Important source limitation:** a Google Photos album was supplied for B38's cake archive. The current research environment could resolve the share link to Google Photos but could not fetch the album contents. This document therefore does **not** pretend to have visually inspected those photographs. Instead, it specifies an automated, auditable import/classification/hero-selection workflow so that the implementing agent can process the originals once they are available locally, via an exported ZIP, or through a browser/session that can access the public album. For an image-by-image art-direction audit, ingest the actual files first.

---

# PART I — THE REVISED PRODUCT STRATEGY

## 1. The central product decision

B38 should not be built as a normal “bakery store with some custom cake form.”

It should be built around **two visible commercial worlds**:

### A. Designs
A large, image-first archive of **real cakes B38 has already made**. Customers can browse these as predesigned cakes, select one, choose the allowed options, see an authoritative price, choose a date, and pay.

This is the fast, scalable path. It should eventually account for the majority of routine orders.

### B. Custom Cakes
For a customer who wants something meaningfully different.

Within this, distinguish three levels so the owner never has to explain the same pricing boundary repeatedly:

1. **Personalise a design** — keep the B38 design, alter small bounded details such as name, age, short message, flavour, size, eggless option, perhaps approved palette choices. Price changes automatically.
2. **Customise a design** — start from a B38 cake but change meaningful visual elements: colour language, topper/decor family, motif, layout, selected edible elements, etc. This has a visible customization surcharge/range and may become a quote if complexity exceeds rules.
3. **Bespoke from scratch** — customer brings references or a concept; B38 interprets it; baker approves feasibility and sends a fixed quote.

This taxonomy is not arbitrary. It closely matches the strongest current designer-cake websites. Anges de Sucre explicitly distinguishes “Personalised” (keep the design, add details), “Custom” (change the design) and “Bespoke” (start from a blank page). Butter& makes its existing signature designs heavily configurable while limiting true custom commissions. From Lucie keeps fast online products highly constrained and moves custom work into a separate higher-touch process.

### Why this is better for B38

- The **predesigned archive** turns previous creative work into sellable inventory without reproducing a generic cake catalogue.
- Bounded personalisation gives customers creative control without reopening price negotiation.
- Customisation has an explicit commercial cost instead of becoming “please make this extra thing also.”
- Bespoke work remains a premium commission, not an undefined WhatsApp conversation.
- Every completed bespoke cake can become a future predesigned starting point, compounding the value of the archive.

---

## 2. Benchmark teardown — what the best current cake/bakery sites teach us

The implementation agent must read this section before designing anything. These are **pattern references**, not visual templates to clone.

### 2.1 Butter& — strongest benchmark for productized designer cakes

**Why it matters:** Butter& calls itself a designer cake shop. Its structure is unusually close to B38's actual strength.

Current patterns observed:

- a full collection of signature designs rather than a generic “chocolate / vanilla / black forest” menu;
- each signature design can expose controlled customization such as size, flavour, colour, flower choice and script;
- product pages communicate minimum lead time before the user gets too far;
- a live “Date Availability” system differentiates available, booking-up-fast, limited/quick-turnaround designs, fully booked and closed dates;
- simpler cake families carry shorter lead times;
- truly custom commissions are a separate limited pathway with stronger constraints;
- “How It Works” centralizes size, flavour, ordering, pickup/delivery, availability and policy questions.

**B38 should borrow:**
- make *design* the primary catalogue unit;
- place lead time and availability inside the shopping experience, not only the FAQ;
- permit controlled choices directly on a known design;
- use complexity/lead time as an operational product property;
- create a live availability layer;
- create a quick-turnaround subset once enough designs exist.

**B38 should not borrow blindly:**
- its exact visual style, pricing language or San Francisco fulfillment assumptions.

Source snapshot:
- https://butterand.com/
- https://butterand.com/collections/signature-cakes
- https://butterand.com/pages/date-availability
- https://butterand.com/pages/how-it-works
- https://butterand.com/pages/custom-cakes

### 2.2 Anges de Sucre — strongest benchmark for information architecture

**Why it matters:** its distinction among personalised, customised and bespoke cakes solves almost exactly the ambiguity B38 currently faces.

Observed structure:

- **Personalised:** choose an existing cake; add a name, age, date, short message or photo where offered.
- **Custom:** find a starting cake and request meaningful design changes.
- **Bespoke:** private commission beginning from the event/person rather than a catalogue.
- Bespoke inquiry asks for date, occasion, servings, working budget and delivery area.
- The writing frames budget as a design constraint rather than an invitation to bargain.
- “Starting from scratch?” is explicitly routed away from normal catalogue shopping.

**B38 should borrow:**
- the conceptual boundary between personalisation, customisation and bespoke;
- a custom flow that begins with an existing B38 design where possible;
- a bespoke brief that begins with the person/occasion, not a blank “describe cake” textarea;
- clear minimum/lead-time/capacity boundaries.

Source snapshot:
- https://www.angesdesucre.com/pages/personalised-cakes-london
- https://www.angesdesucre.com/pages/custom-cakes-london
- https://www.angesdesucre.com/pages/bespoke-cakes

### 2.3 From Lucie — strongest benchmark for saying “no” cleanly

Observed structure:

- website orders are the fastest route for standard cakes;
- online cakes are deliberately constrained;
- custom cakes are a separate higher-value workflow with a published minimum and lead time;
- sold-out/short-notice capacity is treated as a hard operating reality, not something staff silently absorb.

**B38 lesson:** a premium brand becomes stronger when constraints are clear. The website should not promise every possible request.

Source:
- https://fromlucie.com/pages/faqs

### 2.4 Milk Bar — useful product-detail benchmark

Use as a reference for **media sequencing and product certainty**, not as a brand aesthetic.

Useful pattern:
- a product is shown from multiple visual states: complete cake, side, overhead/detail, interior/layers, packaging and/or process;
- the internal layer structure is part of selling taste, not only decoration;
- fulfillment/date information is integrated into the product flow.

**B38 lesson:** for decorated cakes, show both **appearance** and **what is inside**. A real slice/cut reveal is commercially more useful than a gimmicky interactive knife.

### 2.5 Pierre Hermé — useful luxury restraint benchmark

Useful patterns:
- the product itself is the visual hero;
- categories and fulfillment methods are explicit;
- dense commerce can still feel premium when imagery, hierarchy and whitespace are controlled;
- sensory copy is secondary to the product photography and product name.

**B38 lesson:** premium does not require cinematic effects on every screen.

Source:
- https://www.pierreherme.com/en/
- https://www.pierreherme.com/en/pastries.html

### 2.6 Ladurée — useful gifting/configuration benchmark

Useful pattern:
- composition/customization exists inside a strict brand system;
- the customer is given choice without making the interface feel like a raw form.

**B38 lesson:** options should feel curated and visual, not like an ERP dropdown list.

### 2.7 Flour Shop — useful lesson in owning one signature idea

Flour Shop is visually much louder than B38 should be, but it demonstrates the power of a signature product identity rather than anonymous product cards.

**B38 lesson:** if one or two B38 cake styles become locally recognizable, give them names and a strong collection identity.

Source:
- https://flourshop.com/

### 2.8 Theobroma — Indian expectation benchmark, not art-direction benchmark

Current catalogue behavior is useful for:
- immediate INR prices;
- dense cake discovery;
- eggless distinctions;
- allergen visibility;
- direct “order online” language.

**B38 lesson:** Indian mobile customers should never have to hunt for price, eggless availability or ordering action.

Source:
- https://theobroma.in/collections/cakes

### 2.9 Torrance Bakery / Island Cart — functional 3D precedent

Torrance Bakery uses an interactive cake-builder flow; Island Cart markets a 3D Cake Builder built around actual bakery attributes such as size, flavour, fillings/icing and decoration.

**This proves one thing:** 3D is not inherently “just a showcase.” It becomes commercially useful when it is a **configuration instrument that maps directly to buildable choices and prices**.

Source:
- https://www.torrancebakery.com/
- https://www.islandcart.com/3d-cake-builder/

### 2.10 Vectary Memotics cake configurator — mobile-first 3D precedent

A documented cake configurator case study used a multi-step 3D customizer, floating controls, order action, saved image and a mobile-first experience. The original unoptimized Blender assets were too large, so optimization was a core part of the implementation.

**B38 lesson:** interactive 3D can work, but asset optimization and scope discipline determine whether it belongs in ecommerce or only in a demo.

Source:
- https://www.vectary.com/memotics-3d-cake-configurator/

---

## 3. Benchmark synthesis — what B38 should actually become

Do **not** copy a single reference site.

Combine:

- **Butter&:** productized designer-cake catalogue + live availability.
- **Anges de Sucre:** Personalise / Customise / Bespoke mental model.
- **From Lucie:** capacity boundaries.
- **Milk Bar:** product media that sells both appearance and interior.
- **Pierre Hermé:** restraint and product-first luxury.
- **Theobroma:** Indian ecommerce clarity.
- **Torrance/Island Cart:** 3D only where it clarifies real configuration.

The resulting B38 website should feel like:

> **a mobile-first design archive that happens to be directly orderable.**

Not:
- a restaurant menu;
- a generic ecommerce grid;
- an Instagram clone;
- a wedding planner;
- a 3D experiment.

---

# PART II — MOBILE-FIRST EXPERIENCE ARCHITECTURE

## 4. Mobile is the source design

The agent must design all high-value customer paths at **390 × 844** first.

Also test:
- 360 × 800
- 375 × 812
- 393 × 852
- 430 × 932
- 768 × 1024
- 1440 × 900
- 1920 × 1080

Desktop may introduce:
- larger editorial crops;
- side-by-side layouts;
- hover affordances;
- sticky configuration columns;
- richer motion;
- multi-column archive views.

Desktop may **not** introduce a completely different mental model.

### 4.1 Mobile constraints

- Primary interactive targets: 44–48 px minimum practical target height.
- Use `100svh`/`100dvh` carefully; do not let mobile browser chrome break hero composition.
- Respect safe-area insets.
- Inputs and bottom CTAs must remain accessible when the software keyboard opens.
- Never require hover.
- No tiny image labels over busy photography.
- No horizontally trapped configurator.
- No 12-field custom cake form shown at once.
- Avoid heavy sticky headers; ~56–64 px total is enough.
- Critical payment CTA should not sit below a giant policy block.
- Use bottom sheets for filters/secondary selectors where appropriate.
- Persist form state through navigation, refresh and upload failures.
- Back should mean back, not restart.

### 4.2 Mobile customer flow target

For a predesigned cake:

```text
Instagram / WhatsApp / Google
→ landing or cake page
→ inspect real images
→ choose size / flavour / personalisation
→ choose date
→ fulfilment
→ price locked
→ UPI intent / gateway checkout
→ automatic confirmation
```

For a custom cake:

```text
Custom Cake
→ choose “start from B38 design” or “bring my own idea”
→ visual brief in short steps
→ date / size / flavour / budget
→ submit
→ quote link
→ review exact specification
→ pay locked amount
```

### 4.3 Mobile navigation

Default:

```text
[B38 mark]                 [Menu]
```

Bottom or hero CTAs should do the commercial work. Do not squeeze five nav labels across a phone.

Menu:
- Designs
- Custom Cake
- How It Works
- About
- Track Order
- Contact / WhatsApp

On cake pages, the bottom action bar can show:

```text
From ₹1,850               [Choose options]
```

After choices:

```text
₹2,240                    [Choose date]
```

At checkout:

```text
Total ₹2,240              [Pay ₹2,240]
```

### 4.4 Mobile catalogue

Default mobile layout:
- 1 large editorial featured design;
- then a 2-column grid where each image remains large enough to evaluate decoration;
- allow one-column list toggle only if descriptions become important.

Top:
- title
- date/occasion shortcut
- compact filter button
- horizontal applied-filter chips

Filters should prioritize **cake-relevant attributes**, not generic ecommerce taxonomy:
- Date availability
- Occasion
- Style
- Colour family
- Serving range
- Price
- Eggless
- Quick turnaround

If the archive becomes large, date should become a powerful early filter:
**“When do you need it?”**

### 4.5 Mobile product page

Sequence:

1. Hero photo/video poster.
2. Swipe media gallery with visible `1 / 6`.
3. Name + starting price + lead time.
4. “Available for your date?” prompt.
5. Size/servings.
6. Flavour.
7. Personalisation.
8. Optional design-level customisation link.
9. fulfillment.
10. price summary.
11. sticky CTA.

Do not place every option inside separate rounded cards. Use typography, thin rules and radio/tile controls.

### 4.6 Mobile checkout research rules

Current ecommerce usability research continues to show that mobile checkout frequently underperforms. For B38:

- no customer account requirement;
- total/order summary always accessible;
- explain why phone is required (delivery/order coordination);
- clearly mark optional fields;
- prefer “Delivery date / pickup date” over abstract shipping speed;
- present the most likely payment method first;
- do not show a wall of payment logos;
- use specific action labels such as `Pay ₹2,240`, not `Continue`;
- error copy must say exactly how to recover.

Research reference:
- https://baymard.com/research-articles/current-state-of-checkout-ux
- https://baymard.com/learn/payment-ux

---

# PART III — THE PUBLIC PRODUCT TAXONOMY

## 5. Customer-facing language

Keep the top navigation simple:

### Designs
“Cakes B38 has already made — choose one and make it yours.”

### Custom Cake
“Start from a B38 design or bring your own reference.”

Inside the flows, expose the distinction:

#### Personalise
Keep the core design. Change permitted details.

#### Customise
Change the visual design meaningfully. Extra design charge may apply.

#### Bespoke
Start from scratch. Fixed quote after review.

Do **not** force customers to learn industry vocabulary before browsing. Explain only when the distinction matters.

---

## 6. Predesigned Designs — this should be a major first-class section

The user specifically asked for a large number of predesigned cakes. This is correct strategically.

Every eligible past B38 cake should be converted into a **design record**, not merely placed in a gallery.

A design can be:
- directly orderable;
- directly orderable with personalisation;
- “customise this” starting point;
- inspiration-only;
- temporarily unavailable;
- seasonal;
- quick-turnaround.

### 6.1 Design identity

Use names that help recall/search, not fake luxury names for everything.

Examples of naming structures:
- `Vintage Heart — Burgundy`
- `Pastel Garden`
- `Football 10`
- `Blue Bow`
- `Minimal Gold`
- `Chocolate Texture`
- `Princess Pink`
- `Photo Cake — Floral`

If the original customer’s name is visible, create a public-safe name and crop/retouch only with permission.

### 6.2 Every design record needs

- cover image
- 3–8 supporting images if available
- optional short making clip
- direct-order status
- starting price
- current variant prices
- servings/weights
- flavour compatibility
- egg/eggless rules
- minimum lead time
- capacity points
- allowed personalisation
- allowed customisation
- customisation surcharge logic
- style tags
- occasion tags
- colour family
- visual elements
- internal production notes
- media permission status

### 6.3 “Make this yours” controls

For eligible designs:
- size
- flavour
- eggless
- message/name
- age
- palette preset
- topper yes/no
- candle/add-on
- delivery/pickup

For advanced changes:
- `Customise this design` opens a new brief already containing the design ID and current choices.

### 6.4 Do not duplicate variants in the browse grid

If a design exists in 4 colours, do not necessarily create four identical cards. Use one design entry with:
- 3 small alternate thumbnails;
- a colour-family indicator;
- maybe “5 versions made.”

This is particularly useful as B38’s archive grows.

### 6.5 “Recently made” and “Most requested” are separate

`Recently made` = chronological proof.  
`Most requested` = actual order count or owner-curated repeat designs.

Never call something “trending” unless it is based on data or explicitly owner-curated as a campaign.

---

## 7. Personalisation pricing

For bounded personalisation, price must be deterministic.

Possible rule types:

```text
Custom short message: included / +₹X
Name topper: +₹X
Age topper: +₹X
Edible photo: +₹X
Approved palette change: included / +₹X
Fresh-flower variant: +₹X
Premium chocolate/decor: +₹X
Eggless: +₹X or included
Size/servings: variant price
Rush: +₹X / percentage
Delivery: zone fee
```

The customer should see every increase immediately.

Do not use:
“extra charges may apply” if the system already knows the charge.

---

## 8. Customise-an-existing-design pricing

Not all changes can be captured with checkboxes.

Use a hybrid system.

### Tier C1 — deterministic
The owner has pre-approved the change and a price rule exists.

Example:
- change palette among defined palettes;
- add a topper family;
- add simple fondant figures;
- add edible print.

Price updates instantly.

### Tier C2 — review required
The customer wants structural or thematic changes.

Show:
- base design price;
- **custom design fee from ₹X** if owner is comfortable publishing it;
- final fixed quote before payment.

The flow must explicitly say:
“Your starting cake is ₹1,850. Design changes are quoted after review.”

This anchors the price without pretending the final work is known.

---

## 9. Bespoke pricing

A blank-slate design is a commission.

Bespoke brief should capture:
- person/event
- occasion/date
- servings
- flavour
- eggless
- references
- must-keep details
- elements B38 may reinterpret
- colour direction
- text/name/age
- delivery
- budget band

Budget bands should be based on B38’s actual economics, not invented by the agent.

Better wording:
**“What range should we design within?”**

This frames budget as a design constraint, not a bargaining request.

---

# PART IV — HERO, VIDEO AND 3D STRATEGY

## 10. Should the homepage have a rotating/dropping/cutting 3D cake?

### Short answer

**A real-time 3D cake with drop physics and an interactive cut should not be the default homepage hero for V1.**

It could look impressive in a portfolio case study, but for this business it has three risks:

1. **Authenticity risk:** B38 wins because it can physically make beautiful custom cakes. A synthetic 3D cake does not prove that.
2. **Mobile performance risk:** the homepage is primarily a mobile acquisition surface. Heavy WebGL, textures and libraries can damage LCP/INP and make the product feel slower.
3. **Novelty risk:** “cake drops, spins, cuts” can turn the site into a creative-development demo. The customer’s job is to decide “Can these people make the cake I want?” and then order.

### But 3D is not rejected

Use it where interaction has a business purpose.

The best hierarchy is:

#### Recommended homepage hero — real cinematic cake reveal
Use actual B38 work.

#### Optional product-detail enhancement — interactive real cake spin
24–36 captured angles or a lightweight orbit clip.

#### Phase 2 — real 3D configurator
Use 3D for buildable configuration, where changing components corresponds to actual prices/options.

#### Avoid — procedural 3D showpiece pretending to be real B38 work
It can be an art experiment, never proof of the bakery’s portfolio.

---

## 11. Hero format decision matrix

| Format | Authenticity | Mobile performance | Conversion usefulness | Production effort | Risk of feeling gimmicky | B38 decision |
|---|---:|---:|---:|---:|---:|---|
| Single excellent real photo | Excellent | Excellent | High | Low | Very low | Required fallback |
| Real 6–10s cinematic video | Excellent | Good if poster-first | Very high | Medium | Low | **Recommended default** |
| Real 24–36-frame cake spin | Excellent | Medium-good | High | Medium | Low-medium | Optional |
| `<model-viewer>` scanned/modelled real cake | High if accurate | Medium | Medium-high | High | Medium | Phase 2 |
| 3D cake configurator | High usefulness if buildable | Medium | **Very high for custom options** | High | Medium | Phase 2/3 |
| Procedural 3D cake drop/cut physics | Low proof value | Low-medium | Low | High | **High** | Not default |
| AI-generated cake animation | Low portfolio credibility | Variable | Low | Medium | High | Concept-only |

---

## 12. Recommended B38 homepage hero — exact concept

### Creative idea: “From detail to whole cake”

Not a generic lifestyle montage.

#### Mobile sequence, 5–7 seconds
1. 0.0–1.4s — macro crop of frosting/design detail.
2. 1.4–3.2s — hand placing or finishing one recognizable element.
3. 3.2–5.2s — full cake rotates slightly / camera orbits.
4. 5.2–6.5s — clean final hero frame with enough negative space.

Loop should be seamless or pause briefly on the final state.

Headline remains HTML, never baked into the video.

### Desktop sequence
Can use a 7–10s wider edit:
- close detail
- piping/placement
- orbit
- finished cake
- optional slice/interior cut in a later section, not necessarily hero

### Why this is better than a fake 3D drop
It communicates:
- design detail;
- actual craftsmanship;
- human making;
- finished quality.

The hero is still visually memorable, but every frame is evidence.

---

## 13. Mobile hero implementation requirements

Initial HTML:
- headline
- CTA
- optimized poster image

Do **not** make the user wait for video before LCP.

Implementation:

```html
<video
  muted
  playsinline
  loop
  preload="none"
  poster="/media/hero-poster.avif"
  aria-hidden="true"
>
  <source src="/media/hero-mobile.webm" type="video/webm" />
  <source src="/media/hero-mobile.mp4" type="video/mp4" />
</video>
```

Behavior:
- poster is the first meaningful render;
- load video after LCP / idle / visibility;
- do not autoplay when `prefers-reduced-motion`;
- if data saver or constrained connection is detected, remain on poster;
- never autoplay audio;
- mobile video should be separately encoded/cropped, not desktop video squeezed down.

Performance references:
- https://web.dev/learn/performance/video-performance
- https://web.dev/articles/lazy-loading-video

---

## 14. If a real interactive spin is desired

Prefer an authentic **turntable spin** before full 3D.

### Capture method A — video
- put cake on a simple turntable/lazy Susan;
- locked camera;
- diffused light;
- warm neutral seamless background;
- slow 360° rotation;
- 4K source if phone supports it;
- edit to 4–6 seconds;
- export mobile 720/1080 and desktop 1080 variants.

### Capture method B — frame spin
- 24 or 36 evenly spaced images;
- same light/camera;
- user drags horizontally to rotate;
- preload only first few frames;
- fetch remaining frames after interaction or idle;
- offer normal swipe gallery fallback.

Frame spin can feel like 3D while remaining completely faithful to the actual cake.

---

## 15. If true 3D is implemented

Use it on a selected design/configurator, not the initial LCP hero.

### Technology
Prefer:
- GLB / glTF
- `<model-viewer>` for simple product exploration
- Three.js / React Three Fiber only if the configurator genuinely exceeds `<model-viewer>` capabilities

### Loading pattern
- static poster first;
- lazy-load the 3D library;
- `reveal="manual"` or equivalent;
- download model only after user taps `Explore in 3D` or after the component is well below fold;
- preserve vertical page scrolling with touch action;
- static fallback.

`<model-viewer>` itself documents poster/manual-reveal and deferred loading as the way to preserve mobile Lighthouse performance.

References:
- https://modelviewer.dev/examples/loading/
- https://modelviewer.dev/examples/lighthouse.html
- https://modelviewer.dev/examples/lighthouse2.html

### Asset budgets
Target per model:
- initial poster: <150–250 KB where visual quality permits;
- core GLB: ideally <2–4 MB for mobile;
- texture resolution appropriate to screen, not 8K by default;
- compressed geometry/textures;
- no expensive bloom/post-processing as a default;
- no continuously running scene when offscreen.

### “Cut cake” interaction
If used, make it informative:
- toggle `Whole` / `Inside`;
- transition to a cross-section showing actual sponge/filling structure;
- optionally change cross-section as flavour changes.

This supports taste and configuration.

Do **not** make the customer drag a virtual knife unless it tests exceptionally well; that is entertainment with little buying value.

---

## 16. 3D cake configurator — Phase 2 product definition

A commercially justified configurator can expose only things B38 can actually produce.

Possible layers:

1. form: round / heart / square / tier count;
2. size;
3. base finish;
4. palette;
5. piping family;
6. edible image;
7. topper family;
8. flowers/chocolate/fruit;
9. message;
10. flavour/layer cross-section.

Every configurable visual option must map to:
- a real production option;
- a price rule or quote rule;
- a lead-time impact;
- a capacity impact.

Output:
- configuration ID;
- snapshot PNG;
- structured JSON of selected components;
- price if deterministic;
- quote request if not;
- `Concept preview — handmade result will vary naturally.`

3D must reduce ambiguity, not create impossible expectations.

Real-world precedents:
- Island Cart / Torrance Bakery 3D Cake Builder
- Vectary Memotics mobile-first cake configurator

---

# PART V — MEDIA LIBRARY AND GOOGLE PHOTOS INGESTION

## 17. Source audit status

Provided source:
`https://photos.app.goo.gl/jfEWzpfVn3tBwkco8`

The current research environment could not fetch the Google Photos album after it redirected to `photos.google.com`. Therefore:

- no cake-specific visual claims in this document are based on unseen album images;
- the agent must not hallucinate categories or quality;
- the next implementation step is to ingest the source assets.

Best input:
1. owner exports/downloads album originals as ZIP; or
2. implementing agent with browser access downloads originals; or
3. owner uploads originals directly to project storage.

Never hotlink Google Photos thumbnails in production.

---

## 18. Automated photo-ingestion pipeline

Create:

```text
/incoming/b38-photos/
/media-workbench/
/scripts/media/
  ingest.py
  dedupe.py
  score.py
  classify.py
  build-contact-sheet.py
  derive-images.py
  build-hero-video.py
/media-manifest.json
```

### 18.1 Ingestion
For each original:
- hash SHA-256;
- perceptual hash;
- width/height;
- orientation;
- file size;
- capture date if available;
- strip GPS from published derivatives;
- preserve original privately.

### 18.2 Duplicate detection
Identify:
- exact duplicate;
- near duplicate;
- burst/angle family;
- screenshot of same image;
- WhatsApp-compressed duplicate.

Prefer highest-quality original.

### 18.3 Quality scoring
Agent may compute/estimate:
- resolution;
- blur/sharpness;
- highlight clipping;
- exposure;
- white-balance consistency;
- subject occupancy;
- background distraction;
- crop safety;
- visible hands/people;
- visible customer name/private data;
- watermark/text;
- screenshot UI.

Do **not** let a numeric score auto-publish an image. It creates a ranked review queue.

### 18.4 Visual classification
Use an image-capable model locally/API only if permitted.

Suggested tags:
- occasion
- cake shape
- tier count
- dominant colour family
- style family
- flowers
- chocolate
- fondant elements
- edible image
- cartoon/character
- minimal
- vintage piping
- kids
- corporate
- wedding/engagement
- bento
- photo cake
- text/name visible
- person visible
- kitchen/process visible
- full cake / detail / slice / packaging

### 18.5 Human-safe publication tiers
Each asset:
- `hero_grade`
- `catalogue_grade`
- `detail_grade`
- `process_grade`
- `reference_only`
- `private`
- `reject`

### 18.6 Focal points and derivatives
Generate:
- 4:5 catalogue
- 1:1 social/detail
- 3:2 desktop editorial
- 16:9 wide
- 9:16 story/mobile hero candidate

Formats:
- AVIF
- WebP
- JPEG fallback if needed

Never stretch.

### 18.7 Privacy
If an image visibly contains:
- customer face;
- phone/address;
- private chat;
- full name on a cake intended to remain private;

mark it for permission/review before public use.

---

## 19. Automated content extraction from the photo archive

The agent should create a draft catalogue, not force the owner to enter 100 cakes manually.

For each visually distinct design cluster:
- assign a draft design name;
- choose best cover candidate;
- group alternate angles;
- suggest tags;
- identify text that should be anonymized;
- suggest `direct_order`, `personalise`, `customise`, or `inspiration_only`;
- leave price blank until owner rule mapping exists.

Generate:
- `draft-designs.json`
- contact sheet PDF/HTML
- owner review UI in `/studio/import`

Owner can approve/merge/edit in batches.

---

## 20. Hero-media creation workflow from existing photos

If there is no good video yet, the agent can create a **temporary real-photo film**.

Rules:
- use only real B38 photos;
- do not synthesize missing cake surfaces;
- do not animate frosting/objects with generative video and present it as real;
- deterministic pans/crops are okay.

### Temporary stills film
Input:
- 3–5 top photos from one coherent cake or a very coherent set.

Edit:
- 6–8 sec total;
- subtle 3–6% Ken Burns movement;
- one macro → whole-cake transition;
- no flashy speed ramps;
- no template transitions;
- no text baked into video.

Exports:
- `hero-mobile-1080x1350.mp4/webm`
- optional `hero-mobile-1080x1920.mp4/webm`
- `hero-desktop-1920x1080.mp4/webm`
- poster AVIF/WebP

Use FFmpeg scripts committed to the repo so outputs are reproducible.

---

## 21. New-shoot workflow — recommended before launch

The best website upgrade may cost less than the developer time spent faking richer visuals: shoot 3–5 excellent cakes intentionally.

### Minimal equipment
- modern phone with good main camera;
- tripod;
- white/warm-neutral backdrop;
- diffused window light or softbox;
- inexpensive cake turntable/lazy Susan;
- white/black foam board for bounce/negative fill.

### For each hero-grade cake
Capture:
1. 3/4 still
2. straight still
3. top/elevated still
4. macro detail
5. hand placing detail
6. 360° turntable video
7. box/packaging
8. slice/interior if appropriate

### Video clips
- 5–8 seconds each;
- stable;
- one action only;
- no music embedded;
- no autofocus hunting;
- preserve natural food texture.

This gives the website material for years of design variations.

---

# PART VI — HOME PAGE V2

## 22. Mobile homepage wireframe

```text
┌──────────────────────────────┐
│ B38                       ☰  │
├──────────────────────────────┤
│ Custom cakes, made around    │  small kicker
│ your idea.                   │
│                              │
│ Bring the reference.         │
│ We'll make it yours.         │  Newsreader
│                              │
│ [Order a cake]  See designs  │
│                              │
│ [REAL B38 HERO MEDIA]        │
│ poster → lightweight video   │
└──────────────────────────────┘

Recently made
[ large editorial image ]
[ img ] [ img ]
[ img ] [ img ]

Find your cake
[Birthday] [Anniversary] [Kids] [...]
When do you need it?
[ Select date ]

Two ways to start
1. Choose a B38 design
2. Build something custom

Selected designs
[ two-column image archive ]

How B38 interprets a reference
[reference / real result if permission exists]
small specific copy

Made by hand
[process video strip]

What’s inside
[cut/slice visual + flavour text]

Customer story
[real cake + real review]

Seasonal collection / offer

How ordering works
01 choose
02 personalise/customise
03 date + pay / quote

FAQ
Footer
```

### Mobile first-screen objective
Within the first ~1.1–1.4 viewports, the user should know:
- B38 makes custom/design-led cakes;
- it can start from their reference;
- there are existing designs to buy;
- there is an obvious ordering action.

Do not make users watch the hero before they understand this.

---

## 23. Desktop homepage

Desktop may use asymmetry:

Hero:
- copy ~40–45%
- media ~55–60%
- media edge can intentionally break grid slightly
- no browser-mockup framing

Below:
- editorial image grid, not equal cards;
- use one large vertical image + smaller detail images;
- more whitespace;
- short process film strip;
- sticky/crossing text only if accessibility/performance remains strong.

Avoid an overdesigned scroll narrative. This is still commerce.

---

## 24. Homepage proof sequence

The order of persuasion matters:

1. **Capability:** beautiful actual cake.
2. **Choice:** existing designs.
3. **Personal relevance:** “start from your reference.”
4. **Craft:** process.
5. **Taste:** interior/flavours.
6. **Trust:** real testimonials.
7. **Operational certainty:** how to order, lead time, payment.
8. **Offer:** seasonal promotion if active.

Do not lead with “hygiene” as a fear-driven claim. Show a clean process visually and publish only verifiable hygiene/FSSAI details.

---

# PART VII — CAKE DETAIL / ORDERING

## 25. Product-media choreography

A strong cake product page should usually contain:

1. hero full cake;
2. alternate angle;
3. close design detail;
4. overhead/side;
5. process clip;
6. slice/interior if available;
7. packaging/scale reference.

The media rail should answer:
- what exactly will it look like?
- how detailed is the work?
- what is inside?
- what size does it feel like?

---

## 26. Date before deep configuration

For a local made-to-order bakery, availability is not shipping stock.

Recommended:
- user can browse without date;
- after choosing a design, ask date early;
- if unavailable, show nearest dates or designs with shorter lead time;
- preserve selected options when date changes.

Add a `Quick turnaround` collection only when operational data supports it.

---

## 27. Orderable design page — mobile sequence

```text
[media gallery]
Name
From ₹X · X days notice
[Check date]

Size / serves
Flavor
Egg / eggless
Personalise
  message
  age/name
  allowed palette
Add-ons
Pickup / delivery

Price breakdown
[Continue — ₹X]
```

Under:
- “Want to change the design itself?” → `Customise this cake`
- similar designs
- allergen note
- policy

---

# PART VIII — CUSTOM CAKE FLOW V2

## 28. Entry screen

Use two large image-backed choices:

### Start from a B38 design
Best for customers who have seen something B38 has already made.

### Bring my own idea
Upload references or describe the person/event.

Small tertiary:
`I only need to personalise a design` → Designs.

---

## 29. “Bring my own idea” mobile steps

Do not label 9 screens “Step 1 of 9” if it feels bureaucratic. Use a subtle progress line and contextual titles.

### A. Occasion
- birthday / anniversary / etc.
- date
- person/event

### B. References
- upload 1–5
- camera/gallery
- reorder
- annotate “I like this part”

### C. What matters
- must keep
- can reinterpret
- avoid

### D. Size/taste
- servings
- flavour
- eggless
- allergies note

### E. Visual direction
Use actual B38 examples once archive is tagged:
- minimal
- floral
- vintage piping
- character
- chocolate
- photo/printed
- etc.

### F. Details
- name
- age
- message
- topper

### G. Budget range
Owner-defined ranges.

### H. Fulfillment
- pickup/delivery
- address/zone
- preferred window

### I. Review
Contact sheet + exact written brief.

CTA:
`Send for a fixed quote`

---

# PART IX — PAYMENT RESEARCH V2

## 30. The key correction from V1

**Static/direct UPI should NOT be the normal website checkout.**

The user's concern is correct:

A plain merchant QR / VPA often lets the payer enter the amount, and a raw payment screenshot/UTR creates manual reconciliation work. That weakens both the no-bargaining goal and operational automation.

The correct normal checkout is:

> **server-created order → fixed-amount UPI intent or dynamic QR through a payment provider/acquiring bank → signed server callback/webhook → automatic exact-amount confirmation.**

This preserves UPI convenience without creating a manual bank-checking workflow.

---

## 31. Static QR vs dynamic QR — exact distinction

### Static merchant QR
- same QR reused;
- customer often enters amount;
- order identity may be weak;
- auto reconciliation can be difficult without additional merchant tooling;
- poor fit for B38 website checkout.

### Dynamic QR
- unique to the order;
- exact amount pre-defined;
- customer scans and authorizes;
- gateway/acquirer associates payment with order;
- backend receives status/callback/webhook;
- excellent fit for desktop checkout.

### UPI Intent
- best mobile flow;
- site opens the installed UPI app;
- transaction details/amount are created from the server order;
- user authorizes rather than retyping amount;
- gateway status is tied back to order.

### Payment link
- useful for quote links/WhatsApp assisted sales;
- amount/order fixed at creation;
- same gateway reconciliation advantages.

---

## 32. Proof that amount locking is practical

Current provider documentation explicitly supports this:

### Cashfree
Cashfree describes its Dynamic QR as unique per transaction with a **pre-defined fixed amount**; its public UPI page states customers can only pay the assigned fixed amount.

Source:
https://www.cashfree.com/upi-payment-gateway/

### Razorpay
Razorpay QR entities expose `fixed_amount=true` and `payment_amount`; the docs state amounts lower or higher than the specified amount are not allowed.

Source:
https://razorpay.com/docs/api/qr-codes/entity/

### Paytm
Paytm Dynamic QR documentation states the merchant controls the order amount and the user cannot change it; transaction confirmation can arrive through server-to-server callback/status API.

Sources:
https://business.paytm.com/docs/dynamic-qr-code-payments
https://business.paytm.com/docs/callback-and-webhook/

This directly solves the bargaining/reconciliation concern.

---

## 33. Payment provider market scan — September 2026

### Important interpretation rule
The table distinguishes **published gateway/platform fee marketing** from the **underlying statutory/payment-instrument MDR**. India’s UPI framework changes on 15 October 2026. A provider advertising “0% platform fee” may still need to pass through payment-instrument MDR depending on merchant category and its commercial agreement.

Therefore the agent must **never hard-code these rates into product economics**. Revalidate inside the actual B38 merchant onboarding flow.

| Provider / route | Public pricing or offer observed | Fixed amount + automation | Fit for B38 | V2 position |
|---|---|---|---|---|
| **Cashfree** | Current new-merchant campaign: 0% platform fee on first ₹20L cumulative eligible GMV; campaign advertised through 31 Mar 2027; standard 1.95% + taxes after offer. Fair-use terms apply. | UPI Intent + Dynamic QR; unique amount; webhooks/status APIs | Excellent | **First provider to test** |
| **PhonePe PG** | Standard displayed around 1.99%; current “Free*” Super Savings offer; exact offer duration/eligibility must be confirmed | UPI-first PG, intent; normal gateway confirmation | Excellent | **Second onboarding comparison** |
| **Razorpay** | New eligible merchants: 0% platform fee for 90 days or ₹5L cumulative GMV, whichever first; ₹199 + tax KYC fee; standard ~2% + tax after | Fixed-amount single-use QR, orders, webhooks | Excellent docs | **Strong fallback** |
| **Paytm PG** | Public pricing/UPI terms must be rechecked after new MDR takes effect | Dynamic QR explicitly amount locked; S2S callbacks/webhooks | Strong | Test if onboarding/commercials are good |
| **Zoho Payments** | UPI platform fee published at 0.5% + GST; cards/netbanking 2%; no setup/annual | UPI QR/intent + online checkout | Very attractive long-term published UPI fee | **Get an account quote/test** |
| **Easebuzz** | Publicly says pricing starts around average 1.5%, varies by mode/category/volume; no setup/API/sandbox/dashboard/support fee | Full PG | Good candidate | Ask exact UPI + card quote |
| **PayKun** | UPI/debit/netbanking/wallet around 1.75%; credit cards ~2%; GST extra; no setup/AMC | PG/payment link | Acceptable | Cost fallback, verify product maturity/support |
| **PayU** | Typical public domestic gateway rate around 2%; commercial terms can vary | Mature PG | Good technically | Not cost leader for B38 unless quoted lower |
| **CCAvenue** | Standard online platform fee ~2% + GST; no setup | Mature PG | Fine | Not cost leader |
| **Instamojo** | Physical-goods transaction fee ~2% + ₹3 + GST | PG/payment links | Easy but costly | Not preferred |
| **SabPaisa** | Some prepaid/annual plans advertise lower headline rates; exact per-mode terms required | PG | Could matter at higher GMV | Do a break-even only after real quote |
| **Airpay** | Mode-specific public pricing has historically ranged lower than 2% for some methods; rental/other terms may exist | PG | Quote required | Secondary research |
| **Decentro** | Public small-merchant transaction price not obvious; strong API/dynamic QR/reconciliation product | Excellent API infrastructure | Potentially strong | Ask for quote/onboarding |
| **Worldline** | Enterprise/acquirer strength; public SMB pricing not clear | Strong | likely overkill initially | Quote only |
| **Stripe India** | Domestic cards around 2%; invite/onboarding constraints; not UPI-cost-led | Strong cards/API | Poor fit for local UPI-first bakery | Do not choose by default |
| **Bank-acquirer dynamic QR** | Can be extremely low-cost; exact current MDR depends on bank/merchant/new UPI regime | Dynamic QR + bank-side confirmation/API may exist | **Potentially best long-term UPI economics** | Investigate seriously |

### RBI authorization sanity check
Before onboarding an aggregator, verify current RBI authorization/status rather than relying on a marketing page. RBI’s published authorized online PA list includes providers such as Cashfree, Decentro, Razorpay, SabPaisa, Stripe, Worldline and Zoho among many others.

RBI reference:
https://www.rbi.org.in/  
Search/current list: “Approved / Authorised Entities — Payment Aggregators Online”

---

## 34. Current promotional details worth exploiting

### Cashfree — strongest published launch promotion found
At the 20 Sep 2026 research snapshot, Cashfree’s pricing page says:
- eligible new merchants signing up/activating during the campaign receive zero platform fee for first ₹20,00,000 cumulative GMV;
- campaign advertised through 31 Mar 2027;
- default T+1 settlement during campaign;
- standard 1.95% + applicable tax after offer;
- offer can be withdrawn under stated fair-usage conditions, including high credit-card share;
- one offer per PAN/bank account.

**Caveat:** its own pricing text also distinguishes platform fees from payment-instrument fees. Because statutory UPI MDR changes on 15 Oct 2026, obtain written/merchant-dashboard confirmation of the **all-in UPI fee**.

Source:
https://www.cashfree.com/payment-gateway-charges/

### PhonePe
Current public page shows:
- standard ~1.99% struck through;
- `Free*` Super Savings offer;
- zero setup;
- zero annual maintenance.

The public page is less explicit than Cashfree about the exact benefit ceiling in the fetched snapshot. Confirm actual merchant T&C before selecting it.

Source:
https://www.phonepe.com/business-solutions/payment-gateway/pricing/

### Razorpay
Current published 2026 offer:
- eligible new accounts activated on/after 1 Jul 2026;
- 0% platform fee;
- first 90 days or ₹5,00,000 cumulative GMV, whichever comes first;
- ₹199 + tax KYC processing fee not waived;
- standard pricing resumes afterwards.

Source:
https://razorpay.com/blog/  
Search: “0% Platform Fee Offer: 90-Day Guide for New Merchants (2026)”

---

## 35. The October 2026 UPI rule changes — do not ignore this

The Ministry of Finance clarified on 15 Sep 2026 that:
- P2P UPI remains free;
- P2M payments up to ₹2,000 remain zero-MDR;
- small merchants covered by the zero-MDR framework remain exempt;
- specified P2M transactions above ₹2,000 will attract 0.4% MDR;
- Reuters reports the new regime takes effect 15 Oct 2026 and includes a ₹300 cap, with a small-merchant QR exemption described around merchants receiving up to ₹1 lakh/month;
- consumers are not to be charged the MDR.

For B38 this means:
- if the business remains inside a qualifying small-merchant exemption, direct/acquirer UPI may remain extremely cheap;
- if it crosses the threshold, there may still be only a relatively small UPI payment-instrument cost compared with a 1.5–2% generic gateway fee;
- gateway promotions need to be interpreted against the new statutory fee.

Government source:
https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310586&lang=1&reg=3

Reuters:
https://www.reuters.com/world/india/india-payments-authority-sets-04-fee-upi-merchant-payments-above-2000-rupees-2026-09-15/

---

## 36. Bank dynamic-QR route — a deeper low-cost option

This is the most important extra research beyond normal PG comparisons.

Banks/acquirers can offer merchant dynamic QR and sometimes APIs/callbacks without a generic 2% ecommerce gateway layer.

### HDFC SmartHub Vyapar
Current page describes:
- static and dynamic QR;
- dynamic QR auto-fills payment details;
- real-time voice/SMS alerts;
- SmartHub portal/reports/reconciliation;
- page currently advertises zero MDR benefits for UPI, subject to terms/current regulatory changes.

Source:
https://www.hdfc.bank.in/msme-banking/smarthub-vyapar-merchant-app/payment-solutions

### ICICI UPI Collections / EazyPay
Current bank pages describe:
- dynamic QR with amount already filled;
- suitability for websites/billing/delivery;
- instant settlement;
- UPI API registration through relationship manager;
- current pages advertise zero transaction charges for certain UPI collection flows, which must be rechecked after 15 Oct.

Sources:
https://www.icici.bank.in/business-banking/cms/merchant-solutions/upi-collections
https://www.icicibank.com/business-banking/cash-management-services/eazypay

### Axis Bank
Current UPI merchant offering describes:
- dynamic and static QR API options;
- check-status callback;
- reference-ID validation;
- intent flow;
- refunds;
- custom merchant integrations.

Source:
https://www.axis.bank.in/payments/payment-methods/upi

### Kotak
Open-banking/merchant pages expose UPI APIs including callbacks, transaction inquiry, refunds, dynamic UPI handling and QR/intent flows.

Source:
https://www.kotak.bank.in/en/open-banking/upi.html

### What this means for B38
Before committing permanently to a 1.95–2% gateway:
1. ask the bakery’s existing bank for **merchant UPI dynamic QR API / web checkout / callbacks**;
2. ask exact MDR after 15 Oct 2026;
3. ask whether sole proprietor/home bakery onboarding is accepted;
4. ask if a current account is required;
5. ask if API access is self-serve or relationship-manager enabled;
6. ask settlement/reconciliation format;
7. compare development effort against gateway savings.

If the bank gives dynamic QR + callback at negligible platform fee, build a `BankDynamicQrProvider` adapter and make it the UPI rail while keeping a gateway for cards/netbanking.

This can be the lowest-cost mature architecture.

---

## 37. Recommended B38 launch payment decision

### V2 recommendation

**Run a two-track onboarding test before production:**

#### Track 1 — Cashfree
Because it currently has the strongest published new-merchant platform-fee promotion and a mature dynamic QR / intent / webhook model.

#### Track 2 — the bakery’s bank
Ask for a merchant dynamic-QR/API proposition, especially HDFC/ICICI/Axis/Kotak if relevant.

### Selection logic
If bank dynamic QR offers:
- fixed amount;
- server callback/status;
- simple onboarding;
- low/zero platform fee;
- reliable settlement;

then:
- use bank rail for UPI;
- use Cashfree/PhonePe/Razorpay only for cards/netbanking/backup.

Otherwise:
- use Cashfree as the single initial PG;
- keep provider abstraction;
- revisit after promotional period.

### Do not integrate 5 gateways at launch
The code may support adapters, but operational complexity has a cost:
- multiple settlements;
- multiple refunds;
- more webhooks;
- more dashboards;
- more failure modes.

One primary provider + one fallback is enough.

---

## 38. Exact automated payment flow

### Mobile — UPI Intent
1. client sends checkout intent to B38 backend;
2. backend recomputes price from authoritative DB/quote;
3. backend creates internal order in `awaiting_payment`;
4. backend creates gateway payment/order for exact paise amount;
5. customer taps `Pay ₹X with UPI`;
6. provider launches supported UPI app/checkout with order amount;
7. customer approves;
8. provider processes;
9. provider sends signed webhook to B38;
10. backend verifies:
   - provider signature;
   - provider order ID;
   - amount == internal amount_due_now;
   - currency INR;
   - success/captured state;
   - event not already processed;
11. DB transaction records payment and moves order to confirmed/partially paid;
12. confirmation email/tracking page updates;
13. client redirect merely displays state — it is **not** the authority.

### Desktop — Dynamic QR
Same steps, but provider returns a unique QR for the exact amount. Customer scans with phone. Browser polls a B38 status endpoint or receives realtime update, while webhook remains authoritative.

### Webhook delayed
- client shows `Confirming payment… do not pay again`;
- backend can call provider status API;
- cron/reconciliation worker repairs pending payments.

### Customer tries to negotiate
There is no “enter amount” field. The gateway order is ₹X. A different payment cannot satisfy the order.

---

## 39. Payment provider acceptance test

Before production, the AI agent must make `/docs/payment-provider-decision.md` containing real B38 merchant results:

```text
Merchant legal type:
Bank account type:
KYC approved:
Provider:
Offer:
Offer expiry/cap:
UPI all-in cost <=₹2,000:
UPI all-in cost >₹2,000 after 15 Oct:
Card fee:
GST:
Settlement:
Refund cost:
Chargeback:
Dynamic QR fixed amount:
UPI intent:
Webhooks:
Status API:
Payment links:
Test success rate:
Mobile UX:
Support response:
Final decision:
```

Run ₹1/₹10 sandbox/test transactions where supported and at least one real low-value live transaction before launch.

---

# PART X — PAYMENT-SPECIFIC TECHNICAL REQUIREMENTS

## 40. Provider adapter V2

```ts
interface PaymentProvider {
  capabilities(): {
    upiIntent: boolean
    dynamicQr: boolean
    cards: boolean
    netbanking: boolean
    paymentLinks: boolean
    refunds: boolean
  }

  createCheckout(input: {
    orderId: string
    amountPaise: number
    currency: "INR"
    customer: { name: string; phone: string; email?: string }
    returnUrl: string
  }): Promise<{
    providerOrderId: string
    mode: "hosted" | "upi_intent" | "dynamic_qr"
    checkoutUrl?: string
    intentUrl?: string
    qrPayload?: string
    qrImageUrl?: string
    expiresAt?: string
  }>

  verifyWebhook(request: Request): Promise<VerifiedPaymentEvent>
  fetchPayment(providerOrderId: string): Promise<PaymentStatus>
  refund(input: RefundInput): Promise<RefundResult>
}
```

Implement:
- `CashfreeProvider`
- one `MockProvider`
- interface stubs/tests for `PhonePeProvider`, `RazorpayProvider`
- optional `BankDynamicQrProvider`

Fallback `DirectUPIProvider` exists only for owner/admin emergency/offline use.

---

## 41. Payment idempotency and reconciliation

Tables:
- `payment_attempts`
- `payment_events`
- `settlement_records`

Each provider event gets:
- unique provider event ID or payload hash;
- signature verification result;
- raw encrypted/minimized payload;
- processing status;
- error.

Nightly reconciliation:
- fetch/query payments still `pending`;
- compare order amount;
- repair missed webhooks;
- surface exception queue.

Owner should not reconcile normal successful online payments by looking at a bank app.

---

# PART XI — ADMIN / BUSINESS OPERATIONS ADDITIONS

## 42. Owner dashboard additions for this revised model

Action queue:
- custom requests waiting for quote
- customisation requests waiting for review
- payments pending provider confirmation >5 min
- payments needing manual fallback verification
- quotes expiring today
- balance payments due
- dates over 80% capacity
- imported design drafts awaiting approval

Dashboard should emphasize **work**, not revenue charts.

---

## 43. Design archive workflow

After an order is completed:
- owner selects best final photos;
- system asks:
  - publish this design?
  - customer media permission?
  - orderable again?
  - personalisation options?
  - starting price?
  - lead time?
- one click creates a catalogue draft.

Over time, B38’s operating history becomes its commercial catalogue.

---

# PART XII — MOBILE-FIRST PERFORMANCE BUDGETS

## 44. Mobile budgets

On core public pages, target on a realistic mid-range Android phone and slow/regular 4G:

- LCP ≤ 2.5s at 75th percentile;
- INP ≤ 200ms;
- CLS ≤ 0.1;
- initial JS compressed ideally ≤150–180 KB on content/catalogue routes;
- homepage poster ≤200–300 KB where visual quality permits;
- do not preload multiple hero videos;
- no 3D bundle in initial homepage JS;
- no 3D model in initial network waterfall;
- below-fold videos lazy;
- fonts subset/self-host, only required axes/weights.

A beautiful hero that takes 7 seconds to become usable is a failed hero.

---

## 45. Progressive enhancement ladder

### Level 0
HTML + image + order CTA works.

### Level 1
JS options/filter/checkout enhancements.

### Level 2
video hero.

### Level 3
frame spin.

### Level 4
3D.

If any upper level fails, the customer must still be able to order.

---

# PART XIII — TECH STACK REFRESH

## 46. 2026 stack recommendation

At research date:

- **Next.js 16.3.3** — active LTS security line as of Aug 2026 security release.
- **React 19.3**.
- TypeScript strict.
- Tailwind CSS 4.x.
- PostgreSQL / Supabase.
- Cloudflare R2 for image/video object storage.
- Resend for transactional email.
- Playwright for E2E.

Official references:
- https://nextjs.org/blog
- https://react.dev/blog/2026/09/09/react-19-3

### Cloudflare deployment note
Cloudflare now recommends **vinext** for new Next.js apps on Workers, while explicitly marking it beta and documenting OpenNext as the maintenance path for existing apps.

For B38:
1. build standard Next.js first;
2. run `vinext check`;
3. if every required feature passes compatibility + E2E, deploy with vinext;
4. if not, use a supported alternative deployment without rewriting product logic.

Reference:
https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/

### R2
R2 Standard currently has a free tier including 10 GB-month storage, 1M Class A operations, 10M Class B operations and free egress bandwidth; verify current pricing before deployment.

Reference:
https://developers.cloudflare.com/r2/pricing/

---

# PART XIV — AI AGENT MEDIA + BUILD AUTOMATION

## 47. The AI agent is responsible for more than code

The agent should behave as:
- product engineer;
- design-system implementer;
- media librarian;
- image derivative generator;
- catalogue importer;
- automated test runner;
- performance auditor;
- payment integration implementer.

It must **not** autonomously fabricate:
- business facts;
- testimonials;
- cake photos;
- FSSAI status;
- prices;
- serving counts;
- allergens;
- delivery areas.

---

## 48. Agent work packages

### Work package A — media intake
- ingest logo;
- ingest album export;
- dedupe;
- build contact sheets;
- classify;
- generate derivatives;
- generate draft catalogue.

### Work package B — visual prototype
Build `/design-lab` and 3 polished routes:
- homepage mobile;
- design detail mobile;
- custom brief mobile.

Generate screenshots at 390×844 and 1440×900.

Run anti-slop audit before building rest.

### Work package C — data/business
- migrations;
- catalogue;
- pricing rules;
- capacity;
- quote state machine.

### Work package D — payments
- mock adapter;
- Cashfree or selected primary;
- dynamic QR desktop;
- UPI intent mobile;
- webhook;
- reconciliation;
- refund.

### Work package E — admin
- today/action queue;
- quote builder;
- design import;
- capacity;
- campaigns.

### Work package F — validation
- Playwright;
- accessibility;
- Lighthouse/Core Web Vitals;
- mobile screenshots;
- low bandwidth;
- gateway failure scenarios.

---

## 49. Required autonomous research before final production provider activation

Because payment promotions are time-sensitive, the agent must re-query official pages **on the day the merchant account is activated**.

Check at minimum:
- Cashfree
- PhonePe
- Razorpay
- Zoho Payments
- bakery’s bank merchant dynamic-QR product

If a newly authorized/self-serve provider has a materially better all-in offer, record it, but do not silently switch. Produce a comparison for owner approval.

---

# PART XV — RETAINED AND REVISED CORE SPECIFICATION

The sections below preserve the strong operational, security, data and brand requirements from V1. Where any sentence conflicts with Parts I–XIV above, **V2 above wins**.



## BRAND POSITIONING

## 4.1 Brand sentence

**B38 Bake House creates highly personal, design-led cakes that are made around a person, reference or idea rather than selected from a generic bakery shelf.**

## 4.2 Brand attributes

Use these to judge every visual/copy decision:

- crafted
- warm
- precise
- personal
- contemporary
- confident
- understated
- design-aware
- edible, tactile, human

Avoid:

- childish
- cartoon-bakery cliché
- “cute cupcake shop” visual language
- fake luxury
- ornate wedding-card styling
- generic pastel Pinterest bakery template
- tech/SaaS aesthetic
- sterile minimalism that makes the food feel cold

## 4.3 What premium means here

Premium does **not** mean black background + gold gradient + serif + enormous spacing.

For B38, premium means:

- exceptional real photography;
- very disciplined typography;
- visible handcraft;
- precise spacing and alignment;
- restrained animation;
- fewer elements, chosen well;
- clear pricing and ordering;
- copy that sounds certain, not salesy;
- high-quality small details: focus states, image crops, empty states, receipts, quote presentation and order tracking.

---


## LOGO-DERIVED COLOR SYSTEM

The supplied B38 logo was sampled. Its two dominant brand colors are approximately:

- **B38 Cocoa:** `#742E15`
- **B38 Warm Gold:** `#F1C662`

These colors should remain the visual DNA of the website. The site may use only **tints, shades and warm neutrals that naturally support them**. Do not introduce a second loud brand hue.

## 5.1 Public-site tokens

```css
:root {
  --b38-cocoa-950: #2B120B;
  --b38-cocoa-900: #3B190E;
  --b38-cocoa-800: #562311;
  --b38-cocoa-700: #742E15; /* logo-derived primary */
  --b38-cocoa-600: #8D3D1D;
  --b38-cocoa-500: #A85632;

  --b38-gold-700: #B9872E;
  --b38-gold-600: #D7A949;
  --b38-gold-500: #F1C662; /* logo-derived primary */
  --b38-gold-300: #F7DA96;
  --b38-gold-150: #FBEBC3;

  --b38-cream-50:  #FFF9EE;
  --b38-cream-100: #FCF3DF;
  --b38-cream-200: #F5E6CB;
  --b38-paper:     #F8EDD8;

  --b38-ink:       #25140D;
  --b38-ink-soft:  #5D4B42;
  --b38-line:      rgba(116, 46, 21, 0.18);
  --b38-line-dark: rgba(43, 18, 11, 0.28);

  --b38-white: #FFFDF9;
}
```

## 5.2 Contrast rules

Measured approximate contrast:

- `#742E15` on `#F1C662`: ~6.06:1 — usable for normal text.
- `#742E15` on warm cream: >9:1 — excellent.
- gold on cream is **low contrast** and must not be used for normal text.

Therefore:

- on cream: body text = cocoa/ink;
- on cocoa: text = cream or gold;
- gold buttons must use dark cocoa text;
- never put gold body copy on pale cream;
- never rely on color alone for status.

## 5.3 Color usage proportions

On a normal public page:

- 55–70% warm cream / photographic negative space
- 20–30% cake imagery
- 8–15% cocoa
- 3–8% gold
- additional colors only from actual cake photography

The brand should feel warm, not brown-heavy.

## 5.4 Admin palette

The owner studio may use conventional semantic status colors for success, warning, error and info because operational clarity is more important than strict public-brand purity. Keep them muted and accessible.

---


## TYPOGRAPHY

## 6.1 Required font pairing

Use open-source, legally self-hostable fonts.

### Display / editorial
**Newsreader Variable** by Production Type — SIL Open Font License 1.1.

Use for:

- hero headline
- large section titles
- selected cake names
- testimonial pull quotes
- occasional italic accent

Why: it has editorial warmth and optical-size behavior without looking like a standard ecommerce template or stereotypical “luxury bakery” Bodoni clone.

### Body / UI
**Georama Variable** by Production Type — SIL Open Font License 1.1.

Use for:

- body copy
- navigation
- prices
- forms
- buttons
- filters
- admin UI

Why: contemporary, highly legible and less generic than the typical Inter/Poppins/Manrope stack.

Self-host subset WOFF2 files. Do not load from a third-party font CDN in production.

## 6.2 Type scale

Use fluid sizing with `clamp()`.

```css
--type-display-xl: clamp(3.4rem, 7.2vw, 7.4rem);
--type-display-lg: clamp(2.9rem, 5.8vw, 5.8rem);
--type-h1:         clamp(2.6rem, 4.8vw, 4.8rem);
--type-h2:         clamp(2.15rem, 3.6vw, 3.5rem);
--type-h3:         clamp(1.55rem, 2.2vw, 2.1rem);
--type-body-lg:    clamp(1.08rem, 1.25vw, 1.25rem);
--type-body:       1rem;
--type-small:      0.875rem;
--type-micro:      0.75rem;
```

## 6.3 Typography rules

- Hero headlines should generally use 2–4 lines, not a single giant sentence.
- Newsreader line-height: ~0.92–1.04 for display, 1.15–1.25 for smaller editorial headings.
- Georama body line-height: 1.55–1.7.
- Avoid all-caps paragraphs.
- Small labels may use uppercase with `letter-spacing: 0.08em–0.12em`.
- Price numerals should use tabular numerals if supported.
- Keep line length around 48–72 characters for body text.
- Do not use font weight as the only hierarchy mechanism; use size, spacing and placement.
- Do not mix more than two font families.

---


## ANTI-“AI DESIGN SLOP” RULESET

This section is binding.

Community discussion in 2025–2026 repeatedly identifies the same unintentional AI/frontend defaults: Inter or Space Grotesk, purple/blue gradients, equal rounded cards, glassmorphism, glows, generic three-column sections, oversized centered SaaS heroes, identical Lucide icons and fade-up animations everywhere. The problem is not that any one technique is forbidden; the problem is that they appear without a brand-specific reason.

## 7.1 Forbidden default patterns

Do not ship:

- purple, blue or cyan as decorative site colors;
- gradient text;
- glows behind cards/buttons;
- floating blurry blobs;
- a full page made of rounded rectangles;
- `rounded-2xl` on every object;
- generic 3-card “Why choose us” sections;
- icons above every paragraph;
- random sparkle/star icons;
- abstract AI-generated illustrations;
- a bento grid just because it is fashionable;
- endless center-aligned text;
- floating nav “pill” unless the composition genuinely needs it;
- fake browser/dashboard mockups;
- large button shadows;
- hover scale `1.05` on every card;
- every section appearing with the same `opacity 0 -> 1; translateY(20px)`;
- excessive horizontal marquees;
- custom cursors;
- scroll hijacking;
- long intro/preloader;
- “Made with love” / “where sweetness meets creativity” / “crafted to perfection” boilerplate;
- emoji as UI decoration;
- meaningless badges such as “Premium,” “Best Seller,” “AI powered” without a real rule.

## 7.2 Desired composition language

Use:

- strong photography as the primary decorative material;
- asymmetry where it supports the image;
- editorial grids;
- occasional full-bleed crops;
- very thin cocoa rules;
- text directly on page surfaces rather than inside cards;
- small, precise controls;
- square or 4–8px radii for standard UI;
- round/pill shape only where semantically appropriate: chips, status, small filters;
- visible white/cream space;
- a single signature motion system;
- genuine process footage;
- image captions and metadata rather than visual clutter.

## 7.3 Slop audit before release

The agent must run a visual review and ask:

1. Could this homepage be a fintech/SaaS site if the photos were replaced?
2. Are more than 40% of visible sections card containers?
3. Are there any gradients with no brand reason?
4. Are all corners the same large radius?
5. Does every section animate in the same way?
6. Are icons being used instead of good typography?
7. Is there a generic three-column section that can be expressed more naturally?
8. Are the cake images physically large enough to sell the work?
9. Is the visual hierarchy obvious without badges?
10. Does the page feel designed around B38’s real content?

Any “yes” to 1 or obvious failure on 8–10 requires another design pass.

---


## PRICING ENGINE

The pricing system should reduce arbitrary negotiation while remaining easy to manage.

## 16.1 Direct-order formula

Example conceptual formula:

```text
base variant price
+ flavour adjustment
+ finish/design adjustment
+ add-ons
+ rush fee
+ delivery fee
- coupon discount
+ applicable tax
= total
```

Exact rules are admin-configurable.

## 16.2 Complexity

Each catalogue cake can have a complexity tier:

- Tier 1 — simple
- Tier 2 — detailed
- Tier 3 — advanced
- Tier 4 — bespoke / quote only

Do not show “complexity tier” to customers unless useful. It can remain an internal pricing/capacity property.

## 16.3 Price integrity

Server must:
- load current active price rules;
- validate selected variant/add-ons;
- reject inactive/outdated options;
- recompute subtotal;
- compute coupon;
- compute fulfilment;
- compute deposit;
- store a price snapshot on order creation.

Never accept a browser-supplied total.

## 16.4 Quote pricing

For bespoke work, admin enters final price after reviewing the request.

The system may provide an internal estimate based on:
- size
- complexity
- add-ons
- rush
- delivery

but the customer only sees the final approved quote.

## 16.5 Coupons

Support:
- percentage
- flat amount
- minimum spend
- max discount
- active dates
- usage limit
- per-phone/email limit
- applicable cake/collection
- first-order optional
- unique or public code

Validate server-side.

## 16.6 Seasonal pricing

A campaign can:
- attach a coupon;
- feature a limited design collection;
- override availability;
- use a dedicated landing section.

Avoid auto-discounting everything.

---


## PRODUCTION CAPACITY SYSTEM

This is essential for a custom-cake business.

## 17.1 Capacity points

Each order consumes configurable points.

Example:
- simple cake = 1
- detailed custom = 2
- advanced sculptural/design = 3
- very complex = 4

Admin sets a daily maximum.

## 17.2 Date availability

When customer chooses a date:
- calculate existing confirmed + soft-reserved capacity;
- block dates that cannot accept the selected cake;
- show next available dates;
- apply minimum lead time;
- allow owner override.

## 17.3 Blackout dates

Admin can block:
- holidays
- personal days
- maintenance
- full days

## 17.4 Rush orders

Configurable:
- minimum normal lead time per cake;
- rush window;
- rush fee fixed or percentage;
- owner can disable rush entirely.

## 17.5 Soft holds

When a customer reaches payment:
- hold capacity for ~10 minutes;
- release if payment session expires.

For bespoke quote:
- optional quote-level soft hold until quote expiry;
- owner can choose not to hold if capacity is uncertain.

---


## FULFILMENT

## 18.1 Pickup

Configurable:
- pickup address/instructions
- time windows
- contact number
- map link

Do not expose a home address publicly if the owner does not want it; show it only after confirmed order if appropriate.

## 18.2 Delivery

Do not implement expensive map APIs by default.

MVP:
- owner defines delivery zones by locality and/or pincode;
- each zone has fixed fee;
- optional free-delivery threshold;
- unsupported area → custom delivery request or pickup.

Later:
- distance-based pricing if needed.

## 18.3 Delivery address fields

- recipient name
- phone
- address line
- locality
- landmark
- pincode
- optional delivery note

Validate phone/pincode format but allow Indian address variation.

---


## ORDER STATE MACHINE

Suggested states:

```text
draft
request_submitted
awaiting_quote
quote_sent
quote_revision_requested
awaiting_payment
payment_claimed
partially_paid
confirmed
scheduled
in_production
ready
out_for_delivery
completed
cancel_requested
cancelled
refund_pending
refunded
expired
```

Not every order passes every state.

Transitions must be explicit, validated server-side and written to `order_status_history`.

---


## CUSTOMER ORDER TRACKING

No customer account is required.

After order creation send a secure unguessable tracking link.

Tracking page shows:
- order number
- cake thumbnail
- date
- fulfilment
- payment summary
- current status
- customer-approved specification
- balance due if any
- support/WhatsApp button

Do not expose internal baker notes.

Tracking token:
- high-entropy random secret
- hash at rest if practical
- revocable

---


## OWNER STUDIO

The owner studio is not an analytics product. It is a task-oriented production console.

## 23.1 Dashboard

Top section:
- **Today**
- cakes due today
- pickup/delivery time
- customer
- payment status
- one-tap order detail

Action queue:
- 3 custom requests need a quote
- 1 direct UPI payment needs verification
- 2 quotes expire today
- 1 balance payment due

Small week capacity strip.

Do not fill the screen with vanity charts.

## 23.2 Orders page

Filters:
- date
- status
- payment
- fulfilment
- custom/direct
- search name/phone/order ID

Bulk actions should be minimal to prevent mistakes.

## 23.3 Order detail

Sections:
- production summary pinned at top
- cake/reference images
- final approved spec
- customer
- fulfilment
- payment
- quote history
- notes
- status timeline
- messages/logs
- portfolio consent

Quick actions:
- verify payment
- send quote
- mark confirmed
- mark in production
- mark ready
- complete
- create revised quote
- duplicate as catalogue cake
- refund/cancel

## 23.4 Custom request inbox

Visual thumbnail +:
- requested date
- budget band
- servings
- time since request

Owner can:
- decline unavailable request with template reason
- create quote
- ask one clarification
- mark duplicate/spam

## 23.5 Quote composer

Make this extremely easy:
- request details on left
- editable quote on right
- suggested internal estimate
- total price
- deposit %
- expiry
- owner note
- send

Preview customer quote before send.

## 23.6 Calendar

Month/week view:
- capacity used vs maximum
- confirmed orders
- quotes holding space
- blackout days

Click day → list orders.

## 23.7 Catalogue editor

Fields:
- title
- slug
- short description
- story/details
- actual-made checkbox
- direct order / quote only
- starting price
- variants
- lead time
- capacity points
- flavours allowed
- eggless setting
- style tags
- occasion tags
- color tags
- media
- featured
- active
- SEO title/description

## 23.8 Media manager

- upload image/video
- auto-create responsive derivatives
- alt text
- cake assignment
- focal point
- permission status
- customer media vs bakery media

## 23.9 Offers

Owner can create without code:
- code
- discount
- dates
- usage limits
- collection
- minimum order
- enabled

## 23.10 Campaigns

Home hero/seasonal feature:
- title
- subtitle
- image/video
- CTA
- destination
- dates
- priority

## 23.11 Reviews

Review statuses:
- submitted
- approved
- featured
- hidden

Never auto-publish customer text containing phone/address/private info.

---


## MOTION SYSTEM

Motion should make the food feel tactile and the interface feel precise.

## 25.1 Timing tokens

```css
--motion-fast: 160ms;
--motion-ui: 220ms;
--motion-medium: 420ms;
--motion-slow: 720ms;

--ease-standard: cubic-bezier(.22,.61,.36,1);
--ease-emphasized: cubic-bezier(.16,1,.3,1);
```

## 25.2 Allowed motion

- nav transition
- subtle image crop shift
- image crossfade
- selected option indicator
- drawer/dialog
- cart/order summary state
- one restrained text/image reveal per major section
- shared-element image transition where performance allows

## 25.3 Limits

- image hover scale <= 1.015
- parallax <= ~16px effective travel
- do not animate layout continuously on scroll
- no scroll-jacking
- no cursor follower
- no perpetual floating objects
- no confetti on payment

## 25.4 Reduced motion

When `prefers-reduced-motion: reduce`:
- remove transforms/parallax;
- keep simple opacity or instant changes;
- pause nonessential autoplay motion.

---


## COMPONENT SYSTEM

Use headless accessible primitives where useful, but the visible styling must be custom.

Acceptable:
- Radix primitives / Base UI for behavior
- Tailwind CSS for implementation
- Motion for React for selected motion

Do not copy shadcn visual defaults wholesale.

## 26.1 Public components

- `BrandLogo`
- `SiteHeader`
- `MobileMenu`
- `EditorialHero`
- `CakeMedia`
- `CakeGrid`
- `CakeTile`
- `Price`
- `OptionGroup`
- `VariantSelector`
- `DatePicker`
- `AvailabilityStatus`
- `FulfilmentSelector`
- `UploadDropzone`
- `ReferenceContactSheet`
- `QuoteSummary`
- `OrderSummary`
- `PaymentMethodSelector`
- `DirectUpiPanel`
- `GatewayCheckoutButton`
- `CampaignFeature`
- `ProcessFilm`
- `TestimonialStory`
- `Faq`
- `SiteFooter`
- `Toast`
- `Dialog`
- `Sheet`
- `InlineError`
- `Skeleton`

## 26.2 Owner components

- `TodayOrderRow`
- `ActionQueue`
- `CapacityMeter`
- `StatusBadge`
- `PaymentBadge`
- `OrderTimeline`
- `QuoteEditor`
- `PriceRuleEditor`
- `MediaUploader`
- `FocalPointEditor`
- `CampaignEditor`
- `AuditTimeline`

---


## ACCESSIBILITY

Target **WCAG 2.2 AA**.

Mandatory:

- text contrast >= 4.5:1 except valid large-text exceptions;
- visible keyboard focus;
- no focus hidden under sticky header;
- minimum target size compliant with WCAG; aim for 44×44px on primary touch controls;
- all form fields have programmatic labels;
- errors announced and attached to fields;
- image alt text;
- decorative images empty alt;
- video does not autoplay sound;
- dialogs trap focus and restore it correctly;
- no color-only state;
- date picker usable by keyboard;
- drag/drop upload has normal file-input alternative;
- configurator drag actions must have click/select alternatives;
- 200% zoom without broken functionality;
- `prefers-reduced-motion`.

Test with keyboard only and at least one screen reader smoke test.

---


## SEO & LOCAL DISCOVERY

The site should become the canonical digital presence, not only a checkout.

## 29.1 Technical SEO

- meaningful titles/descriptions
- canonical URLs
- XML sitemap
- robots
- Open Graph
- Twitter/X card image
- clean cake slugs
- structured breadcrumbs
- no index on secure quote/order/studio pages
- 404/410 handling for removed cakes

## 29.2 Structured data

Use appropriate schema:
- `LocalBusiness` / most specific applicable bakery/food-business subtype
- Organization fields
- address only if owner wants public
- phone
- opening/order hours if meaningful
- sameAs Instagram / Google Business Profile
- product/offer where a cake is genuinely orderable with a public price

Do not use fake AggregateRating markup.

## 29.3 Local landing content

Do not create spammy SEO pages for every neighbourhood.

Use:
- one real service-area section
- real delivery areas
- real occasion collections
- real cake portfolio
- Google Business Profile linked to site
- UTM tracking on GBP and Instagram links

---


## COPY SYSTEM

## 30.1 Voice

Short, confident, warm, specific.

Good:
- “Bring the reference. We’ll make it yours.”
- “Made after you order.”
- “Choose a B38 design or send your own.”
- “A fixed quote, before you pay.”
- “This Saturday is nearly full.”

Bad:
- “Indulge in a symphony of flavors.”
- “Where every bite tells a story.”
- “Crafted with love and passion.”
- “Experience the magic of sweetness.”
- “Elevate your celebrations.”

## 30.2 Pricing tone

Do not apologize for price.

Use:
- “From ₹1,850”
- “Custom design quote”
- “Price updates with your selections”
- “Quote valid until…”

Avoid:
- “Contact us for best price”
- “DM for price”
- “Price negotiable”
- “Starting price only, final depends” without explaining what changes it

## 30.3 Scarcity

Only show real operational scarcity:
- “1 slot left for Saturday”
- “Orders closed for 24 Sep”

No fake countdown timers.

---


## DATA MODEL

Use PostgreSQL.

Suggested tables follow. Agent may refine naming but not remove key capabilities.

## 31.1 `admin_users`

```text
id uuid pk
auth_user_id uuid unique
name text
role enum(owner, staff)
active boolean
created_at timestamptz
```

## 31.2 `cakes`

```text
id uuid pk
slug text unique
name text
short_description text
description text
order_mode enum(direct, quote_only, inspiration_only)
actual_b38_work boolean
active boolean
featured boolean
base_from_price integer -- paise
lead_time_hours integer
rush_allowed boolean
capacity_points integer
eggless_mode enum(available, unavailable, only)
style_tags text[]
occasion_tags text[]
color_tags text[]
seo_title text
seo_description text
created_at
updated_at
```

## 31.3 `cake_variants`

```text
id
cake_id fk
name
weight_kg numeric nullable
servings_min
servings_max
price integer
active
sort_order
```

## 31.4 `flavours`

```text
id
name
description
price_adjustment integer
active
sort_order
```

## 31.5 `cake_flavours`

many-to-many.

## 31.6 `addons`

```text
id
name
category
description
price_adjustment
active
capacity_adjustment nullable
```

## 31.7 `media`

```text
id
kind enum(image, video)
storage_key
original_key nullable
width
height
duration_ms nullable
alt_text
focal_x numeric
focal_y numeric
source enum(bakery, customer, generated_concept)
publication_permission boolean
created_at
```

## 31.8 `cake_media`

```text
cake_id
media_id
role enum(hero, gallery, process, interior)
sort_order
```

## 31.9 `custom_requests`

```text
id uuid
public_code text unique
customer_name
phone
email nullable
occasion
event_date
servings
weight_preference
flavour_id nullable
eggless boolean nullable
message_text
must_keep text
can_interpret text
style_tags text[]
color_notes text
budget_band
fulfilment_type
delivery_zone_id nullable
address_json jsonb nullable
notes
status
created_at
```

References via junction `custom_request_media`.

## 31.10 `quotes`

```text
id
custom_request_id
version integer
status enum(draft,sent,accepted,superseded,expired,declined)
spec_snapshot jsonb
subtotal integer
delivery_fee integer
discount integer
tax integer
total integer
deposit_amount integer
expires_at
sent_at
accepted_at
customer_note
internal_note
secure_token_hash
created_by
created_at
```

Unique `(custom_request_id, version)`.

## 31.11 `orders`

```text
id uuid
public_code text unique
order_type enum(direct, bespoke)
customer_name
phone
email
cake_id nullable
quote_id nullable
event_date date
fulfilment_type enum(pickup,delivery)
fulfilment_slot text nullable
delivery_zone_id nullable
address_json jsonb nullable
spec_snapshot jsonb
status
capacity_points
subtotal integer
delivery_fee integer
discount integer
tax integer
total_amount integer
amount_due_now integer
amount_paid integer
balance_due integer
balance_due_at timestamptz nullable
coupon_id nullable
tracking_token_hash
customer_notes
internal_notes
portfolio_consent boolean
terms_accepted_at
created_at
updated_at
```

## 31.12 `order_items`

For direct cake/options snapshot line items.

## 31.13 `payments`

```text
id
order_id
provider enum(cashfree,phonepe,razorpay,paytm,zoho,bank_dynamic_qr,direct_upi,manual)
provider_order_id nullable
provider_payment_id nullable
amount integer
currency default INR
status enum(created,pending,claimed,verified,succeeded,failed,refunded,partially_refunded)
utr text nullable
proof_media_id nullable
verified_by nullable
verified_at nullable
failure_code nullable
failure_message nullable
webhook_event_id nullable
raw_metadata jsonb
created_at
updated_at
```

## 31.14 `order_status_history`

```text
id
order_id
from_status
to_status
actor_type
actor_id nullable
note nullable
created_at
```

## 31.15 `capacity_days`

```text
date pk
max_points integer
blocked boolean
note
```

If absent, use global default capacity.

## 31.16 `delivery_zones`

```text
id
name
pincodes text[]
localities text[]
fee integer
minimum_order integer nullable
active
```

## 31.17 `coupons`

As specified in pricing section.

## 31.18 `campaigns`

```text
id
title
subtitle
media_id
cta_label
cta_href
coupon_id nullable
starts_at
ends_at
priority
active
```

## 31.19 `testimonials`

```text
id
name_display
occasion
quote
media_id nullable
source
permission_confirmed
featured
published_at
```

## 31.20 `settings`

Use typed keys or a single validated JSON document for:
- business identity
- contact
- UPI VPA
- merchant display name
- capacity defaults
- lead times
- pickup info
- quote expiry
- deposit rules
- social links
- FSSAI
- tax configuration
- payment provider
- email
- policy text/version

## 31.21 `audit_log`

Record all sensitive owner actions:
- quote changes
- price rule changes
- payment verification
- refunds
- cancellation
- settings
- coupon changes

---


## DATABASE SECURITY

If using Supabase:

- enable RLS on every public schema table;
- public anonymous users get read-only access only to active public catalogue/campaign/review data;
- orders/custom requests never publicly enumerable;
- admin access based on authenticated user + allowlisted `admin_users`;
- service-role key only server-side;
- never place service-role key in client bundle;
- signed upload endpoints;
- secure tracking/quote token lookup via server;
- use database constraints for status enum and positive money values.

Store money in integer paise, never floating point.

---


## API / SERVER ACTIONS

Names may vary but capabilities are required.

## Public

```text
POST /api/availability
POST /api/uploads/sign
POST /api/custom-requests
POST /api/orders/direct
POST /api/orders/[id]/apply-coupon
POST /api/checkout/prepare
POST /api/payments/fallback-direct-upi/claim
POST /api/payments/gateway/create
POST /api/quotes/[token]/accept
POST /api/quotes/[token]/revision-request
GET  /api/track/[token]
```

## Webhooks

```text
POST /api/webhooks/cashfree
POST /api/webhooks/phonepe
POST /api/webhooks/razorpay
POST /api/webhooks/email
```

Only enable provider route in use, but keep adapter structure.

## Admin

Use authenticated server actions or protected API:
- quote CRUD
- order status transitions
- payment verification
- refund record
- catalogue CRUD
- capacity
- coupons
- campaigns
- media
- settings

---


## UPLOAD SECURITY

Customer references are untrusted files.

Requirements:
- MIME sniff/validate server-side
- extension allowlist
- max size
- random object names
- private bucket for customer references
- no SVG uploads from customers
- transform/re-encode images before public use
- remove EXIF/GPS
- do not serve raw user uploads with executable content type
- short-lived signed URLs in admin
- customer uploads never appear publicly without explicit permission

Retention:
- configurable automatic cleanup after e.g. 90 days from completed/cancelled order unless required for portfolio and permission obtained.

---


## EMAIL + WHATSAPP STRATEGY

## 38.1 WhatsApp

MVP:
- click-to-chat links
- prefilled concise messages with order/request ID
- no paid WhatsApp Business API dependency

Examples:
- customer: “Hi B38, I’m asking about request B38-R1042.”
- owner: a studio button can open a prefilled update to the customer.

Do not use WhatsApp as the source of truth. The order spec and price must remain in the website.

## 38.2 Email

Email is the automatic record:
- quote link
- receipt
- order summary
- status changes

If many customers do not use email, allow phone-only ordering but still keep web tracking link copyable.

---


## FSSAI / E-COMMERCE / COMPLIANCE LAUNCH CHECKLIST

This is a product requirement, not a legal conclusion.

Food businesses in India require appropriate FSSAI registration/licensing. In 2026 FSSAI revised turnover thresholds, and FSSAI also maintains specific obligations for e-commerce FBO activity. Before enabling public checkout, the owner must verify the correct status in FoSCoS for a home bakery accepting orders through its own website.

Agent must create a launch checklist field for:

- FSSAI registration/license number
- legal business/owner name as required
- whether e-commerce category / Central licence obligations apply to this exact model
- number shown on invoice/receipt where required
- business address disclosure decision
- refund/cancellation policy
- delivery/pickup policy
- privacy policy
- terms
- allergy/cross-contamination disclosure
- tax/GST configuration

Do not claim “FSSAI certified” unless the owner supplies valid details.

### Important 2026 note

FSSAI announced that, effective 1 Apr 2026, the basic registration turnover threshold increased substantially (from the previous ₹12 lakh level to ₹1.5 crore under the announced reform), with State licensing up to ₹50 crore and Central licensing beyond that on the turnover axis. However, **e-commerce and other kind-of-business/category rules can create obligations independent of a simple turnover reading**. The owner should verify in FoSCoS before launch.

---


## ALLERGEN / FOOD DISCLOSURE

The interface should support configurable factual statements such as:

- contains wheat/gluten
- contains milk
- contains egg
- contains nuts
- prepared in a kitchen that also handles specified allergens

Do not infer “nut-free,” “gluten-free,” “vegan,” or allergy-safe because a recipe omits one ingredient.

Admin should control labels per flavour/product.

---


## INVOICES / RECEIPTS

Generate a clean PDF or printable HTML receipt after payment/confirmation.

Fields:
- B38 Bake House
- legal business name if different
- order ID
- date
- customer
- item/spec summary
- total
- amount paid
- balance
- payment reference
- tax fields if applicable
- FSSAI number where required
- policy reference

Do not overdesign receipts.

---


## SECURITY

Mandatory:

- HTTPS only
- secure, HttpOnly, SameSite cookies
- CSRF protection appropriate to framework
- strict input validation
- server-side authorization on every studio action
- webhook signature verification
- webhook idempotency
- payment amount/order matching
- rate limiting on public forms/uploads/payment claims
- CAPTCHA/Turnstile only after abuse appears or on high-risk endpoints; do not add friction unnecessarily
- Content Security Policy
- no secrets in client
- no raw SQL from untrusted input
- sanitized rich text or avoid rich text entirely
- audit trail
- automated dependency scanning
- least-privilege storage credentials

## 42.1 Payment webhook idempotency

Store provider event ID or payload hash. A retry must not:
- double-credit payment
- double-confirm order
- send duplicate customer emails
- consume capacity twice

## 42.2 Admin auth

Owner:
- email magic link or password + MFA
- MFA strongly recommended
- rate limit login
- no public signup
- admin allowlist

---


## PRIVACY

Collect only what is needed.

Customer:
- name
- phone
- email optional/required depending flow
- delivery address if needed
- cake personalization details
- images if custom

Do not ask for DOB unless necessary; age written on cake can be a cake field without making it a profile attribute.

Uploaded personal photos used as cake references must be private.

Provide delete/export process where legally appropriate.

---


## EMPTY, LOADING AND ERROR STATES

Every data-driven page needs designed states.

Examples:

### No cakes match
“Nothing in those filters yet.”  
Actions: clear filters / send a custom request.

### Date unavailable
“That date is full for this design.”  
Show 2–3 next available dates.

### Upload failed
Keep other form data. Allow retry only failed file.

### Quote expired
“This quote has expired because availability can change.”  
CTA: request updated quote.

### Payment pending
“We haven’t received confirmation yet. Don’t pay twice.”  
Refresh/check status.

### Direct UPI claimed
“Payment submitted for verification.”  
Owner-side action queue created.

---


## TESTING STRATEGY

## 46.1 Unit tests

Test:
- pricing
- coupons
- deposit
- capacity
- date/lead time
- quote expiry
- allowed status transitions
- UPI URI encoding
- money formatting
- delivery fees

## 46.2 Integration tests

- create custom request with images
- owner creates/sends quote
- customer accepts quote
- payment created
- webhook success
- order confirmation
- capacity consumed
- confirmation email

## 46.3 E2E

Use Playwright.

Critical paths:

1. Browse → direct cake → configure → date → UPI payment claim.
2. Browse → gateway success test mode.
3. Custom reference upload → submit → admin quote → accept → pay.
4. Failed payment → retry without duplicate order.
5. Expired quote.
6. Coupon valid/invalid.
7. Date becomes unavailable.
8. Admin verifies direct UPI.
9. Mobile checkout.
10. Keyboard-only checkout.

## 46.4 Visual regression

Capture at:
- 390×844
- 430×932
- 768×1024
- 1440×900
- 1920×1080

Key pages:
- home
- cakes
- detail
- custom builder
- quote
- checkout
- studio dashboard
- studio order

---


## PERFORMANCE / QUALITY GATES

CI must fail or warn strongly when:

- TypeScript errors
- lint errors
- unit/E2E critical failures
- obvious accessibility violations
- secret committed
- build fails
- database migration mismatch

Prelaunch manual gates:
- Lighthouse mobile performance >= 90 where practical on core pages
- accessibility >= 95, with manual checks
- no CLS from fonts/images
- payment test complete
- webhook replay test
- refund test
- 404/500 designed
- no placeholder lorem ipsum
- no fake reviews
- no dead links
- no console errors

---


## ANALYTICS EVENT TAXONOMY

No PII in event names/properties.

```text
home_view
cake_grid_view
cake_filter_applied
cake_view
cake_order_start
cake_option_changed
date_checked
date_unavailable
custom_flow_start
custom_reference_uploaded
custom_step_completed
custom_request_submitted
quote_viewed
quote_revision_requested
quote_accepted
checkout_started
coupon_applied
payment_method_selected
payment_started
payment_succeeded
payment_failed
direct_upi_claimed
order_tracking_viewed
whatsapp_support_clicked
```

Properties may include:
- cake ID
- category/style ID
- step number
- payment provider
- amount band, not necessarily raw amount for analytics
- device class

---


## DESIGN QA CHECKLIST

Before calling the public site done:

### Brand
- exact logo colors respected
- no stray tech blue/purple
- Newsreader + Georama loaded correctly
- logo not altered
- cake images dominate

### Composition
- no generic three-card feature row
- no unnecessary bento
- no over-rounded UI
- no glow
- no gradients unless extremely subtle tone-on-tone and justified
- no generic vector illustration
- no cluttered hero
- mobile feels intentionally composed

### Copy
- no AI clichés
- no fake statistics
- no fake trust badges
- no “DM for price”
- clear order paths

### Commerce
- price visible where possible
- custom path explicitly quote-based
- date checked before payment
- no client-authoritative totals

### Craft
- process footage real
- portfolio real
- AI concepts labelled if feature enabled

---


## OWNER UX QA CHECKLIST

Ask a non-technical person to perform without instructions:

1. find tomorrow’s orders;
2. verify a UPI payment;
3. create a quote;
4. block next Sunday;
5. raise the price of an add-on;
6. feature a cake on homepage;
7. create a 10% festive coupon;
8. mark an order ready;
9. find customer reference images;
10. turn completed cake into a catalogue draft.

If any task takes >30–60 seconds after basic familiarity, simplify.

---


## FOLDER STRUCTURE

Suggested:

```text
src/
  app/
    (public)/
    (checkout)/
    studio/
    api/
  components/
    public/
    checkout/
    studio/
    primitives/
  features/
    cakes/
    custom-requests/
    quotes/
    orders/
    payments/
    capacity/
    coupons/
    delivery/
    media/
  lib/
    db/
    auth/
    money/
    validation/
    email/
    analytics/
    storage/
  server/
    services/
    repositories/
    payment-providers/
  styles/
  emails/
  types/
supabase/
  migrations/
  seed.sql
docs/
tests/
e2e/
```

Keep business logic out of React components.

---


## DATABASE MIGRATION RULES

- migrations committed
- no manual production schema edits
- forward-only migrations in normal flow
- backup before destructive changes
- seed separate from migrations
- migration CI on clean database
- money integer
- timezone aware timestamps
- dates for event day where time is separate

---


## MONEY / INDIA FORMATTING

Use `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })`.

Store:
- `185000` paise → display `₹1,850`

Do not build money with floating point.

---


## DATE / TIME

Business timezone configurable; default to `Asia/Kolkata` only after owner confirms.

Store:
- event date as date
- timestamps UTC
- fulfilment time window structured or validated text

Quote expiry shown in local business time.

---


## ADMIN NOTIFICATIONS

Minimum:
- new custom request email
- payment claim email
- payment failure anomaly
- quote expiry reminder
- tomorrow’s production summary optional

Avoid notification spam.

Later:
- web push / WhatsApp API only if operationally useful.

---


## BACKUP / RECOVERY

- database backups according to hosting plan
- periodic export of orders/quotes
- media retained in R2
- document recovery procedure
- no single laptop should contain the only order data

Provide admin export:
- orders CSV
- customers CSV
- catalogue JSON/CSV
- media manifest

---


## BUSINESS RULES TO MAKE CONFIGURABLE

Do not hard-code:

- minimum order amount
- deposit %
- quote expiry
- lead time
- rush fee
- daily capacity
- pickup hours
- delivery zones
- free delivery threshold
- eggless pricing
- tax
- cancellation cutoff
- balance due time
- UPI VPA
- gateway
- campaign dates
- coupon limits

---


## LAUNCH DATA THE OWNER MUST SUPPLY

Create an onboarding checklist in the studio and do not block development while waiting.

Needed before real launch:

- confirmed business display name
- best logo asset
- phone
- whether phone is WhatsApp
- Instagram URL
- service area
- pickup rules/address disclosure preference
- delivery zones + fees
- FSSAI details
- tax/GST details if applicable
- UPI merchant VPA and payee name
- cancellation/refund policy decisions
- allergy/cross-contamination statement
- lead time
- daily capacity
- 8–20 strongest cake photos
- 3–5 process videos
- current flavour list
- size/serving options
- base prices
- add-ons
- 3–8 genuine customer testimonials with permission
- admin email

---


# PART XVI — V2 HOMEPAGE / CATALOGUE / CUSTOM ROUTES

## INFORMATION ARCHITECTURE V2

### Public navigation
- Designs
- Custom Cake
- How It Works
- About
- Order

Mobile menu also:
- Track Order
- Contact / WhatsApp
- Policies

### Public routes

```text
/
├── /designs
│   ├── ?date=
│   ├── ?occasion=
│   ├── ?style=
│   └── /[slug]
│       └── /customise
├── /custom
│   ├── /from-design/[slug]
│   └── /from-scratch
├── /quote/[token]
├── /checkout/[orderToken]
├── /order/success
├── /track/[token]
├── /availability
├── /occasions/[slug]
├── /how-it-works
├── /about
├── /reviews
├── /contact
├── /faq
└── /policies/*
```

### Homepage primary CTAs
Primary: `Order a cake`  
Secondary: `See designs`

`Order a cake` may open a two-choice sheet:
- Choose a B38 design
- Request a custom cake

This avoids forcing a decision inside navigation.

---

## HOMEPAGE COMPONENT ORDER — MOBILE

1. header
2. hero copy + real poster/video
3. recently made
4. occasion/date discovery
5. designs archive teaser
6. choose design vs custom
7. reference → interpretation story
8. process film
9. flavour/interior
10. customer story
11. campaign
12. order process
13. FAQ
14. footer

Do not exceed this merely because content exists. Many sections can be conditionally hidden until real assets are available.

---

## DESIGNS PAGE — SEARCH AND FILTER DETAILS

### Search intent examples
Search should recognize tags such as:
- “pink heart”
- “football cake”
- “cake for 10 people”
- “minimal anniversary”
- “photo cake”
- “eggless chocolate”

V1 can implement lexical/tag search. Semantic/AI search is optional later.

### Sorting
- Recommended
- Most requested (only with data)
- Price low → high
- Newest

Avoid arbitrary “featured” sorting with no owner control.

### Date-aware results
If user selects date:
- show only buildable designs;
- distinguish:
  - available;
  - limited;
  - rush fee;
  - unavailable.

This is more valuable than dozens of generic filters.

---

## DESIGN DETAIL — CUSTOMISE ESCALATION

Each design declares:

```ts
personalisationMode:
  | "none"
  | "basic"
  | "extended"

customisationMode:
  | "not_allowed"
  | "priced_options"
  | "quote"
```

If `priced_options`, show visual options inline.

If `quote`, `Customise this design` creates a brief carrying:
- design ID
- selected size/flavour
- chosen date
- current starting total

This preserves context and anchors price.

---

# PART XVII — UPDATED PHOTOGRAPHY / VIDEO DIRECTION

## Photography principle

The site should never need visual gimmicks to rescue weak cake imagery.

### Background
B38’s cocoa/gold palette is already warm. Product photography should therefore use:
- warm off-white;
- pale stone;
- matte neutral;
- occasional deep cocoa only for very light cakes.

Avoid photographing every cake against the same logo-brown background; frosting needs separation.

### Colour management
- consistent white balance;
- preserve frosting whites;
- avoid Instagram filters;
- no orange cast;
- no over-sharpened HDR;
- calibrate exports against common phone displays.

### Crop discipline
For every published design, manually check crop at:
- 390×844 hero;
- 2-column 390px catalogue;
- 4:5;
- 1440 desktop.

AI focal-point detection can propose; human/agent screenshot review must verify.

---

## Process-video shot library

Build reusable tagged clips:
- crumb coat
- frosting smoothing
- piping
- flower placement
- fondant detail
- topper placement
- edible print
- chocolate drip
- final turntable
- slicing
- boxing

Store clips as reusable `process_media`, not attached only to one page.

Homepage can rotate the best clips without code changes.

---

# PART XVIII — UPDATED RESPONSIVE SPEC

## 360–430 px
- source design
- one column forms
- 2-column design grid only when image card minimum width remains ~160–180 px
- sticky bottom commerce CTA where useful
- bottom sheets for filters
- video poster first
- UPI intent primary

## 600–900 px
- wider 2-column catalogue
- product media/config may begin side-by-side only if neither becomes cramped
- maintain touch-first interactions

## 1024–1440 px
- product gallery left / sticky options right
- editorial home layouts
- dynamic QR available as preferred UPI desktop flow

## >1440 px
- constrain content; do not expand form widths indefinitely
- allow photography to grow more than text

---

# PART XIX — UPDATED PERFORMANCE IMPLEMENTATION

## Images
On ingestion:
- retain private original;
- derivatives in AVIF/WebP;
- width buckets 320/480/640/768/1080/1440/1920/2400 as needed;
- metadata contains dimensions and focal point;
- `sizes` must match layout;
- eagerly load only true LCP candidate.

## Fonts
Self-host Newsreader and Georama.
- subset Latin and required symbols;
- `font-display: swap`;
- preload only the font actually used above fold;
- avoid loading every weight.

## Video
- poster is independent image asset;
- `preload=none` unless measurements justify metadata;
- mobile and desktop encodes;
- pause when offscreen;
- do not download process videos before near viewport.

## 3D
No model-viewer JS/model on homepage initial request.
Use:
- poster;
- explicit/near-viewport deferred import;
- manual reveal;
- mobile budget.

---

# PART XX — PAYMENT DATA MODEL ADDITIONS

Extend payments:

```text
payment_attempts
  id
  order_id
  provider
  provider_order_id
  amount
  currency
  checkout_mode
  status
  expires_at
  idempotency_key
  created_at
  updated_at

payment_events
  id
  provider
  provider_event_id
  payment_attempt_id nullable
  payload_hash
  signature_valid
  event_type
  processing_status
  received_at
  processed_at

settlement_records
  id
  provider
  settlement_id
  payment_id
  gross_amount
  provider_fee
  payment_instrument_fee
  gst_on_fee
  net_amount
  settled_at
```

Why separate fee fields:
- provider “platform fee” and UPI/card instrument MDR may differ;
- promotions may waive one and not the other;
- B38 should eventually know the **real effective payment cost**.

---

# PART XXI — COST MODEL

## Payment economics dashboard

Calculate monthly:

```text
GMV
successful payments
UPI share
card share
avg order value
platform fees
instrument MDR
GST on fees
refund fees
net effective payment %
provider success rate
```

At promotion expiry, show:
`Estimated next-month fee if current provider continues`.

This turns provider switching into a rational decision rather than guesswork.

---

# PART XXII — UPDATED IMPLEMENTATION PHASES

## Phase 0 — Asset + business truth collection
Before pretending to finish the UI:
- import supplied logo;
- obtain album originals;
- ingest photo archive;
- identify 20 strongest designs;
- collect real prices/flavours/lead time;
- start Cashfree + bank merchant onboarding in parallel.

Deliverables:
- `media-manifest.json`
- contact sheets
- `business-settings-draft.json`
- payment onboarding checklist

## Phase 1 — Mobile visual prototype
Only:
- home
- designs
- design detail
- custom entry

at 390 px first.

Screenshot and review anti-slop checklist.

## Phase 2 — Core catalogue / pricing / capacity
- admin;
- import pipeline;
- catalogue;
- deterministic personalisation;
- date availability.

## Phase 3 — Checkout + primary provider
- dynamic QR;
- UPI intent;
- webhooks;
- reconciliation;
- refund;
- mobile checkout.

## Phase 4 — Customise / bespoke / quotes
- reference uploads;
- structured brief;
- quote revisions;
- deposit/balance;
- payment links.

## Phase 5 — Media polish
- real hero film;
- process strip;
- slice/interior content;
- review/customer stories.

## Phase 6 — Optional interactive media
Measure whether users need it.
- frame spin first;
- then selective 3D;
- then configurator if useful.

Never make 3D a release blocker.

---

# PART XXIII — AI AGENT EXECUTION COMMANDMENT

The agent should not ask a human to perform work it can safely automate.

Automate:
- file hashing;
- image derivatives;
- contact sheets;
- metadata draft;
- data migrations;
- seed imports;
- browser screenshots;
- responsive review;
- test runs;
- payment sandbox calls;
- webhook replay;
- build/deploy;
- Lighthouse;
- accessibility scanning;
- dead-link audit;
- image-size audit;
- unused asset audit.

Require owner input for:
- prices;
- legal/KYC;
- payment merchant activation;
- real business claims;
- publishing customer photos;
- taste/flavour truth;
- allergen truth;
- final quote judgment;
- refund exceptions.

---

# PART XXIV — UPDATED ENVIRONMENT CONTRACT

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_BUSINESS_NAME=B38 Bake House

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_PUBLIC=
R2_BUCKET_PRIVATE=
R2_PUBLIC_BASE_URL=

RESEND_API_KEY=
EMAIL_FROM=

PAYMENT_PROVIDER=cashfree

CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=
CASHFREE_ENV=sandbox

PHONEPE_CLIENT_ID=
PHONEPE_CLIENT_SECRET=
PHONEPE_ENV=sandbox

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

PAYTM_MID=
PAYTM_MERCHANT_KEY=

ZOHO_PAYMENTS_*=

BANK_DYNAMIC_QR_PROVIDER=
BANK_DYNAMIC_QR_CLIENT_ID=
BANK_DYNAMIC_QR_CLIENT_SECRET=

FALLBACK_UPI_VPA=
FALLBACK_UPI_PAYEE_NAME=B38 Bake House

SENTRY_DSN=
```

Never expose secret keys to the browser.

---

# PART XXV — UPDATED CONTENT SEEDING

Do not seed fake “customer” work if real archive is available.

Preferred:
1. import real private photos;
2. create unpublished design drafts;
3. owner confirms price/orderability;
4. publish.

If real archive is temporarily unavailable:
- use neutral local placeholders marked `DEVELOPMENT ONLY`;
- block production deploy if placeholders remain.

---

# PART XXVI — RESEARCH SOURCE REGISTER

All time-sensitive commercial facts must be revalidated at implementation/launch.

## Designer cake / bakery references
- Butter& homepage: https://butterand.com/
- Butter& signature designs: https://butterand.com/collections/signature-cakes
- Butter& availability: https://butterand.com/pages/date-availability
- Butter& how it works: https://butterand.com/pages/how-it-works
- Butter& custom cakes: https://butterand.com/pages/custom-cakes
- Anges de Sucre personalised: https://www.angesdesucre.com/pages/personalised-cakes-london
- Anges de Sucre custom: https://www.angesdesucre.com/pages/custom-cakes-london
- Anges de Sucre bespoke: https://www.angesdesucre.com/pages/bespoke-cakes
- From Lucie FAQs: https://fromlucie.com/pages/faqs
- Pierre Hermé: https://www.pierreherme.com/en/
- Theobroma cakes: https://theobroma.in/collections/cakes
- Flour Shop: https://flourshop.com/
- Torrance Bakery: https://www.torrancebakery.com/
- Island Cart 3D Cake Builder: https://www.islandcart.com/3d-cake-builder/
- Vectary Memotics 3D cake case study: https://www.vectary.com/memotics-3d-cake-configurator/

## 3D / media performance
- model-viewer lazy loading: https://modelviewer.dev/examples/loading/
- model-viewer Lighthouse: https://modelviewer.dev/examples/lighthouse.html
- video performance: https://web.dev/learn/performance/video-performance
- lazy video: https://web.dev/articles/lazy-loading-video

## Mobile ecommerce
- Baymard mobile ecommerce: https://baymard.com/research/mcommerce-usability
- Checkout UX: https://baymard.com/research-articles/current-state-of-checkout-ux
- Payment UX: https://baymard.com/learn/payment-ux
- Product list/filter UX: https://baymard.com/research-articles/current-state-product-list-and-filtering

## Payment providers
- Cashfree pricing: https://www.cashfree.com/payment-gateway-charges/
- Cashfree UPI / dynamic QR: https://www.cashfree.com/upi-payment-gateway/
- PhonePe PG pricing: https://www.phonepe.com/business-solutions/payment-gateway/pricing/
- Razorpay pricing/offer: https://razorpay.com/blog/
- Razorpay QR API: https://razorpay.com/docs/api/qr-codes/entity/
- Paytm dynamic QR: https://business.paytm.com/docs/dynamic-qr-code-payments
- Paytm webhook: https://business.paytm.com/docs/callback-and-webhook/
- Zoho Payments pricing: https://www.zoho.com/in/payments/pricing/
- Easebuzz PG: https://easebuzz.in/online-payment-gateway-India/
- PayKun pricing: https://paykun.com/pricing
- CCAvenue: https://www.ccavenue.com/
- Instamojo: https://www.instamojo.com/payment-gateway/

## Bank / acquirer dynamic UPI
- HDFC SmartHub Vyapar: https://www.hdfc.bank.in/msme-banking/smarthub-vyapar-merchant-app/payment-solutions
- ICICI UPI Collections: https://www.icici.bank.in/business-banking/cms/merchant-solutions/upi-collections
- Axis UPI merchant APIs: https://www.axis.bank.in/payments/payment-methods/upi
- Kotak UPI APIs: https://www.kotak.bank.in/en/open-banking/upi.html

## Regulation
- PIB UPI Sep 2026: https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310586&lang=1&reg=3
- RBI payment operators: https://www.rbi.org.in/
- FoSCoS: https://foscos.fssai.gov.in/

## Stack
- Next.js releases: https://nextjs.org/blog
- React 19.3: https://react.dev/blog/2026/09/09/react-19-3
- Cloudflare Next.js/vinext: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- R2 pricing: https://developers.cloudflare.com/r2/pricing/

---

# PART XXVII — V2 DEFINITION OF DONE

B38 V2 is not done when it has “premium animations.”

It is done when all of the following are true:

1. The primary 390px experience looks intentionally designed, not compressed from desktop.
2. The first screen communicates custom/design capability and gives an order path immediately.
3. The predesigned archive is a genuine first-class commerce section.
4. Real B38 photos are ingested, tagged and transformed into catalogue records.
5. No unseen/unverified Google Photos content was hallucinated.
6. Existing design → personalisation is deterministic where rules exist.
7. Existing design → meaningful customisation has explicit commercial handling.
8. Bespoke starts from a structured brief and ends in a fixed quote.
9. Prices cannot be modified by the browser.
10. Normal online UPI payment does not rely on an editable static QR.
11. Mobile UPI uses intent/hosted provider flow with an exact server-created amount.
12. Desktop can use a unique fixed-amount dynamic QR.
13. Payment success is confirmed server-to-server/webhook/status API, not by screenshot.
14. Provider webhooks are verified and idempotent.
15. Reconciliation repairs delayed/missed callbacks automatically.
16. A real current merchant-provider comparison has been completed for B38.
17. Cashfree’s current promotion and bank dynamic-QR options were actually checked during onboarding.
18. Oct 15, 2026 UPI MDR implications were revalidated before go-live.
19. The homepage does not load 3D code/model as part of initial LCP.
20. A real photo/video hero exists or a strong static real-photo fallback exists.
21. If 3D exists, it is progressive enhancement and has an explicit business purpose.
22. The owner can publish a completed cake into the designs archive with minimal effort.
23. Availability prevents overbooking.
24. Mobile checkout has no mandatory account creation.
25. Customer can track an order securely without an account.
26. Owner dashboard answers “what do I need to do now?”
27. Real reviews are permissioned; fake reviews/stats do not exist.
28. Core accessibility and mobile performance gates pass.
29. Production contains no placeholder media/text.
30. The site feels like **B38**, not like a generated bakery starter kit.

---

# FINAL V2 PRINCIPLE

The highest-value “advanced” thing B38 can do is not a 3D animation.

It is to turn the baker’s accumulated real work into a **living, searchable, directly orderable design library**, then make custom work feel just as structured as buying a normal product.

Use cinematic media and 3D only to make that truth more legible.

The desired customer thought is:

> **“I can see that they really make these designs. I can choose one, change what I need, know what it costs, and pay without a long conversation — and if I want something completely different, they have a proper way to do that too.”**
