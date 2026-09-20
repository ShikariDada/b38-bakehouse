import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { formatINR } from "@/lib/money";
import { getSettings } from "@/lib/settings";
import { PayPanel } from "@/components/pay-panel";

export const dynamic = "force-dynamic";

type Order = {
  id: number;
  public_code: string;
  customer_name: string;
  phone: string;
  email: string | null;
  event_date: string;
  fulfilment: string;
  address_json: string | null;
  spec_json: string;
  status: string;
  total_paise: number;
  amount_paid_paise: number;
};

async function saveContact(formData: FormData) {
  "use server";
  const code = String(formData.get("code"));
  const token = String(formData.get("token"));
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").replace(/\D/g, "");
  const email = String(formData.get("email") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (name.length < 2) return;
  if (phone.length !== 10) return;

  const order = db
    .prepare("SELECT id, fulfilment, address_json FROM orders WHERE public_code = ? AND tracking_token_hash = ?")
    .get(code, hashToken(token)) as { id: number; fulfilment: string; address_json: string | null } | undefined;
  if (!order) return;

  const addr = order.fulfilment === "delivery"
    ? JSON.stringify({ ...(order.address_json ? JSON.parse(order.address_json) : {}), line: address })
    : order.address_json;

  db.prepare("UPDATE orders SET customer_name = ?, phone = ?, email = ?, address_json = ?, updated_at = datetime('now') WHERE id = ?")
    .run(name, phone, email || null, addr, order.id);
  redirect(`/checkout/${code}?t=${token}`);
}

export default async function CheckoutPage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ t?: string }> }) {
  const { code } = await params;
  const { t } = await searchParams;
  if (!t) notFound();

  const order = db
    .prepare("SELECT * FROM orders WHERE public_code = ? AND tracking_token_hash = ?")
    .get(code, hashToken(t)) as Order | undefined;
  if (!order) notFound();

  if (["confirmed", "partially_paid"].includes(order.status)) redirect(`/track/${t}`);

  const spec = JSON.parse(order.spec_json) as { quote: { lines: { label: string; detail?: string; paise: number }[]; deliveryPaise: number }; selection: { eventDate: string } };
  const s = getSettings();
  const needContact = !order.phone || order.phone.replace(/\D/g, "").length !== 10;
  const dateLabel = new Date(order.event_date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-24">
      <div className="rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep">Checkout</p>
        <h1 className="display display-md mt-3">Almost there</h1>
        <p className="num mt-2 text-[0.9rem] text-ink-soft">
          Order {order.public_code} · for {dateLabel}
        </p>
      </div>

      <section className="mt-7 rounded-[24px] bg-cream border border-line p-6 rv" data-delay="100">
        <h2 className="eyebrow text-strawberry-deep">Your cake</h2>
        <dl className="num mt-4 space-y-1.5 text-[0.93rem]">
          {spec.quote.lines.map((l, i) => (
            <div key={i} className="flex justify-between gap-3">
              <dt className="text-ink-soft">{l.label}{l.detail ? <span className="block text-[0.78rem] opacity-70">{l.detail}</span> : null}</dt>
              <dd>{l.paise === 0 ? "included" : formatINR(l.paise)}</dd>
            </div>
          ))}
          {spec.quote.deliveryPaise > 0 && (
            <div className="flex justify-between"><dt className="text-ink-soft">Delivery</dt><dd>{formatINR(spec.quote.deliveryPaise)}</dd></div>
          )}
          <div className="border-t border-line pt-2.5 mt-2.5 flex justify-between font-medium">
            <dt>Total{order.amount_paid_paise > 0 ? " due now" : ""}</dt>
            <dd>{formatINR(order.total_paise - order.amount_paid_paise)}</dd>
          </div>
        </dl>
      </section>

      {needContact ? (
        <section className="mt-7 rounded-[24px] bg-cream border border-line p-6 rv" data-delay="160">
          <h2 className="eyebrow text-strawberry-deep">Who is this for?</h2>
          <form action={saveContact} className="mt-4 grid gap-4">
            <input type="hidden" name="code" value={order.public_code} />
            <input type="hidden" name="token" value={t} />
            <div>
              <label htmlFor="name" className="field-label">Your name *</label>
              <input id="name" name="name" required minLength={2} className="field" autoComplete="name" defaultValue={order.customer_name} />
            </div>
            <div>
              <label htmlFor="phone" className="field-label">Phone * <span className="font-normal text-ink-soft">(so we can coordinate delivery or pickup)</span></label>
              <input id="phone" name="phone" required inputMode="numeric" pattern="\d{10}" maxLength={10} className="field num" autoComplete="tel" placeholder="10-digit mobile" />
            </div>
            <div>
              <label htmlFor="email" className="field-label">Email <span className="font-normal text-ink-soft">(optional, for the receipt)</span></label>
              <input id="email" name="email" type="email" className="field" autoComplete="email" />
            </div>
            {order.fulfilment === "delivery" && (
              <div>
                <label htmlFor="address" className="field-label">Delivery address *</label>
                <textarea id="address" name="address" required rows={2} className="field" placeholder="House / flat, street, landmark" />
              </div>
            )}
            <button className="btn btn-primary w-full sm:w-auto">Save details</button>
          </form>
        </section>
      ) : (
        <section className="mt-7 rv" data-delay="160">
          <h2 className="eyebrow text-strawberry-deep">Paying</h2>
          <p className="mt-2 text-[0.95rem] text-ink-soft max-w-md">
            Your date is held for 30 minutes. You&rsquo;ll pay the exact amount shown: there&rsquo;s no field to type an amount into.
          </p>
          <PayPanel code={order.public_code} token={t} amountPaise={order.total_paise - order.amount_paid_paise} upiConfigured={!!s.upiVpa} />
          <p className="mt-4 text-[0.82rem] text-ink-soft">
            Questions before paying? <a className="underline underline-offset-2 hover:text-strawberry-deep" href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Hi B38, I'm asking about order ${order.public_code}.`)}`} target="_blank" rel="noopener">Message us on WhatsApp</a>.
          </p>
        </section>
      )}
    </div>
  );
}
