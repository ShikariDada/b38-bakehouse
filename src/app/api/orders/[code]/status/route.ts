import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashToken } from "@/lib/tokens";

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const token = new URL(req.url).searchParams.get("t") || "";
  const order = db
    .prepare("SELECT status, amount_paid_paise, total_paise FROM orders WHERE public_code = ? AND tracking_token_hash = ?")
    .get(code, hashToken(token)) as { status: string } | undefined;
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ status: order.status });
}
