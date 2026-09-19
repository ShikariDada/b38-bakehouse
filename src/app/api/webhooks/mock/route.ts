import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifySignature } from "@/lib/tokens";

type MockEvent = {
  event_id: string;
  type: "payment.captured" | "payment.failed";
  provider_order_id: string;
  payment_id: string;
  amount_paise: number;
  currency: "INR";
  status: "SUCCESS" | "FAILED";
  utr?: string;
};

// Webhook receiver. Mirrors a production gateway handler:
// 1. verify signature  2. idempotency by event id  3. match provider order + amount
// 4. only then mutate order state. Client redirects are never authoritative.
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-mock-signature") || "";
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || "dev-only-webhook-secret";

  if (!verifySignature(raw, sig, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let ev: MockEvent;
  try {
    ev = JSON.parse(raw) as MockEvent;
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  const payloadHash = Buffer.from(raw).toString("base64");
  try {
    db.prepare("INSERT INTO payment_events (provider, event_id, payload_hash, signature_valid, raw) VALUES ('mock', ?, ?, 1, ?)")
      .run(ev.event_id, payloadHash, raw.slice(0, 4000));
  } catch {
    return NextResponse.json({ ok: true, duplicate: true }); // idempotent replay
  }

  const payment = db
    .prepare("SELECT id, order_id, amount_paise, status FROM payments WHERE provider_order_id = ?")
    .get(ev.provider_order_id) as { id: number; order_id: number; amount_paise: number; status: string } | undefined;
  if (!payment) return NextResponse.json({ error: "unknown provider order" }, { status: 404 });
  if (ev.amount_paise !== payment.amount_paise) {
    db.prepare("UPDATE payment_events SET processed_at = datetime('now'), raw = ? WHERE event_id = ?").run(raw + " | AMOUNT MISMATCH", ev.event_id);
    return NextResponse.json({ error: "amount mismatch" }, { status: 422 });
  }

  const order = db.prepare("SELECT id, status, total_paise, amount_paid_paise FROM orders WHERE id = ?").get(payment.order_id) as {
    id: number; status: string; total_paise: number; amount_paid_paise: number;
  };

  const tx = db.transaction(() => {
    if (ev.status === "SUCCESS") {
      // Defensive idempotency beyond event-id: never credit a payment twice,
      // even if a gateway delivers two distinct capture events.
      if (payment.status !== "pending") {
        db.prepare("UPDATE payment_events SET processed_at = datetime('now'), raw = ? WHERE event_id = ?")
          .run(raw + " | ignored: payment already " + payment.status, ev.event_id);
        return;
      }
      const paid = order.amount_paid_paise + ev.amount_paise;
      const newStatus = paid >= order.total_paise ? "confirmed" : "partially_paid";
      db.prepare("UPDATE payments SET status = 'succeeded', provider_payment_id = ?, utr = ?, updated_at = datetime('now') WHERE id = ?")
        .run(ev.payment_id, ev.utr ?? null, payment.id);
      db.prepare("UPDATE orders SET status = ?, amount_paid_paise = ?, updated_at = datetime('now') WHERE id = ?")
        .run(newStatus, paid, order.id);
      db.prepare("INSERT INTO order_events (order_id, from_status, to_status, note, actor) VALUES (?, ?, ?, ?, 'payment-webhook')")
        .run(order.id, order.status, newStatus, `Paid ${(ev.amount_paise / 100).toFixed(0)} via UPI (mock gateway) · ref ${ev.utr ?? ev.payment_id}`);
    } else {
      db.prepare("UPDATE payments SET status = 'failed', failure_message = 'user declined at UPI app', updated_at = datetime('now') WHERE id = ?").run(payment.id);
      db.prepare("INSERT INTO order_events (order_id, from_status, to_status, note, actor) VALUES (?, ?, ?, 'Payment failed at the UPI app', 'payment-webhook')").run(order.id, order.status, order.status);
      db.prepare("UPDATE orders SET status = 'awaiting_payment', updated_at = datetime('now') WHERE id = ?").run(order.id);
    }
    db.prepare("UPDATE payment_events SET processed_at = datetime('now') WHERE event_id = ?").run(ev.event_id);
  });
  tx();

  return NextResponse.json({ ok: true });
}
