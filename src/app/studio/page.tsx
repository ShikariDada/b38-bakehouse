import Link from "next/link";
import db from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  awaiting_payment: "awaiting payment",
  partially_paid: "part paid",
  confirmed: "confirmed",
  scheduled: "scheduled",
  in_production: "in production",
  ready: "ready",
  out_for_delivery: "out for delivery",
  completed: "completed",
  cancelled: "cancelled",
  expired: "expired",
};

function Pill({ status }: { status: string }) {
  const tone: Record<string, React.CSSProperties> = {
    awaiting_payment: { background: "#FBEBC3", color: "#742E15" },
    partially_paid: { background: "#FBEBC3", color: "#742E15" },
    confirmed: { background: "#E4EFE2", color: "#2F5530" },
    in_production: { background: "#F5E6CB", color: "#562311" },
    ready: { background: "#E4EFE2", color: "#2F5530" },
    completed: { background: "#EEE9E2", color: "#5D4B42" },
    cancelled: { background: "#F3E0DC", color: "#8D3D1D" },
  };
  return <span className="status-pill" style={tone[status] ?? { background: "#EEE9E2", color: "#5D4B42" }}>{STATUS_LABELS[status] ?? status}</span>;
}

export default function StudioDashboard() {
  const today = new Date().toISOString().slice(0, 10);

  const dueToday = db.prepare(`
    SELECT o.*, d.name AS design_name FROM orders o LEFT JOIN designs d ON d.id = o.design_id
    WHERE o.event_date = ? AND o.status NOT IN ('cancelled','expired') ORDER BY o.created_at
  `).all(today) as any[];

  const upcoming = db.prepare(`
    SELECT o.*, d.name AS design_name FROM orders o LEFT JOIN designs d ON d.id = o.design_id
    WHERE o.event_date > ? AND o.status NOT IN ('cancelled','expired') ORDER BY o.event_date LIMIT 6
  `).all(today) as any[];

  const queue = {
    quotes: (db.prepare("SELECT COUNT(*) c FROM custom_requests WHERE status = 'submitted'").get() as any).c,
    pendingPay: (db.prepare("SELECT COUNT(*) c FROM orders WHERE status = 'awaiting_payment' AND updated_at >= datetime('now','-30 minutes')").get() as any).c,
    unpaid: (db.prepare("SELECT COUNT(*) c FROM orders WHERE status = 'awaiting_payment' AND updated_at < datetime('now','-30 minutes')").get() as any).c,
  };

  // week capacity strip
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() + i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    const row = db.prepare("SELECT max_points, blocked FROM capacity_days WHERE date = ?").get(iso) as any;
    const load = (db.prepare(`
      SELECT COALESCE(SUM(capacity_points),0) pts FROM orders WHERE event_date = ? AND status NOT IN ('cancelled','expired','refunded')
      AND (status != 'awaiting_payment' OR updated_at >= datetime('now','-30 minutes'))
    `).get(iso) as any).pts;
    return { iso, load, max: row?.blocked ? 0 : (row?.max_points ?? 6) };
  });

  return (
    <div>
      <h1 className="display display-md">Today</h1>
      <p className="num mt-1 text-[0.9rem] text-ink-soft">
        {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </p>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <Link href="/studio/requests" className="panel p-4 hover:border-cocoa-700 transition-colors">
          <p className="num display-sm">{queue.quotes}</p>
          <p className="text-[0.9rem] text-ink-soft">brief{queue.quotes === 1 ? "" : "s"} waiting for a quote</p>
        </Link>
        <div className="panel p-4">
          <p className="num display-sm">{queue.pendingPay}</p>
          <p className="text-[0.9rem] text-ink-soft">payments in progress (held)</p>
        </div>
        <div className="panel p-4">
          <p className="num display-sm">{queue.unpaid}</p>
          <p className="text-[0.9rem] text-ink-soft">unpaid holds expired</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-cocoa-600">Due today</h2>
        {dueToday.length === 0 ? (
          <p className="mt-3 text-ink-soft text-[0.95rem]">Nothing due today. The oven can rest.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border border-line rounded-[4px] bg-[#FFFDF9]">
            {dueToday.map(o => (
              <li key={o.id}>
                <Link href={`/studio/orders/${o.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-cream-100 transition-colors">
                  <div>
                    <p className="font-medium">{o.design_name ?? "Custom cake"} · {o.customer_name}</p>
                    <p className="num text-[0.85rem] text-ink-soft">{o.public_code} · {o.fulfilment} · {formatINR(o.total_paise)}</p>
                  </div>
                  <Pill status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-cocoa-600">This week&rsquo;s oven</h2>
        <div className="mt-3 flex gap-1.5">
          {week.map(d => (
            <div key={d.iso} className="flex-1 text-center">
              <div className="h-20 rounded-[3px] border border-line relative overflow-hidden bg-[#FFFDF9]">
                <div className="absolute bottom-0 left-0 right-0 bg-cocoa-700/80" style={{ height: `${Math.min(100, (d.load / Math.max(1, d.max)) * 100)}%` }} />
              </div>
              <p className="num text-[0.72rem] mt-1 text-ink-soft">{new Date(d.iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "narrow" })} {new Date(d.iso + "T00:00:00").getDate()}</p>
              <p className="num text-[0.72rem] text-ink-soft">{d.load}/{d.max}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-cocoa-600">Coming up</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-ink-soft text-[0.95rem]">No future orders yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border border-line rounded-[4px] bg-[#FFFDF9]">
            {upcoming.map(o => (
              <li key={o.id}>
                <Link href={`/studio/orders/${o.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-cream-100 transition-colors">
                  <div>
                    <p className="font-medium">{o.design_name ?? "Custom cake"} · {o.customer_name}</p>
                    <p className="num text-[0.85rem] text-ink-soft">{new Date(o.event_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {o.public_code}</p>
                  </div>
                  <Pill status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
