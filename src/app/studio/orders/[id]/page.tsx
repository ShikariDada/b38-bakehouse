import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

const TRANSITIONS: Record<string, string[]> = {
  awaiting_payment: ["confirmed", "cancelled"],
  partially_paid: ["confirmed", "cancelled"],
  confirmed: ["in_production", "cancelled"],
  in_production: ["ready", "cancelled"],
  ready: ["out_for_delivery", "completed"],
  out_for_delivery: ["completed"],
  completed: [],
};

async function transition(formData: FormData) {
  "use server";
  const { getStudioAction } = await import("@/lib/studio-actions");
  await getStudioAction().transition(formData);
}

async function verifyPayment(formData: FormData) {
  "use server";
  const { getStudioAction } = await import("@/lib/studio-actions");
  await getStudioAction().verifyPayment(formData);
}

export default async function StudioOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
  if (!o) notFound();
  const spec = JSON.parse(o.spec_json);
  const events = db.prepare("SELECT * FROM order_events WHERE order_id = ? ORDER BY id").all(o.id) as any[];
  const payments = db.prepare("SELECT * FROM payments WHERE order_id = ? ORDER BY id DESC").all(o.id) as any[];
  const design = o.design_id ? db.prepare("SELECT name, number FROM designs WHERE id = ?").get(o.design_id) as any : null;
  const quote = o.quote_id ? db.prepare("SELECT * FROM quotes WHERE id = ?").get(o.quote_id) as any : null;
  void quote;

  return (
    <div>
      <Link href="/studio/orders" className="text-[0.88rem] text-ink-soft underline-offset-2 hover:underline">← Orders</Link>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display display-md num">{o.public_code}</h1>
        <p className="num text-[0.95rem] text-ink-soft">
          {new Date(o.event_date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} · {o.fulfilment}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="eyebrow text-cocoa-600">Production summary</h2>
            <dl className="num mt-3 text-[0.93rem] space-y-1.5">
              {(spec?.quote?.lines ?? spec?.quoteSpec?.lines ?? []).map((l: any, i: number) => (
                <div key={i} className="flex justify-between gap-3">
                  <dt className="text-ink-soft">{l.label}{l.detail ? ` — ${l.detail}` : ""}</dt>
                  <dd>{l.paise ? formatINR(l.paise) : "included"}</dd>
                </div>
              ))}
            </dl>
            {spec?.selection?.message && <p className="mt-3 text-[0.93rem]"><span className="text-ink-soft">Message: </span>“{spec.selection.message}”</p>}
            {spec?.quoteSpec?.spec && <pre className="mt-3 whitespace-pre-wrap font-sans text-[0.93rem]">{spec.quoteSpec.spec}</pre>}
            {design && <p className="num mt-3 text-[0.85rem] text-ink-soft">Base design: No. {String(design.number).padStart(2, "0")} · {design.name}</p>}
          </section>

          <section className="panel p-5">
            <h2 className="eyebrow text-cocoa-600">Customer</h2>
            <p className="mt-2 num text-[0.95rem]">{o.customer_name} · <a href={`tel:+91${o.phone}`} className="underline underline-offset-2">{o.phone}</a></p>
            {o.email && <p className="text-[0.9rem] text-ink-soft">{o.email}</p>}
            {o.address_json && (() => { const a = JSON.parse(o.address_json); return <p className="mt-2 text-[0.93rem]">{a.line || ""}{a.pincode ? `, ${a.pincode}` : ""}</p>; })()}
            <a
              className="mt-3 inline-block text-[0.9rem] underline underline-offset-2"
              target="_blank" rel="noopener"
              href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(`Hi ${o.customer_name}, this is B38 Bake House about your order ${o.public_code}.`)}`}
            >
              WhatsApp the customer
            </a>
          </section>

          <section className="panel p-5">
            <h2 className="eyebrow text-cocoa-600">Timeline</h2>
            <ul className="mt-3 space-y-2 text-[0.9rem]">
              {events.map(e => (
                <li key={e.id} className="flex gap-3">
                  <span className="num text-ink-soft w-28 shrink-0">{new Date(e.created_at + "Z").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} {new Date(e.created_at + "Z").toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span><span className="font-medium">{e.to_status.replace(/_/g, " ")}</span>{e.note ? ` — ${e.note}` : ""}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-5">
          <section className="panel p-5">
            <h2 className="eyebrow text-cocoa-600">Money</h2>
            <dl className="num mt-3 text-[0.93rem] space-y-1.5">
              <div className="flex justify-between"><dt className="text-ink-soft">Total</dt><dd>{formatINR(o.total_paise)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-soft">Paid</dt><dd>{formatINR(o.amount_paid_paise)}</dd></div>
              <div className="flex justify-between font-medium"><dt>Balance</dt><dd>{formatINR(o.total_paise - o.amount_paid_paise)}</dd></div>
            </dl>
            {payments.length > 0 && (
              <ul className="mt-3 border-t border-line pt-3 space-y-2 text-[0.88rem]">
                {payments.map(p => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span className="text-ink-soft num">{p.provider}/{p.method} · {formatINR(p.amount_paise)}{p.utr ? ` · ${p.utr}` : ""}</span>
                    {p.status === "pending" && o.status === "awaiting_payment" ? (
                      <form action={verifyPayment}>
                        <input type="hidden" name="paymentId" value={p.id} />
                        <input type="hidden" name="orderId" value={o.id} />
                        <button className="btn btn-gold !py-1.5 !px-3 text-[0.8rem]">Verify paid</button>
                      </form>
                    ) : (
                      <span className="status-pill" style={{ background: p.status === "succeeded" ? "#E4EFE2" : "#F3E0DC", color: p.status === "succeeded" ? "#2F5530" : "#8D3D1D" }}>{p.status}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel p-5">
            <h2 className="eyebrow text-cocoa-600">Move to</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(TRANSITIONS[o.status] ?? []).map(to => (
                <form key={to} action={transition}>
                  <input type="hidden" name="orderId" value={o.id} />
                  <input type="hidden" name="to" value={to} />
                  <button className="btn btn-cocoa !py-2 !px-3.5 text-[0.88rem]">{to.replace(/_/g, " ")}</button>
                </form>
              ))}
              {(TRANSITIONS[o.status] ?? []).length === 0 && <p className="text-[0.9rem] text-ink-soft">This order is settled.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
