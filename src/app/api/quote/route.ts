import { NextResponse } from "next/server";
import { computeQuote, type OrderSelection } from "@/lib/pricing";

export async function POST(req: Request) {
  const sel = (await req.json()) as OrderSelection;
  const result = computeQuote(sel);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json(result.quote);
}
