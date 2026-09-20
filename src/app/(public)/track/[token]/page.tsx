import Image from "next/image";
import db from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { formatINR } from "@/lib/money";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const STEPS = [
  { key: "awaiting_payment", label: "Awaiting payment" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_production", label: "In the kitchen" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
];

function statusIndex(status: string): number {
  if (status === "partially_paid") return 0;
  const i = STEPS.findIndex(s => s.key === status);
  return i >= 0 ? i : status === "scheduled" ? 2 : 1;
}

export default async function TrackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = db
    .prepare("SELECT * FROM orders WHERE tracking_token_hash = ?")
    .get(hashToken(token)) as {
      id: number; public_code: string; status: string; event_date: string; fulfilment: string;
      spec_json: string; total_paise: number; amount_paid_paise: number; customer_name: string; phone: string;
    } | undefined;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 pt-[calc(var(--header-h)+3rem)] text-center">
        <h1 className="display-sm">This link doesn&rsquo;t match an order.</h1>
        <p className="mt-2 text-ink-soft text-[0.95rem]">Check the link from your confirmation, or message us on WhatsApp.</p>
      </div>
    );
  }

  const spec = JSON.parse(order.spec_json) as {
    quote: { lines: { label: string; paise: number }[]; deliveryPaise: number };
    selection: { designSlug: string; eventDate: string; message?: string };
  };
  const design = db.prepare("SELECT name, number FROM designs WHERE slug = ?").get(spec.selection.designSlug) as { name: string; number: number } | undefined;
  const img = db
    .prepare("SELECT di.card FROM design_images di JOIN designs d ON d.id = di.design_id WHERE d.slug = ? AND di.sort = 0")
    .get(spec.selection.designSlug) as { card: string } | undefined;

  const s = getSettings();
  const idx = statusIndex(order.status);
  const dateLabel = new Date(order.event_date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const balance = order.total_paise - order.amount_paid_paise;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-24">
      <p className="eyebrow text-strawberry-deep">Order {order.public_code}</p>

      <div className="mt-4 flex items-center gap-4">
        {img && (
          <div className="relative w-20 h-20 rounded-[4px] overflow-hidden bg-vanilla-deep shrink-0">
            <Image src={img.card} alt="" fill sizes="80px" className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="display display-md">{design?.name ?? "Custom cake"}</h1>
          <p className="num text-[0.9rem] text-ink-soft mt-0.5">For {dateLabel} · {order.fulfilment === "pickup" ? "Pickup from Krishna Nagar" : "Delivery"}</p>
        </div>
      </div>

      <ol className="mt-9" aria-label="Order status">
        {STEPS.map((st, i) => {
          const done = i <= idx && !["cancelled", "expired"].includes(order.status);
          return (
            <li key={st.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full border-2 mt-1.5" style={{
                  background: done ? "var(--color-strawberry)" : "transparent",
                  borderColor: done ? "var(--color-strawberry)" : "rgba(64,37,26,0.28)",
                }} />
                {i < STEPS.length - 1 && <span className="w-px flex-1 min-h-7" style={{ background: i < idx ? "var(--color-strawberry)" : "var(--color-line)" }} />}
              </div>
              <div className="pb-5">
                <p className={`text-[0.97rem] ${done ? "font-medium" : "text-ink-soft"}`}>{st.label}</p>
                {i === idx && i === 0 && (
                  <p className="text-[0.85rem] text-strawberry-deep mt-1">Your date is held — complete payment to lock it in.</p>
                )}
                {i === idx && i === 2 && <p className="text-[0.85rem] text-ink-soft mt-1">Chhaya has started on your cake.</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <section className="panel p-5">
        <h2 className="eyebrow text-strawberry-deep">What you ordered</h2>
        <dl className="num mt-3 space-y-1.5 text-[0.92rem]">
          {spec.quote.lines.map((l, i) => (
            <div key={i} className="flex justify-between gap-3">
              <dt className="text-ink-soft">{l.label}</dt>
              <dd>{l.paise === 0 ? "included" : formatINR(l.paise)}</dd>
            </div>
          ))}
          <div className="rule pt-2 mt-2 flex justify-between"><dt className="text-ink-soft">Paid so far</dt><dd>{formatINR(order.amount_paid_paise)}</dd></div>
          {balance > 0 && (
            <div className="flex justify-between font-medium"><dt>Balance due</dt><dd>{formatINR(balance)}</dd></div>
          )}
        </dl>
        {balance > 0 && (
          <a href={`/checkout/${order.public_code}?t=${token}`} className="btn btn-gold mt-4 w-full sm:w-auto">Pay balance {formatINR(balance)}</a>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Hi B38, I'm asking about order ${order.public_code}.`)}`}
          className="btn btn-ghost" target="_blank" rel="noopener"
        >
          Ask about this order
        </a>
        <a href={s.mapsLink} className="btn btn-ghost" target="_blank" rel="noopener">Pickup directions</a>
      </div>
    </div>
  );
}
