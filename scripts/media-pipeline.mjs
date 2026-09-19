// B38 media pipeline — turns the private Google-Photos export into published derivatives.
// Originals stay private in _incoming/ (gitignored); only optimized derivatives ship in /public.
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const SRC = "_incoming/b38-photos-cleaned"; // watermark-free + enhanced
const OUT = "public/media";

// Design archive produced by reviewing every photo in the album (Sep 2026).
// role: hero = primary shot; gallery = extra angles; secondary = same design, weaker frame.
const MAP = [
  { slug: "cocoa-drip-crown",        n: "01", hero: "photo-01" },
  { slug: "blue-hour-milestone",     n: "02", hero: "photo-02" },
  { slug: "blue-blossom-wreath",     n: "03", hero: "photo-03" },
  { slug: "black-forest-classic",    n: "04", hero: "photo-04", extra: ["photo-11"] },
  { slug: "powder-blue-rosette",     n: "05", hero: "photo-05" },
  { slug: "sapphire-shell-ring",     n: "06", hero: "photo-06" },
  { slug: "vintage-rose-fringe",     n: "07", hero: "photo-07" },
  { slug: "lavender-daisy-field",    n: "08", hero: "photo-08" },
  { slug: "midnight-oreo-gold",      n: "09", hero: "photo-09" },
  { slug: "midnight-truffle-nuts",   n: "10", hero: "photo-10" },
  { slug: "cream-oreo-name-cake",    n: "11", hero: "photo-12" },
  { slug: "mint-daisy-ribbons",      n: "12", hero: "photo-13" },
  { slug: "blue-rosette-garden",     n: "13", hero: "photo-14" },
  { slug: "pastel-rose-wreath",      n: "14", hero: "photo-15" },
  { slug: "blush-ruffle-medallion",  n: "15", hero: "photo-16" },
  { slug: "rainbow-rosette-crown",   n: "16", hero: "photo-17" },
  { slug: "oreo-overload-drip",      n: "17", hero: "photo-18" },
  { slug: "orchard-fruit-cream",     n: "18", hero: "photo-20", extra: ["photo-19"] },
  { slug: "lavender-ombre-pearls",   n: "19", hero: "photo-22", extra: ["photo-25", "photo-24", "photo-21", "photo-23"] },
  { slug: "groom-stop-ceremony",     n: "20", hero: "photo-28", extra: ["photo-27", "photo-29", "photo-30", "photo-26"] },
];

const heroPicks = Object.fromEntries(MAP.map(m => [m.hero, m.slug]));
const galleryMap = {};
for (const m of MAP) {
  galleryMap[m.hero] = { slug: m.slug, idx: 0 };
  (m.extra || []).forEach((p, i) => (galleryMap[p] = { slug: m.slug, idx: i + 1 }));
}

async function dimsOf(file) {
  const m = await sharp(file).metadata();
  return { w: m.width, h: m.height };
}

const manifest = { generatedAt: new Date().toISOString(), designs: {}, hero: {}, files: [] };

for (const entry of MAP) {
  const dir = path.join(OUT, "designs", entry.slug);
  await mkdir(dir, { recursive: true });
  const files = [entry.hero, ...(entry.extra || [])];
  manifest.designs[entry.slug] = { number: entry.n, images: [] };

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const src = path.join(SRC, `${f}.jpg`);
    const buf = await readFile(src);
    const sha = createHash("sha256").update(buf).digest("hex").slice(0, 16);
    const { w, h } = await dimsOf(src);
    const base = path.join(dir, f);

    // 4:5 catalogue card (attention crop keeps the cake centered)
    const card = sharp(src).resize(800, 1000, { fit: "cover", position: sharp.strategy.attention });
    await card.clone().webp({ quality: 82 }).toFile(`${base}-card.webp`);
    await sharp(src).resize(480, 600, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: 78 }).toFile(`${base}-card-sm.webp`);
    if (i === 0) await card.clone().avif({ quality: 62 }).toFile(`${base}-card.avif`);

    // full-aspect detail (cap 1600w)
    const full = sharp(src).resize({ width: 1600, withoutEnlargement: true });
    await full.clone().webp({ quality: 82 }).toFile(`${base}-full.webp`);
    if (i === 0) await full.clone().avif({ quality: 62 }).toFile(`${base}-full.avif`);

    manifest.designs[entry.slug].images.push({
      photo: f, sha256_16: sha, width: w, height: h,
      role: i === 0 ? "hero" : "gallery",
      card: `/media/designs/${entry.slug}/${f}-card.webp`,
      cardAvif: i === 0 ? `/media/designs/${entry.slug}/${f}-card.avif` : null,
      full: `/media/designs/${entry.slug}/${f}-full.webp`,
      fullAvif: i === 0 ? `/media/designs/${entry.slug}/${f}-full.avif` : null,
      cardSm: `/media/designs/${entry.slug}/${f}-card-sm.webp`,
    });
    manifest.files.push(f);
  }
}

// Homepage hero — lavender ombre (brightest, most striking real shot), plus OG image.
await mkdir(path.join(OUT, "hero"), { recursive: true });
const heroSrc = path.join(SRC, "photo-22.jpg");
await sharp(heroSrc).resize(2400, 1500, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: 84 }).toFile(`${OUT}/hero/hero-desktop.webp`);
await sharp(heroSrc).resize(2400, 1500, { fit: "cover", position: sharp.strategy.attention }).avif({ quality: 62 }).toFile(`${OUT}/hero/hero-desktop.avif`);
await sharp(heroSrc).resize(1080, 1350, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: 82 }).toFile(`${OUT}/hero/hero-mobile.webp`);
await sharp(heroSrc).resize(1080, 1350, { fit: "cover", position: sharp.strategy.attention }).avif({ quality: 62 }).toFile(`${OUT}/hero/hero-mobile.avif`);
await sharp(heroSrc).resize(1200, 630, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: 82 }).toFile(`${OUT}/hero/og-image.webp`);
manifest.hero = {
  desktop: "/media/hero/hero-desktop.webp", desktopAvif: "/media/hero/hero-desktop.avif",
  mobile: "/media/hero/hero-mobile.webp", mobileAvif: "/media/hero/hero-mobile.avif",
  og: "/media/hero/og-image.webp",
  source: "photo-22.jpg (B38 album, Dec 2025)",
};

// Section imagery: process/craft strip (crop macros from distinctive designs)
const macros = [
  ["photo-07", "fringe"],   // pink piping texture
  ["photo-09", "drip"],     // ganache + gold
  ["photo-13", "petals"],   // teal texture + daisies
  ["photo-28", "topper"],   // groom stop topper
];
for (const [f, name] of macros) {
  const src = path.join(SRC, `${f}.jpg`);
  await sharp(src).resize(900, 1100, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: 80 }).toFile(`${OUT}/hero/macro-${name}.webp`);
}

await writeFile("content/media-manifest.json", JSON.stringify(manifest, null, 2));
console.log(`Processed ${manifest.files.length} photos into ${MAP.length} design folders. Hero + macros done.`);
