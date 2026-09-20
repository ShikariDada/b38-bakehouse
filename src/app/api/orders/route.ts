import { NextResponse } from "next/server";
import db from "@/lib/db";
import { computeQuote, type OrderSelection } from "@/lib/pricing";
import { canAccept } from "@/lib/capacity";
import { orderCode, trackingToken, hashToken } from "@/lib/tokens";

// Creates an order from a validated selection. Totals are recomputed here —
// the browser's numbers are display-only.
export async function POST(req: Request) {
  const body = (await req.json()) as { selection: OrderSelection; contact?: { name?: string; phone?: string; email?: string } };
  const sel = body.selection;

  const result = computeQuote(sel);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 });
  const quote = result.quote;

  // availability: lead time + capacity (soft-hold happens by status awaiting_payment)
  const hoursTo = (new Date(sel.eventDate + "T12:00:00+05:30").getTime() - Date.now()) / 3600000;
  if (hoursTo < 24) return NextResponse.json({ error: "That's too soon — cakes need at least 24 hours, most need 48." }, { status: 422 });
  if (hoursTo < quote.leadHours && !canAcceptRush(sel, quote.leadHours)) {
    return NextResponse.json({ error: "This design needs more notice for your date. Try a later date or a similar design with shorter lead time." }, { status: 422 });
  }
  if (!canAccept(sel.eventDate, quote.capacityPoints)) {
    return NextResponse.json({ error: "That date just filled up for this design. Pick another date from the calendar." }, { status: 409 });
  }

  const code = orderCode();
  const token = trackingToken();

  const insert = db.prepare(`
    INSERT INTO orders (public_code, tracking_token_hash, order_type, design_id, customer_name, phone, email,
      event_date, fulfilment, address_json, spec_json, status, capacity_points,
      subtotal_paise, delivery_paise, discount_paise, total_paise)
    VALUES (?, ?, 'direct', (SELECT id FROM designs WHERE slug = ?), ?, ?, ?, ?, ?, ?, ?, 'awaiting_payment', ?, ?, ?, ?, ?)
  `);
  const info = insert.run(
    code, hashToken(token), sel.designSlug,
    body.contact?.name ?? "", body.contact?.phone ?? "", body.contact?.email ?? null,
    sel.eventDate, sel.fulfilment,
    sel.fulfilment === "delivery" ? JSON.stringify({ pincode: sel.deliveryPincode }) : null,
    JSON.stringify({ selection: sel, quote }),
    quote.capacityPoints,
    quote.subtotalPaise, quote.deliveryPaise, quote.discountPaise, quote.totalPaise,
  );
  db.prepare("INSERT INTO order_events (order_id, to_status, note) VALUES (?, 'awaiting_payment', 'Order created; capacity softly held for 30 minutes')").run(info.lastInsertRowid);
  if (sel.couponCode) {
    db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE code = ?').run(sel.couponCode.trim().toUpperCase());
  }

  return NextResponse.json({ code, token, total: quote.totalPaise });
}

function canAcceptRush(sel: OrderSelection, leadHours: number): boolean {
  // computeQuote already enforced rush fee rules; here we re-check the design allows rush
  const selAny = sel as OrderSelection & { _rush?: boolean };
  void selAny;
  void leadHours;
  const design = db.prepare("SELECT rush_allowed FROM designs WHERE slug = ?").get(sel.designSlug) as { rush_allowed: number } | undefined;
  return !!design?.rush_allowed;
}
