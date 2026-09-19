import db from "@/lib/db";
import { formatINR } from "@/lib/money";

// Studio server actions, centralised so each route file stays readable.
export function getStudioAction() {
  return {
    transition(formData: FormData) {
      const orderId = Number(formData.get("orderId"));
      const to = String(formData.get("to"));
      const allowed: Record<string, string[]> = {
        awaiting_payment: ["confirmed", "cancelled"],
        partially_paid: ["confirmed", "cancelled"],
        confirmed: ["in_production", "cancelled"],
        in_production: ["ready", "cancelled"],
        ready: ["out_for_delivery", "completed"],
        out_for_delivery: ["completed"],
      };
      const order = db.prepare("SELECT id, status FROM orders WHERE id = ?").get(orderId) as { id: number; status: string } | undefined;
      if (!order || !allowed[order.status]?.includes(to)) return;
      db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(to, orderId);
      db.prepare("INSERT INTO order_events (order_id, from_status, to_status, actor) VALUES (?, ?, ?, 'studio')").run(orderId, order.status, to);
    },

    verifyPayment(formData: FormData) {
      const paymentId = Number(formData.get("paymentId"));
      const orderId = Number(formData.get("orderId"));
      const p = db.prepare("SELECT * FROM payments WHERE id = ? AND order_id = ?").get(paymentId, orderId) as any;
      const o = db.prepare("SELECT total_paise, amount_paid_paise, status FROM orders WHERE id = ?").get(orderId) as any;
      if (!p || !o) return;
      const paid = o.amount_paid_paise + p.amount_paise;
      const newStatus = paid >= o.total_paise ? "confirmed" : "partially_paid";
      const tx = db.transaction(() => {
        db.prepare("UPDATE payments SET status = 'succeeded', verified_at = datetime('now'), utr = COALESCE(utr, 'manual-verify'), updated_at = datetime('now') WHERE id = ?").run(paymentId);
        db.prepare("UPDATE orders SET amount_paid_paise = ?, status = ?, updated_at = datetime('now') WHERE id = ?").run(paid, newStatus, orderId);
        db.prepare("INSERT INTO order_events (order_id, from_status, to_status, note, actor) VALUES (?, ?, ?, ?, 'studio')").run(orderId, o.status, newStatus, `Manual verification · ${formatINR(p.amount_paise)}`);
      });
      tx();
    },

    sendQuote(formData: FormData) {
      const requestId = Number(formData.get("requestId"));
      const total = Math.round(Number(formData.get("totalRupees")) * 100);
      const depositPct = Number(formData.get("depositPct") || 50);
      const expiryDays = Number(formData.get("expiryDays") || 3);
      const specText = String(formData.get("spec") || "").slice(0, 4000);
      const r = db.prepare("SELECT * FROM custom_requests WHERE id = ?").get(requestId) as any;
      if (!r || total <= 0) return;

      const version = ((db.prepare("SELECT COALESCE(MAX(version),0) v FROM quotes WHERE request_id = ?").get(requestId) as any).v || 0) + 1;
      const deposit = Math.round(total * depositPct / 100);
      const expires = new Date(Date.now() + expiryDays * 86400000).toISOString();

      const info = db.prepare(`
        INSERT INTO quotes (request_id, version, status, spec_json, subtotal_paise, delivery_paise, total_paise, deposit_paise, expires_at, sent_at)
        VALUES (?, ?, 'sent', ?, ?, 0, ?, ?, ?, datetime('now'))
      `).run(requestId, version, JSON.stringify({ spec: specText }), total, total, deposit, expires);
      void info;

      db.prepare("UPDATE custom_requests SET status = 'quoted' WHERE id = ?").run(requestId);
    },

    declineRequest(formData: FormData) {
      const requestId = Number(formData.get("requestId"));
      db.prepare("UPDATE custom_requests SET status = 'declined' WHERE id = ?").run(requestId);
    },
  };
}
