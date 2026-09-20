// Server-authoritative pricing. The browser never sends totals — it sends option IDs,
// and this engine recomputes everything from the DB.
import db from "./db";
import { formatINR } from "./money";
import { getDesign, listAddons, listFlavours, listZones, variantPrices, type Design } from "./catalog";

export type OrderSelection = {
  designSlug: string;
  variantId: string;
  flavourId: number;
  eggless: boolean;
  message: string;
  addons: number[]; // addon ids
  fulfilment: "pickup" | "delivery";
  deliveryPincode?: string;
  eventDate: string; // yyyy-mm-dd
  couponCode?: string;
};

export type QuoteLine = { label: string; detail?: string; paise: number };
export type ComputedQuote = {
  lines: QuoteLine[];
  subtotalPaise: number;
  deliveryPaise: number;
  discountPaise: number;
  totalPaise: number;
  capacityPoints: number;
  leadHours: number;
  rushApplied: boolean;
  variantLabel: string;
  designName: string;
};

export function computeQuote(sel: OrderSelection): { ok: true; quote: ComputedQuote } | { ok: false; error: string } {
  const design = getDesign(sel.designSlug);
  if (!design || !design.active) return { ok: false, error: "This design isn't available." };

  const variants = variantPrices(design.baseKgPaise);
  const variant = variants.find(v => v.id === sel.variantId);
  if (!variant) return { ok: false, error: "Pick a size." };

  const flavours = listFlavours();
  const flavour = flavours.find(f => f.id === sel.flavourId);
  if (!flavour) return { ok: false, error: "Pick a flavour." };

  const allAddons = listAddons();
  const chosenAddons = allAddons.filter(a => sel.addons.includes(a.id));

  const lines: QuoteLine[] = [
    { label: `${design.name} · ${variant.label}`, detail: variant.serves, paise: variant.pricePaise },
  ];
  if (flavour.adjustment_paise !== 0) {
    lines.push({
      label: flavour.name,
      detail: flavour.adjustment_paise > 0 ? undefined : "included",
      paise: flavour.adjustment_paise,
    });
  } else {
    lines[0].detail = `${variant.serves} · ${flavour.name}`;
  }
  if (sel.eggless) lines.push({ label: "Eggless", paise: 5000 });

  for (const a of chosenAddons) {
    lines.push({ label: a.name, paise: a.price_paise });
  }

  // rush: inside the lead window but with at least 24h
  const hoursToEvent = (new Date(sel.eventDate + "T12:00:00+05:30").getTime() - Date.now()) / 3600000;
  let rushApplied = false;
  if (design.rushAllowed && hoursToEvent < design.leadHours && hoursToEvent >= 24) {
    rushApplied = true;
    const sofar = lines.reduce((s, l) => s + l.paise, 0);
    lines.push({ label: "Short-notice making", detail: "under 48 hours", paise: Math.round(sofar * 0.15 / 1000) * 1000 });
  }

  let deliveryPaise = 0;
  if (sel.fulfilment === "delivery") {
    const zones = listZones().filter(z => z.active);
    const zone = zones.find(z => z.pincodes.split(",").map(s => s.trim()).includes(sel.deliveryPincode ?? ""));
    if (!zone) return { ok: false, error: "We don't deliver to that pincode yet — pickup is available, or send a custom request." };
    deliveryPaise = zone.fee_paise;
  }

  const subtotal = lines.reduce((s, l) => s + l.paise, 0);
  let discount = 0;
  let couponCode: string | null = null;
  if (sel.couponCode) {
    const code = sel.couponCode.trim().toUpperCase();
    const c = db
      .prepare("SELECT * FROM coupons WHERE code = ?")
      .get(code) as
      | { id: number; kind: string; value: number; min_spend_paise: number; max_discount_paise: number | null; starts_at: string | null; ends_at: string | null; usage_limit: number | null; used_count: number; active: number }
      | undefined;
    if (!c || !c.active) return { ok: false, error: "That code isn't active." };
    const now = new Date().toISOString().slice(0, 10);
    if (c.starts_at && now < c.starts_at) return { ok: false, error: "That code isn't active yet." };
    if (c.ends_at && now > c.ends_at) return { ok: false, error: "That code has expired." };
    if (c.usage_limit && c.used_count >= c.usage_limit) return { ok: false, error: "That code has been fully used." };
    if (subtotal < c.min_spend_paise) {
      return { ok: false, error: `That code works on orders above ${formatINR(c.min_spend_paise)}.` };
    }
    discount = c.kind === "percent" ? Math.round((subtotal * c.value) / 100 / 1000) * 1000 : c.value;
    if (c.max_discount_paise) discount = Math.min(discount, c.max_discount_paise);
    discount = Math.min(discount, subtotal);
    couponCode = code;
    lines.push({ label: `Coupon ${code}`, paise: -discount });
  }

  return {
    ok: true,
    quote: {
      lines,
      subtotalPaise: subtotal,
      deliveryPaise,
      discountPaise: discount,
      totalPaise: subtotal + deliveryPaise - discount,
      capacityPoints: design.capacityPoints,
      leadHours: design.leadHours,
      rushApplied,
      variantLabel: variant.label,
      designName: design.name,
    },
  };
}

export function earliestDate(leadHours: number): string {
  const d = new Date(Date.now() + leadHours * 3600000);
  // next day cutoff: orders placed after 6pm push one more day
  const istHour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  if (istHour >= 18) d.setTime(d.getTime() + 86400000);
  return d.toISOString().slice(0, 10);
}
