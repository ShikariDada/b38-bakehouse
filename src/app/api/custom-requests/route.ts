import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import db from "@/lib/db";
import { requestId, trackingToken, hashToken } from "@/lib/tokens";

const BUDGET_LABELS: Record<string, string> = {
  b1: "₹700–1,200", b2: "₹1,200–1,800", b3: "₹1,800–2,800", b4: "₹2,800+",
};

// Save one data-URL image into the private uploads dir. Re-encoded as JPEG by the
// browser-side canvas normally; here we accept data URLs only, never executable types.
function saveRef(publicCode: string, idx: number, dataUrl: string): string | null {
  const m = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/.exec(dataUrl);
  if (!m || m[2].length > 12 * 1024 * 1024) return null;
  const ext = m[1] === "jpeg" ? "jpg" : m[1];
  const dir = path.join(process.cwd(), "data", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const rel = path.join("uploads", `${publicCode}-ref${idx}.${ext}`);
  fs.writeFileSync(path.join(process.cwd(), "data", rel), Buffer.from(m[2], "base64"));
  return rel.replace(/\\/g, "/");
}

export async function POST(req: Request) {
  const b = (await req.json()) as {
    occasion: string; person: string; eventDate: string;
    refs: { dataUrl: string; note: string }[];
    mustKeep: string; avoid: string; servings: string; flavour: string; eggless: boolean; allergies: string;
    styles: string[]; colorNotes: string; name: string; age: string; message: string;
    budget: string; fulfilment: "pickup" | "delivery"; address: string;
    contactName: string; phone: string; notes: string;
    startDesign: string | null;
  };

  if (!b.occasion || !b.eventDate || !b.contactName || !/^\d{10}$/.test(b.phone || "")) {
    return NextResponse.json({ error: "Occasion, date, your name and a 10-digit phone are required." }, { status: 422 });
  }
  const days = (new Date(b.eventDate + "T12:00:00+05:30").getTime() - Date.now()) / 86400000;
  if (days < 3) return NextResponse.json({ error: "Custom cakes need at least 3 days. Pick a later date." }, { status: 422 });

  const code = requestId();
  const token = trackingToken();
  const refs = (b.refs || []).slice(0, 5).map((r, i) => saveRef(code, i, r.dataUrl)).filter(Boolean);

  const info = db.prepare(`
    INSERT INTO custom_requests (public_code, tracking_token_hash, design_id, name, phone, occasion, event_date,
      servings, flavour, eggless, must_keep, avoid, color_notes, budget_band, fulfilment, address_json,
      message_text, refs_json)
    VALUES (?, ?, (SELECT id FROM designs WHERE slug = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    code, hashToken(token), b.startDesign,
    b.contactName, b.phone, `${b.occasion}${b.person ? ` — ${b.person}` : ""}`, b.eventDate,
    b.servings, b.flavour, b.eggless ? 1 : 0,
    [b.mustKeep, b.allergies && `Allergies: ${b.allergies}`].filter(Boolean).join(" | "),
    b.avoid, b.colorNotes, BUDGET_LABELS[b.budget] ?? "", b.fulfilment,
    b.fulfilment === "delivery" ? JSON.stringify({ line: b.address }) : null,
    [b.message && `Text: “${b.message}”`, b.name && `Name: ${b.name}`, b.age && `Age: ${b.age}`, b.styles.length && `Looks: ${b.styles.join(", ")}`, b.notes]
      .filter(Boolean).join(" · "),
    JSON.stringify(refs),
  );

  return NextResponse.json({ code, token, id: info.lastInsertRowid });
}
