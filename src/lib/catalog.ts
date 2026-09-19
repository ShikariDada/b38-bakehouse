import db from "./db";

export type DesignImage = {
  photo: string;
  card: string;
  cardAvif: string | null;
  cardSm: string;
  full: string;
  fullAvif: string | null;
  role: string;
};

export type Design = {
  id: number;
  slug: string;
  number: number;
  name: string;
  tagline: string;
  story: string;
  tier: string;
  baseKgPaise: number;
  leadHours: number;
  capacityPoints: number;
  rushAllowed: boolean;
  styleTags: string[];
  occasionTags: string[];
  colorTags: string[];
  personaliseExtras: string[];
  active: boolean;
  featured: boolean;
  images: DesignImage[];
};

type DesignRow = {
  id: number;
  slug: string;
  number: number;
  name: string;
  tagline: string;
  story: string;
  tier: string;
  base_kg_paise: number;
  lead_hours: number;
  capacity_points: number;
  rush_allowed: number;
  style_tags: string;
  occasion_tags: string;
  color_tags: string;
  personalise_extras: string;
  active: number;
  featured: number;
};

function parseTags(row: DesignRow, images: DesignImage[]): Design {
  return {
    id: row.id,
    slug: row.slug,
    number: row.number,
    name: row.name,
    tagline: row.tagline,
    story: row.story,
    tier: row.tier,
    baseKgPaise: row.base_kg_paise,
    leadHours: row.lead_hours,
    capacityPoints: row.capacity_points,
    rushAllowed: !!row.rush_allowed,
    styleTags: JSON.parse(row.style_tags),
    occasionTags: JSON.parse(row.occasion_tags),
    colorTags: JSON.parse(row.color_tags),
    personaliseExtras: JSON.parse(row.personalise_extras),
    active: !!row.active,
    featured: !!row.featured,
    images,
  };
}

const imagesStmt = db.prepare("SELECT * FROM design_images WHERE design_id = ? ORDER BY sort");

function withImages(rows: DesignRow[]): Design[] {
  return rows.map(r => parseTags(r, imagesStmt.all(r.id) as unknown as DesignImage[]));
}

export function listDesigns(opts?: { occasion?: string; style?: string; color?: string; maxPrice?: number; eggless?: boolean; includeInactive?: boolean }): Design[] {
  const rows = db
    .prepare(`SELECT * FROM designs ${opts?.includeInactive ? "" : "WHERE active = 1"} ORDER BY sort, number`)
    .all() as DesignRow[];
  let designs = withImages(rows);
  if (opts?.occasion) designs = designs.filter(d => d.occasionTags.includes(opts.occasion!));
  if (opts?.style) designs = designs.filter(d => d.styleTags.includes(opts.style!));
  if (opts?.color) designs = designs.filter(d => d.colorTags.includes(opts.color!));
  if (opts?.maxPrice) designs = designs.filter(d => d.baseKgPaise <= opts.maxPrice!);
  return designs;
}

export function getDesign(slug: string): Design | null {
  const row = db.prepare("SELECT * FROM designs WHERE slug = ?").get(slug) as DesignRow | undefined;
  if (!row) return null;
  return parseTags(row, imagesStmt.all(row.id) as unknown as DesignImage[]);
}

export function variantPrices(baseKgPaise: number) {
  const r50 = (v: number) => Math.round(v / 5000) * 5000;
  return [
    { id: "500g", label: "500 g", serves: "serves 6–8", pricePaise: r50(baseKgPaise * 0.6) },
    { id: "1kg", label: "1 kg", serves: "serves 10–12", pricePaise: baseKgPaise },
    { id: "1.5kg", label: "1.5 kg", serves: "serves 14–16", pricePaise: r50(baseKgPaise * 1.45) },
    { id: "2kg", label: "2 kg", serves: "serves 18–22", pricePaise: r50(baseKgPaise * 1.85) },
  ];
}

export function listFlavours() {
  return db.prepare("SELECT * FROM flavours WHERE active = 1 ORDER BY sort").all() as {
    id: number; name: string; adjustment_paise: number;
  }[];
}

export function listAddons() {
  return db.prepare("SELECT * FROM addons WHERE active = 1 ORDER BY sort").all() as {
    id: number; name: string; description: string; price_paise: number;
  }[];
}

export function listZones() {
  return db.prepare("SELECT * FROM delivery_zones WHERE active = 1").all() as {
    id: number; name: string; pincodes: string; fee_paise: number; active: number;
  }[];
}
