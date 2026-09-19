import Link from "next/link";
import db from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  awaiting_payment: "awaiting payment", partially_paid: "part paid", confirmed: "confirmed",
  scheduled: "scheduled", in_production: "in production", ready: "ready",
  out_for_delivery: "out for delivery", completed: "completed", cancelled: "cancelled", expired: "expired",
};

export default async function StudioOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const rows = (status
    ? db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY event_date DESC LIMIT 100").all(status)
    : db.prepare("SELECT * FROM orders ORDER BY event_date DESC LIMIT 100").all()) as any[];

  return (
    <div>
      <h1 className="display display-md">Orders</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/studio/orders" className="chip" aria-pressed={!status}>all</Link>
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <Link key={k} href={`/studio/orders?status=${k}`} className="chip" aria-pressed={status === k}>{v}</Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="mt-6 text-ink-soft">No orders here yet.</p>
      ) : (
        <ul className="mt-5 divide-y divide-line border border-line rounded-[4px] bg-[#FFFDF9]">
          {rows.map(o => (
            <li key={o.id}>
              <Link href={`/studio/orders/${o.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-cream-100 transition-colors">
                <div>
                  <p className="font-medium num">{o.public_code} · {o.customer_name || "—"} · {o.phone}</p>
                  <p className="num text-[0.85rem] text-ink-soft">
                    {new Date(o.event_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {o.fulfilment} · {formatINR(o.total_paise)}
                  </p>
                </div>
                <span className="status-pill" style={{ background: "#F5E6CB", color: "#562311" }}>{STATUS_LABELS[o.status] ?? o.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
