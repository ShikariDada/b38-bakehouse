import db from "./db";

export type BizSettings = {
  businessName: string;
  ownerName: string;
  phoneDisplay: string;
  phoneE164: string; // 919368565911
  whatsapp: string; // 919368565911
  instagram: string;
  address: string;
  mapsLink: string;
  city: string;
  defaultCapacityPoints: number;
  defaultLeadHours: number;
  depositPercent: number;
  quoteExpiryDays: number;
  upiVpa: string;
  upiPayeeName: string;
  fssaiNumber: string;
};

const DEFAULTS: BizSettings = {
  businessName: "B38 Bake House",
  ownerName: "Chhaya Savargaonkar",
  phoneDisplay: "+91 93685 65911",
  phoneE164: "919368565911",
  whatsapp: "919368565911",
  instagram: "https://www.instagram.com/b38bakehouse/",
  address: "38-B, Krishna Nagar, Mathura, Uttar Pradesh 281001",
  mapsLink: "https://share.google/wQvcuRD0P29AFX6d5",
  city: "Mathura",
  defaultCapacityPoints: 6,
  defaultLeadHours: 48,
  depositPercent: 50,
  quoteExpiryDays: 3,
  upiVpa: "",
  upiPayeeName: "B38 Bake House",
  fssaiNumber: "",
};

export function getSettings(): BizSettings {
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  const stored = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return { ...DEFAULTS, ...stored } as BizSettings;
}

export function setSetting(key: string, value: string) {
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  ).run(key, value);
}
