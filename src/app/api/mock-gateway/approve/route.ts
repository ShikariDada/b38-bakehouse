import { NextResponse } from "next/server";
import db from "@/lib/db";
import { signPayload, webhookSecret } from "@/lib/tokens";

// Stands in for the UPI app + gateway server: approves or declines a pending
// mock payment, then delivers the signed webhook exactly like a real provider.
// In production this whole route disappears and the real gateway's SDK takes over.
export async function POST(req: Request) {
  const { providerOrderId, outcome } = (await req.json()) as { providerOrderId: string; outcome: "success" | "failure" };
  const row = db
    .prepare("SELECT id, amount_paise, status FROM payments WHERE provider_order_id = ?")
    .get(providerOrderId) as { id: number; amount_paise: number; status: string } | undefined;
  if (!row || row.status !== "pending") return NextResponse.json({ error: "no pending attempt" }, { status: 404 });

  const event = {
    event_id: `evt_${providerOrderId}_${Date.now().toString(36)}`,
    type: outcome === "success" ? "payment.captured" : "payment.failed",
    provider_order_id: providerOrderId,
    payment_id: `pay_${Math.random().toString(36).slice(2, 12)}`,
    amount_paise: row.amount_paise,
    currency: "INR",
    status: outcome === "success" ? "SUCCESS" : "FAILED",
    utr: outcome === "success" ? `UTR${Math.random().toString().slice(2, 14)}` : undefined,
  };

  const body = JSON.stringify(event);
  const sig = signPayload(body, webhookSecret());

  const origin = new URL(req.url).origin;
  const res = await fetch(`${origin}/api/webhooks/mock`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-mock-signature": sig },
    body,
  });

  return NextResponse.json({ delivered: res.ok, status: res.status });
}
