// Seeds the SQLite DB from content/*.json. Idempotent: designs are upserted by slug.
import Database from "better-sqlite3";
import fs from "node:fs";

run(Database);

function run(Db) {
  const db = new Db("data/b38.db");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 8000");
  db.exec(fs.readFileSync("scripts/schema.sql", "utf8"));

  const designs = JSON.parse(fs.readFileSync("content/designs.json", "utf8"));
  const manifest = JSON.parse(fs.readFileSync("content/media-manifest.json", "utf8"));
  const tiers = designs.priceTiers;

  const upsert = db.prepare(`
    INSERT INTO designs (slug, number, name, tagline, story, tier, base_kg_paise, lead_hours,
      capacity_points, rush_allowed, style_tags, occasion_tags, color_tags, personalise_extras, sort)
    VALUES (@slug, @number, @name, @tagline, @story, @tier, @base_kg_paise, @lead_hours,
      @capacity_points, @rush_allowed, @style_tags, @occasion_tags, @color_tags, @personalise_extras, @sort)
    ON CONFLICT(slug) DO UPDATE SET
      name=@name, tagline=@tagline, story=@story, tier=@tier, base_kg_paise=@base_kg_paise,
      lead_hours=@lead_hours, capacity_points=@capacity_points, rush_allowed=@rush_allowed,
      style_tags=@style_tags, occasion_tags=@occasion_tags, color_tags=@color_tags,
      personalise_extras=@personalise_extras, sort=@sort, updated_at=datetime('now')
  `);
  const getId = db.prepare("SELECT id FROM designs WHERE slug = ?");
  const clearImgs = db.prepare("DELETE FROM design_images WHERE design_id = ?");
  const addImg = db.prepare(`
    INSERT INTO design_images (design_id, photo, card, card_avif, card_sm, full, full_avif, role, sort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedAll = db.transaction(() => {
    designs.designs.forEach((d, i) => {
      const tier = tiers[d.priceTier];
      upsert.run({
        slug: d.slug,
        number: d.number,
        name: d.name,
        tagline: d.tagline,
        story: d.story,
        tier: tier.label,
        base_kg_paise: tier.kgPaise,
        lead_hours: d.leadTimeH,
        capacity_points: d.capacityPoints,
        rush_allowed: d.rushAllowed ? 1 : 0,
        style_tags: JSON.stringify(d.styleTags),
        occasion_tags: JSON.stringify(d.occasionTags),
        color_tags: JSON.stringify(d.colorTags),
        personalise_extras: JSON.stringify(d.personaliseExtras || []),
        sort: i,
      });
      const id = getId.get(d.slug).id;
      clearImgs.run(id);
      const imgs = manifest.designs[d.slug].images;
      imgs.forEach((im, j) => {
        addImg.run(id, im.photo, im.card, im.cardAvif, im.cardSm, im.full, im.fullAvif, j === 0 ? "hero" : "gallery", j);
      });
    });

    // flavours (adjustments in paise; seasonal note via name suffix)
    db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('flavours','addons','delivery_zones','designs','design_images')").run();
    const fl = db.prepare("DELETE FROM flavours");
    fl.run();
    const addFl = db.prepare("INSERT INTO flavours (name, adjustment_paise, sort) VALUES (?, ?, ?)");
    [
      ["Belgian Chocolate", 0],
      ["Butterscotch", 0],
      ["Vanilla Bean", 0],
      ["Pineapple", 0],
      ["Red Velvet", 10000],
      ["Blueberry", 10000],
      ["Coffee Mocha", 5000],
      ["Mango (in season)", 5000],
    ].forEach(([n, p], i) => addFl.run(n, p, i));

    // add-ons
    db.prepare("DELETE FROM addons").run();
    const addAddon = db.prepare("INSERT INTO addons (name, description, price_paise, sort) VALUES (?, ?, ?, ?)");
    [
      ["Candle set", "A small set of candles, packed with the cake", 5000],
      ["Candles + knife", "Candles, matches and a serving knife", 8000],
      ["Edible photo print", "Your photo printed on icing — best on flat-top designs", 20000],
    ].forEach(([n, dsc, p], i) => addAddon.run(n, dsc, p, i));

    // delivery zones — real Mathura pincodes, owner-editable in Studio
    db.prepare("DELETE FROM delivery_zones").run();
    const addZone = db.prepare("INSERT INTO delivery_zones (name, pincodes, fee_paise) VALUES (?, ?, ?)");
    addZone.run("Mathura city (Krishna Nagar, Civil Lines, Holipura, Dampier Nagar & nearby)", "281001", 9900);
    addZone.run("Greater Mathura (Ramanreti, Gopeshwar, Sonkh Road)", "281003,281004", 14900);
    addZone.run("Vrindavan", "281121", 19900);

    // business settings
    const setS = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value");
    const s = {
      businessName: "B38 Bake House",
      ownerName: "Chhaya Savargaonkar",
      phoneDisplay: "+91 93685 65911",
      phoneE164: "919368565911",
      whatsapp: "919368565911",
      instagram: "https://www.instagram.com/b38bakehouse/",
      address: "38-B, Krishna Nagar, Mathura, Uttar Pradesh 281001",
      mapsLink: "https://share.google/wQvcuRD0P29AFX6d5",
      city: "Mathura",
      defaultCapacityPoints: "6",
      defaultLeadHours: "48",
      depositPercent: "50",
      quoteExpiryDays: "3",
      upiVpa: "",
      upiPayeeName: "B38 Bake House",
      fssaiNumber: "",
    };
    Object.entries(s).forEach(([k, v]) => setS.run(k, String(v)));

    // a few future capacity blocks so the calendar demonstrates blackouts (owner can clear in Studio)
    const d1 = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
    db.prepare("INSERT INTO capacity_days (date, blocked, note) VALUES (?, 1, 'Held — family commitment') ON CONFLICT(date) DO NOTHING").run(d1);
  });

  seedAll();
  const n = db.prepare("SELECT COUNT(*) c FROM designs").get().c;
  const ni = db.prepare("SELECT COUNT(*) c FROM design_images").get().c;
  console.log(`Seeded ${n} designs, ${ni} images, flavours/addons/zones/settings.`);
  db.close();
}
