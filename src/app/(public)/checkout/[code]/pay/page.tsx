import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { PaySimulator } from "@/components/pay-simulator";

export const dynamic = "force-dynamic";

export default async function PayPage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ t?: string; attempt?: string }> }) {
  const { code } = await params;
  const { t, attempt } = await searchParams;
  if (!t || !attempt) notFound();

  const order = db
    .prepare("SELECT id, public_code, total_paise, amount_paid_paise, status FROM orders WHERE public_code = ? AND tracking_token_hash = ?")
    .get(code, hashToken(t)) as { id: number; total_paise: number; amount_paid_paise: number; status: string } | undefined;
  if (!order) notFound();

  const attemptRow = db
    .prepare("SELECT provider_order_id, amount_paise, status FROM payments WHERE provider_order_id = ? AND order_id = ?")
    .get(attempt, order.id) as { provider_order_id: string; amount_paise: number; status: string } | undefined;
  if (!attemptRow) notFound();

  if (["confirmed", "partially_paid"].includes(order.status)) redirect(`/track/${t}`);

  return (
    <PaySimulator
      code={code}
      token={t}
      attemptId={attemptRow.provider_order_id}
      amountPaise={attemptRow.amount_paise}
      orderStatus={order.status}
    />
  );
}
