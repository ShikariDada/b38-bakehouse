import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashToken, signPayload, webhookSecret } from "@/lib/tokens";

// Creates a payment attempt for an order through the active provider adapter.
// The default adapter is MockUpiProvider: it mirrors the exact flow a real
// gateway follows (server-created order → signed webhook → verification),
// so swapping in Cashfree later means implementing one file.
export async function POST(req: Request) {
  const { code, token, method } = (await req.json()) as { code: string; token: string; method: "mock_upi" | "direct_upi" };
  const order = db
    .prepare("SELECT id, public_code, total_paise, amount_paid_paise, status FROM orders WHERE public_code = ? AND tracking_token_hash = ?")
    .get(code, hashToken(token)) as { id: number; total_paise: number; amount_paid_paise: number; status: string } | undefined;
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (["cancelled", "expired"].includes(order.status)) return NextResponse.json({ error: "This order can no longer be paid." }, { status: 422 });

  const dueNow = order.total_paise - order.amount_paid_paise;
  const providerOrderId = `MOCK-${code}-${Date.now().toString(36)}`;

  db.prepare("INSERT INTO payments (order_id, provider, method, provider_order_id, amount_paise, status) VALUES (?, 'mock', ?, ?, ?, 'pending')")
    .run(order.id, method, providerOrderId, dueNow);

  // The mock gateway exposes an approval endpoint that will fire the signed webhook,
  // exactly like a real provider's server-to-server callback would.
  return NextResponse.json({
    attemptId: providerOrderId,
    dueNow,
    approvePath: `/api/mock-gateway/approve`,
  });
}

export async function GET() {
  return NextResponse.json({ provider: "mock", capabilities: { upiIntent: true, dynamicQr: true, cards: false } });
}

export function signForTest(payload: object) {
  return signPayload(JSON.stringify(payload), webhookSecret());
}
