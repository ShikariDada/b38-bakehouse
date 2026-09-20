import Link from "next/link";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import db from "@/lib/db";
import { listFlavours } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const TIERS: Record<string, number> = {
  Simple: 105000,
  Detailed: 125000,
  Loaded: 135000,
  Showcase: 145000,
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

async function createDesign(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim().slice(0, 220);
  const story = String(formData.get("story") || "").trim().slice(0, 900);
  const tier = String(formData.get("tier") || "Detailed");
  const baseKg = Math.round(Number(formData.get("baseKgRupees") || TIERS[tier] / 100) * 100);
  const leadHours = Number(formData.get("leadHours") || 48);
  const points = Number(formData.get("capacityPoints") || 2);
  const rush = formData.get("rush") === "on" ? 1 : 0;
  const styleTags = String(formData.get("styleTags") || "").split(",").map(t => t.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean);
  const occasionTags = String(formData.get("occasionTags") || "").split(",").map(t => t.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean);
  const colorTags = String(formData.get("colorTags") || "").split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0).slice(0, 8);

  if (!name || !Number.isFinite(baseKg) || baseKg <= 0 || files.length === 0) return;

  const slug = slugify(name);
  if (!slug || db.prepare("SELECT id FROM designs WHERE slug = ?").get(slug)) return;

  const dir = path.join(process.cwd(), "public", "media", "designs", slug);
  fs.mkdirSync(dir, { recursive: true });

  const number = ((db.prepare("SELECT MAX(number) m FROM designs").get() as any).m || 0) + 1;

  const info = db.prepare(`
    INSERT INTO designs (slug, number, name, tagline, story, tier, base_kg_paise, lead_hours,
      capacity_points, rush_allowed, style_tags, occasion_tags, color_tags, personalise_extras, sort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?)
  `).run(slug, number, name, tagline || name, story, tier, baseKg, leadHours, points, rush,
    JSON.stringify(styleTags), JSON.stringify(occasionTags), JSON.stringify(colorTags), number - 1);

  const designId = Number(info.lastInsertRowid);
  const addImg = db.prepare(`
    INSERT INTO design_images (design_id, photo, card, card_avif, card_sm, full, full_avif, role, sort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < files.length; i++) {
    const buf = Buffer.from(await files[i].arrayBuffer());
    const photo = `custom-${String(number).padStart(2, "0")}-${i + 1}`;
    const base = path.join(dir, photo);
    const img = sharp(buf).rotate();
    await img.clone().resize(800, 1000, { fit: "cover", position: "attention" }).webp({ quality: 82 }).toFile(`${base}-card.webp`);
    await sharp(buf).rotate().resize(480, 600, { fit: "cover", position: "attention" }).webp({ quality: 78 }).toFile(`${base}-card-sm.webp`);
    if (i === 0) await sharp(buf).rotate().resize(800, 1000, { fit: "cover", position: "attention" }).avif({ quality: 62 }).toFile(`${base}-card.avif`);
    await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${base}-full.webp`);
    if (i === 0) await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).avif({ quality: 62 }).toFile(`${base}-full.avif`);
    addImg.run(designId, photo, `${photo}-card.webp`, i === 0 ? `${photo}-card.avif` : null, `${photo}-card-sm.webp`, `${photo}-full.webp`, i === 0 ? `${photo}-full.avif` : null, i === 0 ? "hero" : "gallery", i);
  }
}

export default function NewDesign() {
  return (
    <div>
      <Link href="/studio/designs" className="text-[0.88rem] text-ink-soft underline-offset-2 hover:underline">← Designs</Link>
      <h1 className="display display-md mt-3">Add a new design</h1>
      <p className="mt-1 text-[0.9rem] text-ink-soft max-w-lg">
        Upload the best shots of a cake you have already made. It goes live on the site immediately; tweak the price any time.
      </p>

      <form action={createDesign} className="mt-6 panel p-6 grid gap-5 max-w-2xl" encType="multipart/form-data">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="field-label">Name *</label>
            <input id="name" name="name" required className="field" placeholder="Kesar Pista Royale" />
          </div>
          <div>
            <label htmlFor="tag" className="field-label">One-line hook *</label>
            <input id="tag" name="tagline" required className="field" placeholder="Saffroncream, pistachio dust, gold leaf." />
          </div>
        </div>
        <div>
          <label htmlFor="story" className="field-label">The story (what makes it special)</label>
          <textarea id="story" name="story" rows={3} className="field" />
        </div>
        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="tier" className="field-label">Complexity</label>
            <select id="tier" name="tier" className="field">
              {Object.keys(TIERS).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="field-label">1 kg price ₹</label>
            <input id="price" name="baseKgRupees" type="number" min="1" className="field num" defaultValue={TIERS.Detailed / 100} />
          </div>
          <div>
            <label htmlFor="lead" className="field-label">Notice (hours)</label>
            <input id="lead" name="leadHours" type="number" step="24" min="24" className="field num" defaultValue={48} />
          </div>
          <div>
            <label htmlFor="pts" className="field-label">Oven points</label>
            <input id="pts" name="capacityPoints" type="number" min="1" max="6" className="field num" defaultValue={2} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="styles" className="field-label">Style tags (comma separated)</label>
            <input id="styles" name="styleTags" className="field" placeholder="chocolate, drip" />
          </div>
          <div>
            <label htmlFor="occs" className="field-label">Occasion tags</label>
            <input id="occs" name="occasionTags" className="field" placeholder="birthday, kids" />
          </div>
          <div>
            <label htmlFor="colors" className="field-label">Colour tags</label>
            <input id="colors" name="colorTags" className="field" placeholder="pink, gold" />
          </div>
        </div>
        <div>
          <label htmlFor="photos" className="field-label">Photos * (1 to 8, first one becomes the cover)</label>
          <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required className="field !py-2.5" />
        </div>
        <label className="flex items-center gap-2 text-[0.92rem]">
          <input type="checkbox" name="rush" defaultChecked /> Allow short-notice orders (+15%)
        </label>
        <button className="btn btn-cocoa w-fit">Publish design</button>
      </form>
    </div>
  );
}
